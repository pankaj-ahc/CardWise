import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { CardProvider } from '@/contexts/card-context';
import { SettingsProvider } from '@/contexts/settings-context';

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
            <div className="min-h-screen">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </CardProvider>
    </SettingsProvider>
  );
}
