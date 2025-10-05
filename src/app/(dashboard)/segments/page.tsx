import { SegmentationClient } from "./segmentation-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SegmentsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SegmentationClient />
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Existing Segments</CardTitle>
                <CardDescription>Manage your saved customer segments.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    <li className="text-sm p-2 rounded-md hover:bg-muted cursor-pointer">High Spenders</li>
                    <li className="text-sm p-2 rounded-md hover:bg-muted cursor-pointer">Recent Visitors</li>
                    <li className="text-sm p-2 rounded-md hover:bg-muted cursor-pointer">Lapsed Customers</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
