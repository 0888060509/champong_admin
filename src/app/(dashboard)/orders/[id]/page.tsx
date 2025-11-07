

'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams, useRouter } from 'next/navigation';
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

    if (!order) {
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
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push('/orders')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                            <span>Order {order.id.substring(0, 7)}</span>
                        </h1>
                        <p className="text-muted-foreground">from {order.date.toDate().toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
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
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tổng cộng:</span>
                                <span>${currentSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Giá giảm:</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Giá sau giảm:</span>
                                <span>${priceAfterDiscount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phí giao hàng:</span>
                                <span>+${shippingFee.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Số tiền cần thanh toán:</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                             <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Số tiền đã thanh toán:</span>
                                <span>${amountPaid.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between font-semibold">
                                <span>Số tiền còn lại:</span>
                                <span className={remainingAmount > 0 ? 'text-destructive' : 'text-green-600'}>
                                    ${remainingAmount.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {customer ? (
                            <>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src={customer.avatarUrl} />
                                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Link href={`/customers/${customer.id}`} className="font-semibold hover:underline">{customer.name}</Link>
                                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                                        {customer.phone && <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-3 w-3" />{customer.phone}</p>}
                                    </div>
                                </div>
                                
                                {customer.membershipTier && (
                                     <div className="flex items-center gap-2 text-sm">
                                        <Gem className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Membership Tier</p>
                                            <div><Badge>{customer.membershipTier}</Badge></div>
                                        </div>
                                    </div>
                                )}
                                
                                <Separator/>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Total Spent</p>
                                            <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Visits</p>
                                            <p className="font-medium">{customer.totalVisits}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Last Visit</p>
                                        <p className="font-medium">{customer.lastVisit.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href={`/customers/${customer.id}`}>View Profile</Link>
                                </Button>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Customer information not available.</p>
                        )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h4 className="font-medium mb-2 text-sm">Order Status</h4>
                                <Select onValueChange={handleStatusChange} value={order.status}>
                                    <SelectTrigger>
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
                            {order.shippingAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <h4 className="font-medium text-sm">Shipping Address</h4>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            )}
                            {order.paymentMethod && (
                                <div className="flex items-start gap-3">
                                    <CreditCard className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <h4 className="font-medium text-sm">Payment Method</h4>
                                        <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
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

    

    

