import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMenuItems } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MenuPage() {
  return (
    <Tabs defaultValue="items">
        <div className="flex items-center justify-between mb-4">
            <TabsList>
                <TabsTrigger value="items">Menu Items</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
        <TabsContent value="items">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Menu Items</CardTitle>
                    <CardDescription>Manage your menu items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockMenuItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="categories">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Menu Categories</CardTitle>
                    <CardDescription>Organize your menu with categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Category management interface will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
