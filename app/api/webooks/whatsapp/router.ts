import crypto from "node:crypto";

export const runtime = "nodejs";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const META_APP_SECRET = process.env.META_APP_SECRET;

// Meta calls GET when you initially configure the webhook.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    token === VERIFY_TOKEN
  ) {
    console.log("WhatsApp webhook verified");

    return new Response(challenge, {
      status: 200,
    });
  }

  console.error("WhatsApp webhook verification failed");

  return new Response("Forbidden", {
    status: 403,
  });
}

// Meta calls POST when an actual webhook event occurs.
export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifySignature(request, rawBody)) {
    console.error("Invalid WhatsApp webhook signature");

    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const payload = JSON.parse(rawBody);

  console.log(
    "WhatsApp webhook received",
    JSON.stringify(payload, null, 2),
  );

  // We'll put BullMQ code here next.

  return new Response("EVENT_RECEIVED", {
    status: 200,
  });
}

function verifySignature(
  request: Request,
  body: string,
) {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    throw new Error(
      "META_APP_SECRET environment variable is missing",
    );
  }

  const signature =
    request.headers.get("x-hub-signature-256");

  if (!signature) {
    return false;
  }

  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", appSecret)
      .update(body)
      .digest("hex");

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    receivedBuffer.length !== expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}