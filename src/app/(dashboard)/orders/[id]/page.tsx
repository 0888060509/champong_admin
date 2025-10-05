
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams } from 'next/navigation';
import type { Order, OrderHistory, OrderItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/lib/mock-data';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!orderId) return;
        const foundOrder = mockOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            console.log("No such document!");
        }
    }, [orderId]);

    const getStatusBadge = (status: Order['status']) => {
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
    }

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Details</CardTitle>
                    <CardDescription>Details for order {order.id.substring(0, 7)}...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <div className="text-sm"><strong>Customer:</strong> {order.customerName}</div>
                            <div className="text-sm"><strong>Date:</strong> {new Date(order.date).toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm flex items-center gap-2"><strong>Status:</strong> {getStatusBadge(order.status)}</div>
                            <div className="text-sm"><strong>Total:</strong> ${order.total.toFixed(2)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item: OrderItem) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Change History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.history?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry: OrderHistory) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{entry.user}</TableCell>
                                    <TableCell>{entry.action}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
