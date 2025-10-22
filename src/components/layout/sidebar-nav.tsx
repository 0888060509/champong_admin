
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  Users,
  BookOpen,
  ImageIcon,
  Megaphone,
  BarChart,
  Store,
  Gem,
  UserCog,
  Shield,
  Settings,
  Utensils,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/menu', label: 'Menu', icon: BookOpen },
    { href: '/banners', label: 'Banners', icon: ImageIcon },
    { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/segments', label: 'Segmentation', icon: Sparkles },
    { href: '/reports', label: 'Reports', icon: BarChart },
];

const managementItems = [
    { href: '/branches', label: 'Branches', icon: Store },
    { href: '/loyalty', label: 'Loyalty', icon: Gem },
    { href: '/roles', label: 'Roles & Permissions', icon: UserCog },
    { href: '/audit-log', label: 'Audit Log', icon: Shield },
    { href: '/chat-history', label: 'Chat History', icon: MessageSquare },
];

const settingsItems = [
    { href: '/settings/pos', label: 'POS365', icon: Settings },
    { href: '/settings/notifications', label: 'Automations', icon: Settings },
];


export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
                <Utensils className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold font-headline text-sidebar-foreground">AdminWeb</h1>
        </div>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1">
        <SidebarMenuItem>
            <SidebarGroup>
                <SidebarGroupContent>
                    <ul className="flex flex-col gap-1">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                isActive={isActive(item.href)}
                                tooltip={{ children: item.label }}
                                >
                                <item.icon />
                                <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarMenuItem>

        <SidebarSeparator />

        <SidebarMenuItem>
            <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarGroupContent>
                     <ul className="flex flex-col gap-1">
                        {managementItems.map((item) => (
                            <li key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                isActive={isActive(item.href)}
                                tooltip={{ children: item.label }}
                                >
                                <item.icon />
                                <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarMenuItem>

        <SidebarSeparator />

         <SidebarMenuItem>
            <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                     <ul className="flex flex-col gap-1">
                        {settingsItems.map((item) => (
                            <li key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                isActive={isActive(item.href)}
                                tooltip={{ children: item.label }}
                                >
                                <item.icon />
                                <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarFooter>
         <SidebarSeparator />
         <div className="flex items-center gap-3 p-2">
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate text-sidebar-foreground">Admin User</p>
                <p className="text-xs truncate text-sidebar-foreground/70">admin@example.com</p>
            </div>
         </div>
      </SidebarFooter>
    </>
  );
}
