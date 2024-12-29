import { fetchRagResults } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

      const astraDoc = request.nextUrl.searchParams.get("astraDoc");
      const currentPage = request.nextUrl.searchParams.get("currentPage") as unknown as  number;

      const res = await fetchRagResults(astraDoc as string, currentPage * 2, 2);


     return  NextResponse.json({res});

}