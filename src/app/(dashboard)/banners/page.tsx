import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { mockBanners } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function BannersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Advertising Banners</CardTitle>
          <CardDescription>Manage advertisement banners for the user-facing app.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {mockBanners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-4 flex flex-col md:flex-row items-start gap-4">
              <Image 
                src={banner.imageUrl} 
                alt={banner.title} 
                width={300} 
                height={120} 
                className="rounded-md object-cover aspect-[2.5/1]"
                data-ai-hint="advertisement banner"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold font-headline">{banner.title}</h3>
                    <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Visible from {banner.startDate} to {banner.endDate}
                </p>
              </div>
              <div className="flex gap-2 self-start md:self-center">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
