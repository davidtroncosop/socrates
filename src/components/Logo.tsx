import React from 'react';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  width = 18,
  height = 18,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logotipo Sócrates"
      role="img"
    >
      <path
        fill="rgb(84, 84, 84)"
        d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
      />
    </svg>
  );
};
