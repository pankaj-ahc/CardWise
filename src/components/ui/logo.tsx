import * as React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center gap-2", className)} aria-label="CardWise logo">
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      data-ai-hint="credit card checkmark"
    >
      <rect x="2" y="5" width="20" height="14" rx="3" className="stroke-primary" strokeWidth="2"/>
      <path d="M8 12l2.5 2.5L16 9" className="stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="text-2xl font-medium leading-none">
      <span className="text-primary">Card</span>
      <span className="text-accent">Wise</span>
    </div>
  </div>
);
