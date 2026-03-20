import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) return 
    return new Response("Hello")
}