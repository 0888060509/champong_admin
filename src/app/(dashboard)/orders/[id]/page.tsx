
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order, OrderHistory, OrderItem, Topping, SideDish, Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { mockOrders, mockMenuItems, mockCustomers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, ArrowLeft, MessageSquare, StickyNote, ShoppingCart, BarChart2, Calendar, Gem, Phone, MapPin, CreditCard, User, Info, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';


export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (!orderId) return;
        const foundOrder = mockOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
            setEditedItems(JSON.parse(JSON.stringify(foundOrder.items))); // Deep copy
            const foundCustomer = mockCustomers.find(c => c.name === foundOrder.customerName);
            if (foundCustomer) {
                setCustomer(foundCustomer);
            }
        } else {
            toast({ title: 'Error', description: 'Order not found.', variant: 'destructive'});
            router.push('/orders');
        }
    }, [orderId, router, toast]);

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

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing
            setEditedItems(JSON.parse(JSON.stringify(order?.items || [])));
        }
        setIsEditing(!isEditing);
    };

    const handleItemChange = (itemId: string, field: keyof OrderItem, value: any) => {
        setEditedItems(currentItems => {
            return currentItems.map(item => {
                if (item.id === itemId) {
                    if (field === 'quantity') {
                        return { ...item, [field]: Number(value) };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            });
        });
    };

    const handleRemoveItem = (itemId: string) => {
        setEditedItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const handleAddItem = () => {
        const newItem: OrderItem = { 
            id: `new_${Date.now()}`,
            name: '',
            price: 0,
            quantity: 1,
            isEditing: true, // Mark as new item being edited
        };
        setEditedItems(currentItems => [...currentItems, newItem]);
    };

    const handleNewItemSelect = (newItemId: string, selectedMenuItemId: string) => {
        const selectedItem = mockMenuItems.find(mi => mi.id === selectedMenuItemId);
        if (!selectedItem) return;

        setEditedItems(currentItems => currentItems.map(item => {
            if (item.id === newItemId) {
                return {
                    ...item,
                    name: selectedItem.name,
                    price: selectedItem.price,
                    originalPrice: selectedItem.price,
                    isEditing: false, // Done selecting
                };
            }
            return item;
        }));
    };
    
    const handleSaveChanges = () => {
        if (!order) return;
        
        const newSubtotal = editedItems.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);
        const discount = order.discount || 0;
        const shippingFee = order.shippingFee || 0;
        const newTotal = newSubtotal - discount + shippingFee;
        const amountPaid = order.amountPaid || 0;


        const updatedOrder: Order = {
            ...order,
            items: editedItems,
            subtotal: newSubtotal,
            total: newTotal,
            remainingAmount: newTotal - amountPaid,
            history: [
                ...(order.history || []),
                {
                    id: `hist_${Date.now()}`,
                    action: `Order edited by admin@example.com. Total changed from $${order.total.toFixed(2)} to $${newTotal.toFixed(2)}.`,
                    user: 'admin@example.com',
                    timestamp: new Date(),
                }
            ]
        };

        setOrder(updatedOrder);
        setIsEditing(false);
        // In a real app, you would also update the mockOrders array or send to a server
        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
            mockOrders[orderIndex] = updatedOrder;
        }

        toast({ title: 'Success', description: 'Order updated successfully.'});
    };
    
    const calculateItemSubtotal = (item: OrderItem) => {
        const toppingsPrice = item.toppings?.reduce((acc, topping) => acc + topping.price, 0) || 0;
        const sideDishesPrice = item.sideDishes?.reduce((acc, sideDish) => acc + sideDish.price, 0) || 0;
        return (item.price + toppingsPrice + sideDishesPrice) * item.quantity;
    }

    const currentSubtotal = editedItems.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);

    if (!order || !customer) {
        return <div>Loading...</div>;
    }
    
    const handleStatusChange = (newStatus: Order['status']) => {
        if (!order || order.status === newStatus) return;

        const updatedOrder: Order = {
            ...order,
            status: newStatus,
            history: [
                ...(order.history || []),
                {
                    id: `hist_${Date.now()}`,
                    action: `Status changed from ${order.status} to ${newStatus}`,
                    user: 'admin@example.com', // Replace with actual user
                    timestamp: new Date(),
                }
            ]
        };
        setOrder(updatedOrder);

        // Update mock data
        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
            mockOrders[orderIndex] = updatedOrder;
        }
        
        toast({ title: 'Status Updated', description: `Order status changed to ${newStatus}`});
    };

    const { discount = 0, shippingFee = 0, amountPaid = 0 } = order;
    const priceAfterDiscount = currentSubtotal - discount;
    const finalTotal = priceAfterDiscount + shippingFee;
    const remainingAmount = finalTotal - amountPaid;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                             <CardTitle className="font-headline text-2xl mb-1">Order {order.id.substring(0, 7)}</CardTitle>
                             <p className="text-sm text-muted-foreground">
                                Placed on {order.date.toDate().toLocaleString()}
                            </p>
                            <div className="mt-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={customer.avatarUrl} />
                                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/customers/${customer.id}`} className="font-semibold hover:underline">{customer.name}</Link>
                                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                                </div>
                            </div>
                        </div>
                         <div className="w-full md:w-auto">
                             <Label htmlFor="order-status">Order Status</Label>
                             <Select onValueChange={handleStatusChange} value={order.status}>
                                 <SelectTrigger id="order-status" className="w-full md:w-[200px]">
                                     <SelectValue placeholder="Select Status" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="Pending">Pending</SelectItem>
                                     <SelectItem value="Processing">Processing</SelectItem>
                                     <SelectItem value="Completed">Completed</SelectItem>
                                     <SelectItem value="Cancelled">Cancelled</SelectItem>
                                 </SelectContent>
                             </Select>
                         </div>
                    </div>
                    <Separator className="my-6"/>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-lg">${finalTotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Payment</p>
                            <div className="font-semibold flex items-center">{remainingAmount > 0 ? (
                                <Badge variant="destructive">Unpaid</Badge>
                            ) : (
                                <Badge>Paid</Badge>
                            )}</div>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Payment Method</p>
                            <p className="font-semibold">{order.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Delivery Method</p>
                            <p className="font-semibold">{order.shippingAddress ? 'Delivery' : 'Pickup'}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-headline">Order Items</CardTitle>
                            {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button variant="ghost" onClick={handleEditToggle}>Cancel</Button>
                                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" onClick={handleEditToggle}>Edit Order</Button>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="w-24 text-center">Quantity</TableHead>
                                        <TableHead className="text-right w-32">Unit Price</TableHead>
                                        <TableHead className="text-right w-32">Subtotal</TableHead>
                                        {isEditing && <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {editedItems.map((item: OrderItem) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.isEditing ? (
                                                    <Select onValueChange={(val) => handleNewItemSelect(item.id, val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {mockMenuItems.map(mi => (
                                                                <SelectItem key={mi.id} value={mi.id}>{mi.name} - ${mi.price.toFixed(2)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div>
                                                        <span className="font-medium">{item.name}</span>
                                                        {item.toppings && item.toppings.length > 0 && (
                                                             <div className="text-xs text-muted-foreground">
                                                                + Toppings: {item.toppings.map(t => `${t.name} ($${t.price.toFixed(2)})`).join(', ')}
                                                            </div>
                                                        )}
                                                        {item.sideDishes && item.sideDishes.length > 0 && (
                                                            <div className="text-xs text-muted-foreground">
                                                                + Sides: {item.sideDishes.map(s => `${s.name} ($${s.price.toFixed(2)})`).join(', ')}
                                                            </div>
                                                        )}
                                                         {item.note && (
                                                            <div className="text-xs text-muted-foreground italic flex items-center gap-1 mt-1">
                                                                <MessageSquare className="h-3 w-3"/> Note: {item.note}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {isEditing ? (
                                                    <Input 
                                                        type="number" 
                                                        value={item.quantity} 
                                                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                        className="h-8 w-16 mx-auto"
                                                        min="1"
                                                    />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-medium">${(calculateItemSubtotal(item)).toFixed(2)}</TableCell>
                                            {isEditing && (
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {isEditing && (
                                <div className="mt-4">
                                    <Button variant="outline" size="sm" onClick={handleAddItem}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                           <div className="w-full flex justify-end">
                                <div className="w-full max-w-sm space-y-3">
                                     <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span>${currentSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping:</span>
                                        <span>+${shippingFee.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="text-muted-foreground">Paid:</span>
                                        <span>${amountPaid.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Remaining:</span>
                                        <span>${remainingAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                           </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Shipping &amp; Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {order.shippingAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <h4 className="font-medium text-sm">Shipping Address</h4>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            )}
                            {order.note && (
                                <div className="flex items-start gap-3">
                                    <StickyNote className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <h4 className="font-medium text-sm">Order Note</h4>
                                        <p className="text-sm text-muted-foreground italic">"{order.note}"</p>
                                    </div>
                                </div>
                            )}
                             {!order.shippingAddress && !order.note && (
                                <p className="text-sm text-muted-foreground text-center">No shipping address or notes for this order.</p>
                             )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Change History</CardTitle>
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
                                            <TableCell className="text-xs">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                                            <TableCell className="text-xs">{entry.user}</TableCell>
                                            <TableCell className="text-xs">{entry.action}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
