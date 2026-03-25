import RunAgentButton from "@/components/agents/run-agent-button";
import { getLatestAgentRun, getOrCreateUser, getUnreadEmails, getUserIntegrations } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2Icon, CircleIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

const Dashboard = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";
  const user = await getOrCreateUser(clerkId, email, name);

  const latestRun = await getLatestAgentRun(user.id);

  const userIntegrations = await getUserIntegrations(user.id);
  const gmailConnected = userIntegrations.some(
    (integration) => integration.provider === "gmail",
  );
  const googleCalendarConnected = userIntegrations.some(
    (integration) => integration.provider === "google_calendar",
  );

  const { has } = await auth();
  const isPaidUser = has({ plan: "pro_plan" });

  const onboardingSteps = [
    {
      name: "Connect Gmail",
      completed: gmailConnected,
      href: "/settings",
    },
    {
      name: "Connect Google Calendar",
      completed: googleCalendarConnected,
      href: "/settings",
    },
    {
      name: "Subscribe to activate agent",
      completed: isPaidUser,
      href: "/settings",
    },
  ];

  const completedCount = onboardingSteps.filter(
    (step) => step.completed,
  ).length;
  const progressPercent = Math.round(
    (completedCount / onboardingSteps.length) * 100,
  );

  const isAgentReady =
    gmailConnected && googleCalendarConnected && isPaidUser;

  console.log(isAgentReady);

  const { emailsProcessed, draftsCreated, tasksCreated } = await getUnreadEmails(user.id);
  return (
    <div className="page-wrapper">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          {"Welcome back! Here's what's happening with your AI Agents."}
        </p>
      </div>

      <div className="space-y-4">
        {!user.onboardingCompleted && (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Complete these steps to activate your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content-stack">
              <div className="card-content-stack-sm">
                {onboardingSteps.map((step, index) => (
                  <Link key={step.name} href={step.href}>
                    <div className="onboarding-step">
                      {step.completed ? (
                        <CheckCircle2Icon className="sidebar-icon text-primary" />
                      ) : (
                        <CircleIcon className="sidebar-icon text-muted-foreground" />
                      )}
                      <span
                        className={
                          step.completed ? "onboarding-step-completed" : ""
                        }
                      >
                        {index + 1}. {step.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Progress
                value={progressPercent}
                className="onboarding-progress"
              />
              <p className="status-label">
                {completedCount} of {onboardingSteps.length} steps complete
              </p>
            </CardContent>
          </Card>
        )}
        <div className="stats-grid-2">
          <Card>
            <CardHeader>
              <CardTitle className="card-title-with-icon">
                <ZapIcon className="sidebar-icon" />
                Agent Status
              </CardTitle>

              <CardDescription>
                Subscribe to activate the autonomous agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="card-content-stack">
                <div className="status-row">
                  <span className="status-label">Status</span>
                  <Badge
                    variant={isAgentReady ? "default" : "secondary"}
                    className={isAgentReady ? "bg-primary" : undefined}
                  >
                    {isAgentReady ? "Ready" : "Not ready"}
                  </Badge>
                </div>
                <div className="status-row">
                  <span className="status-label">Gmail</span>
                  <span className="status-value">
                    {gmailConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <RunAgentButton
                  disabled={!gmailConnected && !googleCalendarConnected}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Agent Run</CardTitle>
              <CardDescription>
                {latestRun ? "Most Recent Activity" : "No runs yet"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="card-content-stack-sm">
                {[
                  {
                    label: "Time",
                    value: latestRun?.startedAt
                      ? new Date(latestRun.startedAt).toLocaleString()
                      : "N/A",
                  },
                  {
                    label: "Status",
                    value: latestRun?.status || "N/A",
                  },
                  {
                    label: "Summary",
                    value: latestRun?.summary || "N/A",
                  },
                ]?.map((item) => (
                  <div key={item.label} className="status-row gap-4 flex">
                    <span className="status-label">{item.label}</span>
                    <span className="status-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Quick Stats */}
        <div className="stats-grid-3">
          {[
            { label: "Unread Emails", value: emailsProcessed },
            { label: "Drafts Created", value: draftsCreated },
            { label: "Tasks Created", value: tasksCreated },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="stat-card-header">
                <CardTitle className="stat-card-title">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{item.value}</div>
                <p className="stat-card-subtitle">
                  {item.value === 0 ? "No items" : "View all"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
