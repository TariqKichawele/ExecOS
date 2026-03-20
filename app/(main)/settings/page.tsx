import { CalendarIcon, MailIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const providers = [
    {
        key: "gmail",
        name: "Gmail",
        description: "Read and manage your emails",
        icon: MailIcon
    },
    {
        key: "google_calendar",
        name: "Google Calendar",
        description: "Read and manage your calendar events",
        icon: CalendarIcon
    }
];

const Settings = () => {
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
                        {false ? (
                            <div className="integration-actions">
                                <Badge variant={'default'} className='bg-primary'>Connected</Badge>
                            </div>
                        ) : (
                            <Button>
                                <a href={`/api/auth/google?provider=${provider.key}`}>
                                    Connect
                                </a>
                            </Button>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  )
}

export default Settings;