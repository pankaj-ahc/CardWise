import * as React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 320 70"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="CardWise logo"
  >
    {/* Icon */}
    <g transform="translate(5, 12)" fill="none" stroke="#f0b429" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Card */}
        <rect x="0" y="10" width="60" height="35" rx="4" />
        {/* Hand */}
        <path d="M45,45 C45,30 85,30 85,45 L85,60 L50,60 C40,60 45,50 45,45 Z" />
        <path d="M53,32.5 L63,22.5" />
        <path d="M63,32.5 L73,22.5" />
    </g>

    {/* Text */}
    <text
      fontFamily="cursive, sans-serif"
      fontSize="48"
      y="60"
      fontWeight="500"
    >
      <tspan x="95" fill="#e03c31">Card</tspan>
      <tspan x="200" fill="#f0b429">Wise</tspan>
    </text>
  </svg>
);
