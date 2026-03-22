import { completeAgentRun, createAgentRun } from "@/db/queries";
import { getGmailClient, getGoogleCalendarClient } from "./google-client";
import { fetchUnreadEmails } from "./agents/gmail";

export async function runAgent(userId: string) {
    const startTime = Date.now();
    try {
        //create agent run by user id
        const agentRun = await createAgentRun(userId);
        // get gmail client
        const gmailClient = await getGmailClient(userId);
        if (!gmailClient) {
            const run = await completeAgentRun(agentRun.id, {
                status: "failed",
                summary: "Gmail client not found",
                actionsLog: [],
                emailsProcessed: 0,
                tasksCreated: 0,
                draftsCreated: 0,
                errorMessage: "Gmail client not found",
                durationMs: Date.now() - startTime
            });
            return {
                runId: run?.id,
                status: "failed" as const,
                summary: "Gmail not connected"
            }
        }
        // fetch unread emails
        const emails = await fetchUnreadEmails(gmailClient, 10);
        if (emails.length === 0) {
            const run = await completeAgentRun(agentRun.id, {
                status: "success",
                summary: "No emails to process",
                actionsLog: [],
                emailsProcessed: 0,
                tasksCreated: 0,
                draftsCreated: 0,
                durationMs: Date.now() - startTime
            });
            return {
                runId: run?.id,
                status: "success" as const,
                summary: "No emails to process"
            }
        }
        // fetch calendar events
        const calendarClient = await getGoogleCalendarClient(userId);

        let upcomingEvents: CalendarEvent[] = [];
        if (calendarClient) {
            try {
                upcomingEvents = await fetchUpcomingEvents(calendarClient, 24);
            } catch (error) {
                console.error("Error fetching calendar events", error);
            }
        }
        // process each email with AI
        
        // create gmail draft if reply is needed
        // create calendar event if event is needed
        // mark email as read
        // aggregate the results
        // log completed agent run
        // return the results
    } catch (error) {
        console.error("Agent run error", error);
        return { error: "Agent run error" };
    }
    return { message: "Agent run success" };
}