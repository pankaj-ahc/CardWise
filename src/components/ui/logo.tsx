import * as React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)} aria-label="CardWise logo">
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="#f0b429"
      className="h-full w-auto"
      data-ai-hint="logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.5 11.521C21.054 11.187 20.536 11 20 11H4C3.464 11 2.946 11.187 2.5 11.521V6C2.5 4.622 3.622 3.5 5 3.5H19C20.378 3.5 21.5 4.622 21.5 6V11.521Z" />
      <path d="M2.5 12.479C2.946 12.813 3.464 13 4 13H20C20.536 13 21.054 12.813 21.5 12.479V18C21.5 19.378 20.378 20.5 19 20.5H5C3.622 20.5 2.5 19.378 2.5 18V12.479Z" />
    </svg>
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="text-2xl font-medium leading-none">
      <span style={{ color: '#e03c31' }}>Card</span>
      <span style={{ color: '#f0b429' }}>Wise</span>
    </div>
  </div>
);
