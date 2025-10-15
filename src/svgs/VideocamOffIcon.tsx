import React from 'react';

interface IconProps {
  className?: string;
}

export const VideocamOffIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21 21 19.73 3.27 2zM5 16V8h1.73l8 8H5z"/>
  </svg>
);
