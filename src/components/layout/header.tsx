
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb } from '@/components/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { mockNotifications } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export function Header() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-card"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground transform translate-x-1/2 -translate-y-1/2 bg-destructive rounded-full">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-headline">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
                {mockNotifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className={`flex items-start gap-3 p-2 ${!notification.read ? 'bg-secondary' : ''}`}>
                    <div className={`mt-1 h-2 w-2 rounded-full ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
            </ScrollArea>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="justify-center">
                Mark all as read
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
