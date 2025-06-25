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
      data-ai-hint="logo credit card checkmark"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" className="fill-primary" />
      <rect x="5" y="9" width="4" height="3" rx="0.5" className="fill-primary-foreground opacity-50" />
      <path
        d="M14 11l2 2 4-4"
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
