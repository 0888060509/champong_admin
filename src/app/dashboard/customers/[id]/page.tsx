

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, ShoppingCart, BarChart2, Calendar } from 'lucide-react';
import type { Customer, Order } from '@/lib/types';
import { mockCustomers, mockOrders } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (customerId) {
            const foundCustomer = mockCustomers.find(c => c.id === customerId);
            if (foundCustomer) {
                setCustomer(foundCustomer);
                // Filter orders for this customer, mock data doesn't have customer ID on order
                // So we'll just show some recent orders for demonstration.
                const orders = mockOrders.filter(o => o.customerName === foundCustomer.name).slice(0, 5);
                setCustomerOrders(orders);
            } else {
                // Handle customer not found
                router.push('/dashboard/customers');
            }
        }
    }, [customerId, router]);
    
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

    if (!customer) {
        return <div>Loading customer details...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold font-headline">{customer.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> {customer.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customer.totalVisits}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customer.lastVisit.toDate().toLocaleDateString()}</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Orders</CardTitle>
                    <CardDescription>A list of the customer's most recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/dashboard/orders/${order.id}`} className="hover:underline text-primary">
                                        {order.id.substring(0, 7)}...
                                    </Link>
                                </TableCell>
                                <TableCell>{order.date.toDate().toLocaleDateString()}</TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
