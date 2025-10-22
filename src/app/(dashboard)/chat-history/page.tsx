
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { ChatSession } from '@/lib/types';
import { mockChatSessions } from '@/lib/mock-data';
import Link from 'next/link';

export default function ChatHistoryPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    useEffect(() => {
        const sortedSessions = [...mockChatSessions].sort((a, b) => b.lastUpdatedAt.toMillis() - a.lastUpdatedAt.toMillis());
        setSessions(sortedSessions);
    }, []);

    const getStatusBadge = (status: 'Open' | 'Closed') => {
        switch (status) {
            case 'Open':
                return <Badge>Open</Badge>;
            case 'Closed':
                return <Badge variant="secondary">Closed</Badge>;
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Chat History</CardTitle>
                <CardDescription>Review conversations between customers and support staff.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Handled By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/chat-history/${session.id}`} className="hover:underline">
                                        {session.id}
                                    </Link>
                                </TableCell>
                                <TableCell>{session.customerName}</TableCell>
                                <TableCell>{session.branchName}</TableCell>
                                <TableCell>{session.staffName}</TableCell>
                                <TableCell>{getStatusBadge(session.status)}</TableCell>
                                <TableCell>{session.lastUpdatedAt.toDate().toLocaleString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Link href={`/chat-history/${session.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                                            <DropdownMenuItem>Close Session</DropdownMenuItem>
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
