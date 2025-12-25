

'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, X as XIcon, Calendar as CalendarIcon, LayoutGrid, List } from "lucide-react";
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { mockOrders } from '@/lib/mock-data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const ORDER_STATUSES: Order['status'][] = ['Pending', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isCancelAlertOpen, setCancelAlertOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [cancellationNotes, setCancellationNotes] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [viewMode, setViewMode] = useState<'board' | 'table'>('board');


    useEffect(() => {
        const sortedOrders = [...mockOrders].sort((a, b) => b.date.toMillis() - a.date.toMillis());
        setOrders(sortedOrders);
    }, []);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                // Search query filter
                if (!searchQuery) return true;
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    order.customerName.toLowerCase().includes(lowerCaseQuery) ||
                    order.id.toLowerCase().includes(lowerCaseQuery)
                );
            })
            .filter(order => {
                // Date range filter
                if (!dateRange || (!dateRange.from && !dateRange.to)) return true;
                const orderDate = order.date.toDate();
                if (dateRange.from && orderDate < dateRange.from) return false;
                // Set the 'to' date to the end of the day
                if (dateRange.to) {
                    const toDate = new Date(dateRange.to);
                    toDate.setHours(23, 59, 59, 999);
                    if (orderDate > toDate) return false;
                }
                return true;
            });
    }, [orders, searchQuery, dateRange]);
    
    const ordersByStatus = useMemo(() => {
        const grouped: { [key in Order['status']]?: Order[] } = {};
        for (const status of ORDER_STATUSES) {
            grouped[status] = filteredOrders.filter(order => order.status === status);
        }
        return grouped;
    }, [filteredOrders]);


    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'Completed':
                return <Badge>Completed</Badge>;
            case 'Processing':
                return <Badge variant="secondary">Processing</Badge>;
            case 'Cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            case 'Pending':
            default:
                return <Badge variant="outline">Pending</Badge>;
        }
    };
    
    const handleStatusChange = (orderId: string, newStatus: Order['status'], details?: string) => {
       setOrders(currentOrders => {
           const newOrders = [...currentOrders];
           const orderIndex = newOrders.findIndex(o => o.id === orderId);
           if (orderIndex > -1) {
               const originalStatus = newOrders[orderIndex].status;
               newOrders[orderIndex] = {
                   ...newOrders[orderIndex],
                   status: newStatus,
                   history: [
                       ...(newOrders[orderIndex].history || []),
                       {
                           id: `hist_${Date.now()}`,
                           action: `Status changed from ${originalStatus} to ${newStatus}${details ? `. ${details}` : ''}`,
                           user: 'admin@example.com', // Replace with actual user
                           timestamp: new Date(),
                       }
                   ]
               }
           }
           return newOrders;
       })
    };
    
    const openCancelDialog = (order: Order) => {
        setOrderToCancel(order);
        setCancelAlertOpen(true);
        setCancellationReason('');
        setCancellationNotes('');
    }

    const handleConfirmCancel = () => {
        if (orderToCancel && cancellationReason) {
            const details = `Reason: ${cancellationReason}${cancellationNotes ? ` - Notes: ${cancellationNotes}` : ''}`;
            handleStatusChange(orderToCancel.id, 'Cancelled', details);
        }
        setCancelAlertOpen(false);
        setOrderToCancel(null);
    }
    
    const clearFilters = () => {
        setSearchQuery('');
        setDateRange(undefined);
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Order Management</CardTitle>
                            <CardDescription>View, track, and manage all customer orders.</CardDescription>
                        </div>
                         <div className="flex items-center gap-2">
                            <Button variant={viewMode === 'board' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('board')}>
                                <LayoutGrid className="h-4 w-4" />
                                <span className="sr-only">Board View</span>
                            </Button>
                            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('table')}>
                                <List className="h-4 w-4" />
                                <span className="sr-only">Table View</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by customer name or order ID..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date range</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                        {(searchQuery || dateRange) && (
                             <Button variant="ghost" onClick={clearFilters}>
                                <XIcon className="mr-2 h-4 w-4"/>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {viewMode === 'board' ? (
                <div className="flex-1 overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max">
                        {ORDER_STATUSES.map(status => (
                            <div key={status} className="flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-lg font-semibold font-headline flex items-center gap-2">
                                        {status}
                                        <Badge variant="secondary" className="text-base">{ordersByStatus[status]?.length || 0}</Badge>
                                    </h2>
                                </div>
                                <ScrollArea className="h-full w-80 rounded-md">
                                    <div className="flex flex-col gap-4 pr-4">
                                    {ordersByStatus[status]?.map(order => (
                                        <Card key={order.id} className="w-full">
                                            <CardHeader className="p-4 flex flex-row items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-base font-body">
                                                        <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                                                            {order.customerName}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription className="text-xs">
                                                        ID: {order.id.substring(0, 7)}...
                                                    </CardDescription>
                                                </div>
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost" className="h-6 w-6">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/dashboard/orders/${order.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Processing')}>Mark as Processing</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openCancelDialog(order)} className="text-destructive">Cancel Order</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 text-sm">
                                                <p className="text-lg font-semibold font-headline">${order.total.toFixed(2)}</p>
                                                <p className="text-muted-foreground text-xs">{order.items.length} item(s)</p>
                                                <p className="text-muted-foreground text-xs mt-2">{order.date.toDate().toLocaleString()}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {(!ordersByStatus[status] || ordersByStatus[status]?.length === 0) && (
                                        <div className="text-center text-sm text-muted-foreground p-4">No orders in this status.</div>
                                    )}
                                    </div>
                                </ScrollArea>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
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
                                {filteredOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/dashboard/orders/${order.id}`} className="text-primary hover:underline">
                                                {order.id.substring(0, 7)}...
                                            </Link>
                                        </TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{order.date.toDate().toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/dashboard/orders/${order.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                                                    <DropdownMenuItem onClick={() => openCancelDialog(order)} className="text-destructive">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <AlertDialog open={isCancelAlertOpen} onOpenChange={setCancelAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please provide a reason for cancelling order <span className="font-mono">{orderToCancel?.id.substring(0,7)}...</span>. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                             <Label htmlFor="cancellation-reason">Reason</Label>
                             <Select onValueChange={setCancellationReason} value={cancellationReason}>
                                <SelectTrigger id="cancellation-reason">
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Customer Request">Customer Request</SelectItem>
                                    <SelectItem value="Out of Stock">Item Out of Stock</SelectItem>
                                    <SelectItem value="Payment Issue">Payment Issue</SelectItem>
                                    <SelectItem value="Fraudulent Order">Fraudulent Order</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="cancellation-notes">Notes (Optional)</Label>
                             <Textarea 
                                id="cancellation-notes" 
                                placeholder="Add any additional notes here..."
                                value={cancellationNotes}
                                onChange={(e) => setCancellationNotes(e.target.value)}
                            />
                         </div>
                    </div>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirmCancel} 
                        disabled={!cancellationReason}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        Confirm Cancellation
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
