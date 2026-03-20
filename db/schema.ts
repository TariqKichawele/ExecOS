import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    jsonb,
    integer,
    pgEnum
} from "drizzle-orm/pg-core";


export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "none",
    "active",
    "canceled",
    "past_due"
]);

export const integrationProviderEnum = pgEnum("integration_provider", [
    "gmail",
    "google_calendar"
]);

export const taskStatusEnum = pgEnum("task_status", [
    "pending",
    "completed",
    "cancelled"
]);

export const taskPriorityEnum = pgEnum("task_priority", [
    "low",
    "medium",
    "high"
]);

export const agentRunStatusEnum = pgEnum("agent_run_status", [
    "running",
    "success",
    "failed"
]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status").notNull().default("none"),
    subscriptionId: text("subscription_id"),
    agentEnabled: boolean("agent_enabled").notNull().default(true),
    onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
    preferences: jsonb("preferences").notNull().default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const integrations = pgTable("integrations", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: integrationProviderEnum("provider").notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    scope: text("scope").array().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),  
});

export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("pending"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    dueDate: timestamp("due_date"),
    createdByAgent: boolean("created_by_agent").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
});

export interface ActionLogEntry {
    emailId: string;
    subject: string;
    from: string;
    date: string;
    status: "success" | "error";
    summary?: string;
    priority?: string;
    category?: string;
    needsReply?: boolean;
    draftReply?: string | null;
    actionItems?: {
        title: string;
        description: string;
        dueDate: string | null;
    }[];
    tasksCreated?: number;
    draftCreated?: boolean;
    eventsCreated?: number;
}

export const agentRuns = pgTable("agent_runs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: agentRunStatusEnum("status").notNull().default("running"),
    summary: text("summary"),
    actionsLog: jsonb("actions_log").notNull().default([]).$type<ActionLogEntry[]>(),
    emailsProcessed: integer("emails_processed").notNull().default(0),
    tasksCreated: integer("tasks_created").notNull().default(0),
    draftsCreated: integer("drafts_created").notNull().default(0),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    durationMs: integer("duration_ms")
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type AgentRun = typeof agentRuns.$inferSelect;
export type NewAgentRun = typeof agentRuns.$inferInsert;

export type ProcessedEmail = ActionLogEntry & { processedAt: Date };


