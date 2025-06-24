import * as React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 320 70"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="CardWise logo"
  >
    {/* Icon */}
    <g transform="translate(5, 8)" fill="#f0b429">
        {/* Hand */}
        <path d="M10,62 C10,50 20,42 37.5,42 C55,42 65,50 65,62 L10,62Z" />
        {/* Card */}
        <g transform="rotate(-15 37.5 25)">
            <rect x="12.5" y="10" width="50" height="30" rx="3" />
        </g>
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
