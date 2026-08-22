import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface BasketDetailsBody {
  query: string;
  limit?: number;
  filter?: string;
  // Add other Shopify payload fields here
}

const SECRET = process.env.SHOPIFY_CLIENT_SECRET;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Get the signature header
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    if (!hmacHeader) {
      return new NextResponse('Missing signature header', { status: 401 });
    }

    // 2. Read the RAW unparsed request bytes
    const arrayBuffer = await request.arrayBuffer();
    const rawBodyBuf = Buffer.from(arrayBuffer);

    // 3. Compute the expected HMAC signature
    const generatedHmac = crypto
      .createHmac('sha256', SECRET)
      .update(rawBodyBuf)
      .digest('base64');

    // 4. Securely compare signatures using constant-time check
    const isSafe = crypto.timingSafeEqual(
      Buffer.from(hmacHeader, 'base64'),
      Buffer.from(generatedHmac, 'base64')
    );

    if (!isSafe) {
      return new NextResponse('Unauthorized webhook source', { status: 401 });
    }

    // --- YOUR SECURE AREA ---
    // The webhook is proven to be from Shopify. Safe to read the data.
    const jsonString = rawBodyBuf.toString('utf8');
    const body = JSON.parse(jsonString) as BasketDetailsBody;
    const payload = JSON.parse(jsonString);
    
    // Grab the shop name to know who sent it
    const shopDomain = request.headers.get('x-shopify-shop-domain');
    console.log(`Verified webhook from ${shopDomain}`);

        

    // Type safety is now active and secure
    console.log(`Processing search query: ${body.query}`);

    return new NextResponse('OK', { status: 200 });
    // TODO: Process the payload data here
    // ------------------------

    // 5. Acknowledge receipt to Shopify with a 200 OK status
    return new NextResponse('Webhook handled successfully', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
