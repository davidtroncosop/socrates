import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'xl' | 'full' | 'default';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'xl',
}) => {
  const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-md';
  return (
    <div
      style={{ backgroundColor: '#EDEDED' }}
      className={`animate-pulse ${roundedClass} ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};
