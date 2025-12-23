
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AutomatedNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Automated Notifications</CardTitle>
        <CardDescription>Configure triggers for automated messages on events like tier upgrades or expiring points.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Notification trigger configuration settings will go here.</p>
      </CardContent>
    </Card>
  );
}

    