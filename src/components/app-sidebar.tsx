'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CreditCard, LayoutDashboard, LogOut, Settings } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cards', label: 'Cards', icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold font-headline">CardWise</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="user avatar" />
            <AvatarFallback>CW</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">User</span>
            <span className="text-muted-foreground">user@email.com</span>
          </div>
          <Link href="/" className="ml-auto">
            <Button variant="ghost" size="icon" aria-label="Log out">
              <LogOut />
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
