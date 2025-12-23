

'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBookings } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, LayoutGrid, List } from "lucide-react";
import type { Booking } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const BOOKING_STATUSES: Booking['status'][] = ['Pending', 'Confirmed', 'Cancelled'];

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<'board' | 'table'>('table');

    const bookingsByStatus = useMemo(() => {
        const grouped: { [key in Booking['status']]?: Booking[] } = {};
        for (const status of BOOKING_STATUSES) {
            grouped[status] = bookings.filter(booking => booking.status === status);
        }
        return grouped;
    }, [bookings]);

    const getStatusBadge = (status: 'Confirmed' | 'Pending' | 'Cancelled') => {
        switch (status) {
            case 'Confirmed':
                return <Badge>Confirmed</Badge>;
            case 'Pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'Cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
        }
    }
    
    const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
        setBookings(currentBookings => 
            currentBookings.map(booking => 
                booking.id === bookingId ? { ...booking, status: newStatus } : booking
            )
        );
        toast({
            title: 'Booking Status Updated',
            description: `Booking #${bookingId} has been set to ${newStatus}.`,
        });
    };

  return (
    <>
      <Card>
        <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Booking Management</CardTitle>
                    <CardDescription>View and manage all customer bookings.</CardDescription>
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
        {viewMode === 'table' && (
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.customerName}</TableCell>
                        <TableCell>{booking.bookingDate}</TableCell>
                        <TableCell>{booking.bookingTime}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    {booking.status === 'Pending' && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'Confirmed')}>
                                            Confirm
                                        </DropdownMenuItem>
                                    )}
                                    {booking.status !== 'Cancelled' && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'Cancelled')} className="text-destructive">
                                            Cancel
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        )}
      </Card>

      {viewMode === 'board' && (
         <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max">
                {BOOKING_STATUSES.map(status => (
                    <div key={status} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-semibold font-headline flex items-center gap-2">
                                {status}
                                <Badge variant="secondary" className="text-base">{bookingsByStatus[status]?.length || 0}</Badge>
                            </h2>
                        </div>
                        <ScrollArea className="h-full w-80 rounded-md">
                            <div className="flex flex-col gap-4 pr-4">
                            {bookingsByStatus[status]?.map(booking => (
                                <Card key={booking.id} className="w-full">
                                    <CardHeader className="p-4 flex flex-row items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-body">
                                                {booking.customerName}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                ID: {booking.id}
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
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                {booking.status === 'Pending' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'Confirmed')}>
                                                        Confirm
                                                    </DropdownMenuItem>
                                                )}
                                                {booking.status !== 'Cancelled' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'Cancelled')} className="text-destructive">
                                                        Cancel
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-sm">
                                        <p><span className="font-semibold">{booking.guests}</span> guests</p>
                                        <p className="text-muted-foreground text-xs mt-2">{booking.bookingDate} at {booking.bookingTime}</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!bookingsByStatus[status] || bookingsByStatus[status]?.length === 0) && (
                                <div className="text-center text-sm text-muted-foreground p-4">No bookings in this status.</div>
                            )}
                            </div>
                        </ScrollArea>
                    </div>
                ))}
            </div>
        </div>
      )}
    </>
  );
}

    