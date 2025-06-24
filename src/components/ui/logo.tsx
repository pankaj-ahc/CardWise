import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)} aria-label="CardWise logo">
    <Image
      src="https://app.brandmark.io/nounpreview/17310.png"
      alt="CardWise icon"
      width={40}
      height={40}
      className="h-full w-auto"
      data-ai-hint="logo"
    />
    <div style={{ fontFamily: 'cursive, sans-serif' }} className="text-2xl font-medium leading-none">
      <span style={{ color: '#e03c31' }}>Card</span>
      <span style={{ color: '#f0b429' }}>Wise</span>
    </div>
  </div>
);
