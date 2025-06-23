'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { CardProvider } from '@/contexts/card-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { CreditCard } from 'lucide-react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <CardProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:hidden">
              <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                      <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-semibold font-headline">CardWise</span>
              </div>
              <SidebarTrigger />
            </header>
            <div className="min-h-screen">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </CardProvider>
    </SettingsProvider>
  );
}
