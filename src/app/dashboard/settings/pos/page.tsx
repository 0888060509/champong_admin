import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PosSettingsPage() {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">POS365 Integration</CardTitle>
                <CardDescription>Securely manage your POS365 API credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input id="api-key" type="password" defaultValue="********************" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="api-secret">API Secret</Label>
                        <Input id="api-secret" type="password" defaultValue="********************************" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Configuration Log</CardTitle>
                <CardDescription>Tracks changes to the POS365 configuration.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">admin@example.com</span> updated API credentials on <span className="font-mono">2023-10-20 14:30 UTC</span>.</li>
                     <li><span className="font-semibold text-foreground">admin@example.com</span> updated API credentials on <span className="font-mono">2023-08-15 09:00 UTC</span>.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
