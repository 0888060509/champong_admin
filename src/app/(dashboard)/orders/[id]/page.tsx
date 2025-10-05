
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore } from '@/firebase/provider';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { Order, OrderHistory, OrderItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function OrderDetailsPage() {
    const { firestore } = useFirestore();
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!firestore || !orderId) return;
        const orderRef = doc(firestore, 'orders', orderId);
        const unsubscribe = onSnapshot(orderRef, (doc) => {
            if (doc.exists()) {
                setOrder({ id: doc.id, ...doc.data() } as Order);
            } else {
                console.log("No such document!");
            }
        });
        return () => unsubscribe();
    }, [firestore, orderId]);

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
                            <p><strong>Customer:</strong> {order.customerName}</p>
                            <p><strong>Date:</strong> {order.date.toDate().toLocaleString()}</p>
                        </div>
                        <div>
                            <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
                            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
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
                            {order.history?.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()).map((entry: OrderHistory) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.timestamp.toDate().toLocaleString()}</TableCell>
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
