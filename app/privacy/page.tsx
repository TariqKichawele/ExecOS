import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ExecOS",
  description:
    "How ExecOS collects, uses, stores, and shares data—including Google user data from Gmail and Google Calendar.",
};

const LAST_UPDATED = "March 25, 2026";

export default function PrivacyPage() {
  const privacyEmail =
    process.env.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL ?? "privacy@execos.com";

  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="landing-header-inner flex items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="page-title mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Who we are
            </h2>
            <p className="text-muted-foreground">
              This Privacy Policy describes how <strong>ExecOS</strong> (“we,”
              “us,” or “our”) handles personal information when you use our
              autonomous assistant product (the “Service”). ExecOS helps you
              manage email and calendar workflows using your connected accounts
              and, where enabled, AI-assisted analysis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Information we collect from Google
            </h2>
            <p className="text-muted-foreground">
              When you connect Google services, we access Google user data only
              with your consent and only for the scopes you approve during OAuth.
              In particular, we may request:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Gmail:</strong>{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  gmail.readonly
                </code>
                ,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  gmail.modify
                </code>
                , and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  gmail.compose
                </code>
                . This allows the Service to read message content and metadata
                needed to process your inbox, create drafts, apply labels or
                read-state changes as part of automated workflows, and compose
                messages where that functionality is part of the product.
              </li>
              <li>
                <strong>Google Calendar:</strong>{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  calendar.readonly
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  calendar.events
                </code>
                . This allows the Service to read upcoming events and create or
                update calendar events when you use scheduling features tied to
                your email or agent runs.
              </li>
            </ul>
            <p className="text-muted-foreground">
              We also store OAuth tokens (access token, refresh token, expiry,
              and granted scopes) so the Service can maintain your integration
              until you disconnect or delete your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              How we use Google user data
            </h2>
            <p className="text-muted-foreground">
              We use Google user data{" "}
              <strong>
                solely to provide and improve the functionality of ExecOS
              </strong>
              —for example to read recent unread mail you ask us to process,
              summarize or categorize messages, create tasks from your messages,
              create Gmail drafts for your review, mark messages as read when
              processing completes, read upcoming calendar context to avoid
              conflicts or duplicate events, and create calendar events when the
              product determines a meeting or reminder is appropriate. We do{" "}
              <strong>not</strong> sell Google user data. We do{" "}
              <strong>not</strong> use Google user data for advertising. We do{" "}
              <strong>not</strong> use Google user data for purposes unrelated to
              the Service’s features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              AI processing
            </h2>
            <p className="text-muted-foreground">
              To generate summaries, suggested replies, tasks, and calendar
              proposals, portions of your email content (such as headers, subject,
              and body) and short descriptions of upcoming calendar events may be
              sent to <strong>Anthropic</strong> (or another model provider we
              configure) for processing. That transfer is limited to what is
              needed for those in-product features. We do not sell this content.
              Model providers process data under their own terms and privacy
              policies; you should review those materials to understand their
              handling of information we transmit when providing the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Other information we collect
            </h2>
            <p className="text-muted-foreground">
              We use <strong>Clerk</strong> for authentication. Clerk may process
              account details such as your email address and name to sign you in.
              We also store a local user profile (for example subscription state,
              preferences, tasks created by the agent, and agent run history)
              in our database to operate the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              How we store and protect data
            </h2>
            <p className="text-muted-foreground">
              Google OAuth tokens and other sensitive integration secrets are
              stored in our database using encryption at rest where we apply
              field-level encryption. Data is transmitted over HTTPS between your
              browser and our servers. Access to operational systems is restricted
              to authorized personnel and subprocessors needed to host and
              maintain the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Sharing and subprocessors
            </h2>
            <p className="text-muted-foreground">
              We share information with service providers that help us run the
              Service (for example cloud hosting, database, authentication, email
              delivery infrastructure if applicable, and AI inference providers
              as described above). These parties may process Google user data
              only on our instructions and for the purpose of providing the
              Service. We do not disclose Google user data to third parties for
              their independent marketing or unrelated commercial purposes. We do
              not sell personal information, including Google user data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Retention and deletion
            </h2>
            <p className="text-muted-foreground">
              We retain Google OAuth tokens and integration records until you
              disconnect Gmail or Google Calendar in Settings or we delete them
              as part of account closure. Disconnecting triggers revocation with
              Google where possible and removes stored tokens and integration
              metadata from our systems. Agent run logs may include message
              identifiers, subjects, senders, and draft text generated for you; we
              retain these records for operational troubleshooting and product
              improvement unless you ask us to delete them or applicable law
              requires otherwise. If you need deletion of retained logs or other
              data, contact us using the email below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Children</h2>
            <p className="text-muted-foreground">
              The Service is not directed to children under 13 (or the minimum
              age required in your region), and we do not knowingly collect their
              personal information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              International transfers
            </h2>
            <p className="text-muted-foreground">
              If you access the Service from outside the country where our
              servers or subprocessors are located, your information may be
              transferred across borders. We take steps consistent with
              applicable law to protect that information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Changes to this policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy when our practices change,
              including when we add Google APIs, change scopes, or modify how we
              use Google user data. When we do, we will revise the “Last updated”
              date above. If changes materially affect Google user data, we will
              take reasonable steps to notify you (for example via the Service or
              email) and obtain renewed consent where required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Legal review
            </h2>
            <p className="text-muted-foreground">
              This policy is intended to describe ExecOS’s actual product
              behavior in plain language. You should have qualified legal counsel
              review it before you submit your application for Google OAuth
              verification or rely on it to meet regulatory obligations in your
              jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
            <p className="text-muted-foreground">
              Questions about this Privacy Policy or Google user data practices
              may be sent to{" "}
              <a
                className="font-medium text-primary underline-offset-4 hover:underline"
                href={`mailto:${privacyEmail}`}
              >
                {privacyEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
