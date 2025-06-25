'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { CardProvider } from '@/contexts/card-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { Logo } from '@/components/ui/logo';

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
            <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background px-3 md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                  <Logo className="h-8 w-auto" />
              </div>
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
