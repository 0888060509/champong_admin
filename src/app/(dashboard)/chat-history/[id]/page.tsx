
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockChatSessions } from '@/lib/mock-data';
import type { ChatSession, ChatMessage } from '@/lib/types';
import { ArrowLeft, Download, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ChatHistoryDetailsPage() {
    const params = useParams();
    const sessionId = params.id as string;
    const [session, setSession] = useState<ChatSession | null>(null);

    useEffect(() => {
        if (!sessionId) return;
        const foundSession = mockChatSessions.find(s => s.id === sessionId);
        if (foundSession) {
            // Sort messages by timestamp
            foundSession.messages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
            setSession(foundSession);
        } else {
            console.log("Chat session not found!");
        }
    }, [sessionId]);

    const handleExport = () => {
        if (!session) return;

        let content = `Chat Session Export\n`;
        content += `====================\n`;
        content += `Session ID: ${session.id}\n`;
        content += `Customer: ${session.customerName} (ID: ${session.customerId})\n`;
        content += `Branch: ${session.branchName}\n`;
        content += `Handled By: ${session.staffName}\n`;
        content += `Status: ${session.status}\n`;
        content += `Last Updated: ${session.lastUpdatedAt.toDate().toLocaleString()}\n`;
        content += `====================\n\n`;

        session.messages.forEach(msg => {
            const time = msg.timestamp.toDate().toLocaleString();
            if (msg.senderType === 'System') {
                 content += `[${time}] --- ${msg.message} ---\n`;
            } else {
                 content += `[${time}] ${msg.senderName}: ${msg.message}\n`;
            }
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_session_${session.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!session) {
        return <div>Loading chat details...</div>;
    }
    
    const getStatusBadge = (status: 'Open' | 'Closed') => {
        switch (status) {
            case 'Open':
                return <Badge>Open</Badge>;
            case 'Closed':
                return <Badge variant="secondary">Closed</Badge>;
        }
    };

    const renderMessage = (msg: ChatMessage) => {
        const isCustomer = msg.senderType === 'Customer';
        const isSystem = msg.senderType === 'System';

        if (isSystem) {
            return (
                <div key={msg.id} className="text-center my-4">
                    <p className="text-xs text-muted-foreground italic bg-secondary inline-block px-3 py-1 rounded-full">
                        {msg.message} on {msg.timestamp.toDate().toLocaleString()}
                    </p>
                </div>
            );
        }

        return (
            <div key={msg.id} className={`flex items-end gap-3 my-4 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                {isCustomer && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>{session.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCustomer ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isCustomer ? 'text-muted-foreground' : 'text-primary-foreground/70'} text-right`}>
                        {msg.timestamp.toDate().toLocaleTimeString()}
                    </p>
                </div>
                 {!isCustomer && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/chat-history">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold font-headline">Chat with {session.customerName}</h1>
                        <p className="text-sm text-muted-foreground">Session ID: {session.id}</p>
                    </div>
                </div>
                 <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export file
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 flex-1">
                <div className="lg:col-span-2 flex flex-col">
                    <Card className="flex-1">
                        <CardContent className="p-4 md:p-6 flex flex-col h-full">
                            <div className="flex-1 space-y-4 overflow-y-auto">
                                {session.messages.map(msg => renderMessage(msg))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Session Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <h4 className="font-semibold">Customer</h4>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{session.customerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{session.customerName}</span>
                                        <Link href={`/customers/${session.customerId}`} className="text-xs text-muted-foreground hover:underline">View Profile</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-semibold">Status</h4>
                                {getStatusBadge(session.status)}
                            </div>
                             <div className="space-y-1">
                                <h4 className="font-semibold">Branch</h4>
                                <p className="text-sm text-muted-foreground">{session.branchName}</p>
                            </div>
                             <div className="space-y-1">
                                <h4 className="font-semibold">Handled By</h4>
                                <p className="text-sm text-muted-foreground">{session.staffName}</p>
                            </div>
                             <div className="space-y-1">
                                <h4 className="font-semibold">Last Updated</h4>
                                <p className="text-sm text-muted-foreground">{session.lastUpdatedAt.toDate().toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
