import * as React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 320 70"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="CardWise logo"
  >
    {/* Icon */}
    <g fill="#f0b429">
      {/* The main card rectangle */}
      <rect x="0" y="20" width="85" height="50" rx="7" />
      
      {/* Bills coming out of the card */}
      <path d="M15,22 V12 L22,8 L29,12 V22 Z" />
      <path d="M32,22 V5 L42,2 L52,5 V22 Z" />
      <path d="M55,22 V12 L62,8 L69,12 V22 Z" />
      <text x="42" y="19" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">$</text>
      
      {/* Top stripe on the card */}
      <rect x="0" y="30" width="85" height="8" />

      {/* Card details at the bottom */}
      <circle cx="68" cy="55" r="5" />
      <rect x="12" y="52" width="25" height="3" />
      <rect x="12" y="58" width="20" height="3" />
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
