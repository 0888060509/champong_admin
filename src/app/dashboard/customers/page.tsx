
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCustomers } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";


export default function CustomersPage() {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Customer Management</CardTitle>
        <CardDescription>View and manage all restaurant customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Total Visits</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Link href={`/customers/${customer.id}`} className="font-medium hover:underline">{customer.name}</Link>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>{customer.lastVisit.toDate().toLocaleDateString()}</TableCell>
                <TableCell>{customer.totalVisits}</TableCell>
                <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/customers/${customer.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete Customer</DropdownMenuItem>
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
