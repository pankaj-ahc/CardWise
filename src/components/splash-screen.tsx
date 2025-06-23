'use client';

import { Logo } from '@/components/ui/logo';

export function SplashScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="animate-pulse">
        <Logo className="h-auto w-48" />
      </div>
    </div>
  );
}
