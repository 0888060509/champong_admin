import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        {/* The sidebar is on the left, which is the default. */}
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarNav />
        </Sidebar>

        {/* The main content area, which is inset when the sidebar is present. */}
        <SidebarInset>
            <Header />
            <main className="p-4 lg:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
