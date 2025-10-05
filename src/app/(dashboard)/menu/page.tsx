
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMenuItems } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('items');

  return (
    <Tabs defaultValue="items" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
            <TabsList>
                <TabsTrigger value="items">Menu Items</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {activeTab === 'items' ? 'Add Item' : 'Add Category'}
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
                        <TableHead className="w-16">Image</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockMenuItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Image
                                    src={`https://picsum.photos/seed/${item.id}/64/64`}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover"
                                    data-ai-hint="food item"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.description}</div>
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
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
