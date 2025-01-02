
import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from '@/lib/util/action';
export async function POST(request: NextRequest) {
      const message = await request.json();
      const res = await generateChatResponse(message);
     return  NextResponse.json(res);
}