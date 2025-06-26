
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CreditCard, LayoutDashboard, LogOut, Settings, Wallet, Download, Scale, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Separator } from './ui/separator';
import { Logo } from './ui/logo';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/bills', label: 'Bills', icon: Wallet },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/yearly-summary', label: 'Bill Summary', icon: CalendarDays },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      // Clear the deferredPrompt so it can be garbage collected
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    // Show the install prompt
    await installPrompt.prompt();
    // Wait for the user to respond to the prompt
    await installPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it
    setInstallPrompt(null);
    handleMenuItemClick();
  };

  const handleLogout = async () => {
    handleMenuItemClick();
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'CW';
    const names = name.split(' ');
    if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <Logo className="h-9 w-auto" />
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
                onClick={handleMenuItemClick}
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
        {installPrompt && (
          <SidebarMenu className="pb-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleInstallClick}
                tooltip="Install App"
              >
                <Download />
                <span>Install App</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <Separator className="mb-2"/>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.photoURL ?? "https://placehold.co/40x40.png"} alt={user?.displayName ?? "User"} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0", isMobile ? "text-base" : "text-sm")}>
            <span className="font-semibold truncate">{user?.displayName ?? 'User'}</span>
            <span className="text-muted-foreground truncate">{user?.email ?? 'user@email.com'}</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout} className="ml-auto">
              <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
