import * as React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 240 50"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="CardWise logo"
  >
    <g>
      <path
        d="M57.6667 48H6.33333C2.83503 48 0 45.165 0 41.6667V22.3333C0 18.835 2.83503 16 6.33333 16H57.6667C61.165 16 64 18.835 64 22.3333V41.6667C64 45.165 61.165 48 57.6667 48Z"
        fill="hsl(var(--primary))"
      />
      <path d="M64 24.6667H0V28H64V24.6667Z" fill="hsla(var(--primary-foreground), 0.5)" />
      <path
        d="M51.2 40C51.2 41.7673 49.7673 43.2 48 43.2C46.2327 43.2 44.8 41.7673 44.8 40C44.8 38.2327 46.2327 36.8 48 36.8C49.7673 36.8 51.2 38.2327 51.2 40Z"
        fill="hsla(var(--primary-foreground), 0.5)"
      />
      <path d="M12.8 38.6667H32V35.3333H12.8V38.6667Z" fill="hsla(var(--primary-foreground), 0.5)" />
      <path d="M21.3333 16V8L26.6667 4L32 8V16H21.3333Z" fill="hsl(var(--primary))" />
      <path
        d="M36 16V2.66667L41.3333 0L46.6667 2.66667V16H36Z"
        fill="hsla(var(--primary), 0.8)"
      />
      <path d="M50.6667 16V8L56 4L61.3333 8V16H50.6667Z" fill="hsl(var(--primary))" />
    </g>
    <text
      style={{
        fontWeight: 'bold',
        fontSize: '32px',
      }}
      x="75"
      y="45"
      fill="hsl(var(--primary))"
    >
      Card
    </text>
    <text
      style={{
        fontWeight: 'bold',
        fontSize: '32px',
      }}
      x="155"
      y="45"
      fill="hsl(var(--accent))"
    >
      Wise
    </text>
  </svg>
);
