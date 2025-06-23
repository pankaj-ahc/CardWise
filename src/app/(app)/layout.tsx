import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { CardProvider } from '@/contexts/card-context';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
