
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)} aria-label="CardWise logo">
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      data-ai-hint="logo letter c checkmark"
    >
        <path
            d="M16 8C16 4.68629 13.3137 2 10 2C6.68629 2 4 4.68629 4 8V16C4 19.3137 6.68629 22 10 22C13.3137 22 16 19.3137 16 16"
            className="stroke-primary"
            strokeWidth="2"
        />
        <path
            d="M12 12L14.5 14.5L20 9"
            className="stroke-accent"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="text-2xl font-medium leading-none">
      <span className="text-primary">Card</span>
      <span className="text-accent">Wise</span>
    </div>
  </div>
);
