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
      data-ai-hint="logo card checkmark"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" className="fill-primary" />
      <path
        d="M7 12L10.5 15.5L17.5 8.5"
        className="stroke-primary-foreground"
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
