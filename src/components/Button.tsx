import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  hasArrow?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  hasArrow = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles =
        'text-blue-500 border border-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 focus-visible:ring-2 ring-blue-400 ring-offset-2 ring-offset-[#f0f0ee]';
      break;
    case 'secondary':
      variantStyles =
        'text-gray-700 border border-gray-300 hover:border-gray-500 focus-visible:ring-2 ring-blue-400 ring-offset-2 ring-offset-[#f0f0ee]';
      break;
    case 'destructive':
      variantStyles =
        'text-rose-500 border border-rose-300 hover:bg-rose-500 hover:text-white focus-visible:ring-2 ring-rose-400 ring-offset-2 ring-offset-[#f0f0ee]';
      break;
    case 'ghost':
      variantStyles =
        'text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200 focus-visible:ring-2 ring-blue-400 ring-offset-2 ring-offset-[#f0f0ee]';
      break;
  }

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.99]';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 text-[13px] font-medium rounded-full px-5 py-2.5 transition-all duration-200 group ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {hasArrow && (
        <span
          className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 select-none"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </button>
  );
};
