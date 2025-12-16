
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBookings } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Booking } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const { toast } = useToast();

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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Booking Management</CardTitle>
        <CardDescription>View and manage all customer bookings.</CardDescription>
      </CardHeader>
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
    </Card>
  );
}
