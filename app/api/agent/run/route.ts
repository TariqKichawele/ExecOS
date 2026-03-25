import {
    countFreeManualAgentRuns,
    getUserByClerkId,
    getUsersWithAgentEnabled,
} from "@/db/queries";
import { FREE_MANUAL_RUN_LIMIT } from "@/lib/agent-limits";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(request: NextRequest) {
    const cronSecret = request.headers.get("authorization");
    const isCron = process.env.CRON_SECRET && cronSecret === `Bearer ${process.env.CRON_SECRET}`;
    //2 jobs

    //1: manual run job
    
    //2: auto run job
    if (!isCron) {
        const { userId: clerkId, has } = await auth();
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

        const isPro = has({ plan: "pro_plan" });
        if (!isPro) {
            const used = await countFreeManualAgentRuns(user.id);
            if (used >= FREE_MANUAL_RUN_LIMIT) {
                return NextResponse.json(
                    {
                        message: "Free trial run limit reached. Upgrade to Pro for unlimited runs.",
                        code: "FREE_MANUAL_LIMIT",
                    },
                    { status: 403 },
                );
            }
        }

        const result = await runAgent(
            user.id,
            isPro ? "manual_pro" : "manual_free",
        );
        return NextResponse.json(result, { status: 200 });
    }

    const results = [];
    const eligibleUsers = await getUsersWithAgentEnabled();
    for (const { userId } of eligibleUsers) {
        const result = await runAgent(userId, "cron");
        results.push({
            userId,
            status: result.status,
            summary: result.summary
        })
    }

    return NextResponse.json({ results, processedCount: results.length });
}