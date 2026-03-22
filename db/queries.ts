import { db } from "./index";
import { and, eq } from "drizzle-orm";
import { ActionLogEntry, agentRuns, integrations, users } from "./schema";
import { GoogleProvider } from "@/lib/google";

export async function getUserByClerkId(clerkId: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    return user ?? null;
}

export async function getOrCreateUser(clerkId: string, email: string, name?: string) {
    const existingUser = await getUserByClerkId(clerkId);

    if (existingUser) {
        return existingUser;
    }

    const [newUser] = await db.insert(users).values({ clerkId, email, name: name ?? null }).returning();
    return newUser;
}

export async function getIntegration(userId: string, provider: GoogleProvider) {
    const [integration] = await db
        .select()
        .from(integrations)
        .where(and(eq(integrations.provider, provider), eq(integrations.userId, userId)),)
        .limit(1);

    return integration ?? null;
}

export async function upsertIntegration(data: {
    userId: string;
    provider: GoogleProvider;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    scope: string[];
}) {
    const existing = await getIntegration(data.userId, data.provider);
    if (existing) {
        return db.update(integrations).set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
            scope: data.scope,
        }).where(eq(integrations.id, existing.id)).returning();
    } else {
        return db.insert(integrations).values({
            userId: data.userId,
            provider: data.provider,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
            scope: data.scope,
        }).returning({id: integrations.id});
    }
}

export async function getUserIntegrations(userId: string) {
    const results = await db.select().from(integrations).where(eq(integrations.userId, userId));

    return results ?? [];
}

export async function createAgentRun(userId: string) {
    const [result] = await db
        .insert(agentRuns)
        .values({ userId, status: "running" })
        .returning();

    return result ?? null;
}

export async function completeAgentRun(agentRunId: string, data: {
    status: "success" | "failed";
    summary: string;
    actionsLog: ActionLogEntry[];
    emailsProcessed: number;
    tasksCreated: number;
    draftsCreated: number;
    errorMessage?: string;
    durationMs: number;
}) {
    const [run] = await db
        .update(agentRuns)
        .set({
            ...data, 
            completedAt: new Date()
        })
        .where(eq(agentRuns.id, agentRunId))
        .returning();

    return run ?? null;
}
