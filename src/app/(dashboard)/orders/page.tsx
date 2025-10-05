
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { mockOrders } from '@/lib/mock-data';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // In a real app, you might fetch this data, but for now we use mocks
        const sortedOrders = [...mockOrders].sort((a, b) => b.date.toMillis() - a.date.toMillis());
        setOrders(sortedOrders);
    }, []);

    const getStatusBadge = (status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
        switch (status) {
            case 'Completed':
                return <Badge>Completed</Badge>;
            case 'Processing':
                return <Badge variant="secondary">Processing</Badge>;
            case 'Cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            case 'Pending':
                return <Badge variant="outline">Pending</Badge>;
        }
    };
    
    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
       setOrders(currentOrders => {
           const newOrders = [...currentOrders];
           const orderIndex = newOrders.findIndex(o => o.id === orderId);
           if (orderIndex > -1) {
               newOrders[orderIndex] = {
                   ...newOrders[orderIndex],
                   status: newStatus,
                   history: [
                       ...(newOrders[orderIndex].history || []),
                       {
                           id: `hist_${Date.now()}`,
                           action: `Status changed from ${newOrders[orderIndex].status} to ${newStatus}`,
                           user: 'admin@example.com', // Replace with actual user
                           timestamp: new Date(),
                       }
                   ]
               }
           }
           return newOrders;
       })
    };

    return (
        <Card>
        <CardHeader>
            <CardTitle className="font-headline">Order Manager</CardTitle>
            <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">
                        <Link href={`/orders/${order.id}`} className="hover:underline">
                            {order.id.substring(0, 7)}...
                        </Link>
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date.toDate().toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <Link href={`/orders/${order.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Processing')}>Mark as Processing</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Cancelled')} className="text-destructive">Cancel Order</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
}
