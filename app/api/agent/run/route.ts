import { getUserByClerkId } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST() {
    const isCron = process.env.CRON_SECRET;
    //2 jobs
    //1: manual run job
    //2: auto run job
    if (!isCron) {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserByClerkId(clerkId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.agentEnabled) {
            return NextResponse.json({ message: "Agent is disabled" }, { status: 400 });
        }

        const result = await runAgent(user.id);
        return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ message: "Cron Agent run success" }, { status: 200 });
}