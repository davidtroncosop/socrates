import React from 'react';

export type StatusType = 'logrado' | 'en_proceso' | 'no_logrado' | 'requiere_revision';

interface StatusDotProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  className = '',
  size = 'md',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'logrado':
        return {
          dotClass: 'bg-green-600',
          defaultLabel: 'Logrado',
          textColor: 'text-green-700',
        };
      case 'en_proceso':
        return {
          dotClass: 'bg-amber-500',
          defaultLabel: 'En proceso',
          textColor: 'text-amber-700',
        };
      case 'no_logrado':
      case 'requiere_revision':
        return {
          dotClass: 'bg-rose-500',
          defaultLabel: status === 'no_logrado' ? 'Objetivo no logrado' : 'Requiere revisión',
          textColor: 'text-rose-700',
        };
    }
  };

  const config = getStatusConfig();
  const displayLabel = label || config.defaultLabel;
  const dotDimensions = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`${dotDimensions} rounded-full ${config.dotClass} shrink-0`}
        aria-hidden="true"
      />
      <span className={`text-[12px] font-medium text-gray-700`}>
        {displayLabel}
      </span>
    </span>
  );
};
