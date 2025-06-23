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
        fill="#E8B923"
      />
      <path d="M64 24.6667H0V28H64V24.6667Z" fill="#F0C94B" />
      <path
        d="M51.2 40C51.2 41.7673 49.7673 43.2 48 43.2C46.2327 43.2 44.8 41.7673 44.8 40C44.8 38.2327 46.2327 36.8 48 36.8C49.7673 36.8 51.2 38.2327 51.2 40Z"
        fill="#F0C94B"
      />
      <path d="M12.8 38.6667H32V35.3333H12.8V38.6667Z" fill="#F0C94B" />
      <path d="M21.3333 16V8L26.6667 4L32 8V16H21.3333Z" fill="#E8B923" />
      <path
        d="M36 16V2.66667L41.3333 0L46.6667 2.66667V16H36Z"
        fill="#F0C94B"
      />
       <text
        x="41" y="13"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fill="#E8B923"
        textAnchor="middle"
      >
        $
      </text>
      <path d="M50.6667 16V8L56 4L61.3333 8V16H50.6667Z" fill="#E8B923" />
    </g>
    <text
      style={{
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: '32px',
        fontFamily: 'cursive, sans-serif',
      }}
      x="80"
      y="45"
      fill="#EF4444"
    >
      Card
    </text>
    <text
      style={{
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: '32px',
        fontFamily: 'cursive, sans-serif',
      }}
      x="160"
      y="45"
      fill="#EAB308"
    >
      Wise
    </text>
  </svg>
);
