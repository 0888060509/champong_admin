import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, Stamp, Trophy } from "lucide-react";

export default function LoyaltyPage() {
  return (
    <Tabs defaultValue="tiers">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="tiers">
            <Gem className="mr-2 h-4 w-4" />
            Member Tiers
          </TabsTrigger>
          <TabsTrigger value="stamps">
            <Stamp className="mr-2 h-4 w-4" />
            Stamps
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Trophy className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="tiers">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Loyalty and Member Tier Configuration</CardTitle>
            <CardDescription>Manage member tiers and their associated benefits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-lg">Bronze</CardTitle>
                        <CardDescription>Entry-level tier</CardDescription>
                    </div>
                    <Button variant="outline">Edit</Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Spend <span className="font-bold">$0 - $499</span> to be in this tier.</p>
                    <div className="mt-2 space-x-1">
                        <Badge variant="secondary">5% off</Badge>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-lg">Silver</CardTitle>
                        <CardDescription>Intermediate tier</CardDescription>
                    </div>
                    <Button variant="outline">Edit</Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Spend <span className="font-bold">$500 - $1999</span> to be in this tier.</p>
                     <div className="mt-2 space-x-1">
                        <Badge variant="secondary">10% off</Badge>
                        <Badge variant="secondary">Free Drink Birthday</Badge>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-lg">Gold</CardTitle>
                        <CardDescription>Top tier</CardDescription>
                    </div>
                    <Button variant="outline">Edit</Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Spend <span className="font-bold">$2000+</span> to be in this tier.</p>
                     <div className="mt-2 space-x-1">
                        <Badge variant="secondary">15% off</Badge>
                        <Badge variant="secondary">Free Meal Birthday</Badge>
                        <Badge variant="secondary">Priority Booking</Badge>
                    </div>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="stamps">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Loyalty Stamp Configuration</CardTitle>
            <CardDescription>Configure how customers collect loyalty stamps.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Stamp configuration settings will go here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rewards">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Loyalty Rewards Configuration</CardTitle>
            <CardDescription>Manage loyalty rewards that can be redeemed with points or stamps.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Rewards configuration settings will go here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
