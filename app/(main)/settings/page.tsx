import { CalendarIcon, MailIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getOrCreateUser, getUserIntegrations } from '@/db/queries';

const Settings = async () => {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-in");

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";
    const user = await getOrCreateUser(clerkId, email, name);

    const userIntegrations = await getUserIntegrations(user.id)
    const gmailIntegration = userIntegrations.find((integration) => integration.provider === "gmail")
    const googleCalendarIntegration = userIntegrations.find((integration) => integration.provider === "google_calendar")

    const providers = [
        {
            key: "gmail",
            name: "Gmail",
            description: "Read and manage your emails",
            icon: MailIcon,
            integration: gmailIntegration
        },
        {
            key: "google_calendar",
            name: "Google Calendar",
            description: "Read and manage your calendar events",
            icon: CalendarIcon,
            integration: googleCalendarIntegration
        }
    ];
  return (
    <div className="page-wrapper">
        <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-description">
                Manage your integrations and preferences
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Google Integrations</CardTitle>
                <CardDescription>
                    Connect your Google accounts to enable AI assistance
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                {providers.map((provider) => (
                    <div key={provider.key} className="integration-row">
                        <div className="integration-info">
                            <provider.icon className='integration-icon' />
                            <div>
                                <p className="font-medium text-foreground">{provider.name}</p>
                                <p className='status-label'>{provider.description}</p>
                            </div>
                        </div>
                        {provider.integration ? (
                            <div className="integration-actions">
                                <Badge variant={'default'} className='bg-primary'>Connected</Badge>
                            </div>
                        ) : (
                            <a
                                href={`/api/auth/google?provider=${provider.key}`}
                                className={cn(
                                    buttonVariants({ variant: 'default' }),
                                    'inline-flex w-full justify-center sm:w-auto',
                                )}
                            >
                                Connect
                            </a>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  )
}

export default Settings;