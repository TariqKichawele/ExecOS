import type { gmail_v1 } from "googleapis";

export interface ParsedEmail {
    id: string;
    threadId: string;
    subject: string;
    from: string;
    to: string;
    body: string;
    date: string;
    snippet: string;
}

export async function fetchUnreadEmails(gmail: gmail_v1.Gmail, maxResults: 10): Promise<ParsedEmail[]> {
    const response = await gmail.users.messages.list({
        userId: 'me',
        q: "is:unread newer_than:7d",
        maxResults
    });

    console.log(`Gmail: found ${response.data.messages?.length ?? 0} unread emails`);

    const messageIds = response.data.messages ?? [];
    if (messageIds.length === 0) {
        return [];
    }

    const emails = await Promise.all(
        messageIds.map(async (messageId) => {
            const message = await gmail.users.messages.get({
                userId: 'me',
                id: messageId.id!,
                format: 'full'
            });
            return parseGmailMessage(message.data);
        })
    );

    return emails;
}

function parseGmailMessage(message: gmail_v1.Schema$Message): ParsedEmail {
    const headers = message.payload?.headers ?? [];
    const getHeader = (name: string) => {
        return headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
    }

    let body = '';
    const payload = message.payload;

    if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64url').toString('utf-8');
      } else if (payload?.parts) {
        const textPart = payload.parts.find((p) => p.mimeType === 'text/plain');
        const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html');
        const part = textPart ?? htmlPart;
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, 'base64url').toString('utf-8');
        }
    }

    return {
        id: message.id!,
        threadId: message.threadId!,
        subject: getHeader('Subject'),
        from: getHeader('From'),
        to: getHeader('To'),
        body,
        date: getHeader('Date'),
        snippet: getHeader('Snippet'),
    };
}