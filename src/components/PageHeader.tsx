import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  breadcrumbs,
  className = '',
}) => {
  return (
    <header className={`mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 1 && (
        <nav aria-label="Miga de pan" className="mb-3">
          <ol className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <ChevronRight size={12} strokeWidth={1.5} className="text-gray-400" />}
                  {isLast || !crumb.to ? (
                    <span className="text-gray-700 font-medium" aria-current={isLast ? 'page' : undefined}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="hover:text-gray-900 transition-colors duration-200"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-medium text-gray-900 tracking-tight">
            {title}
          </h1>
          <p className="text-[13px] text-gray-400 font-normal mt-0.5">
            {subtitle}
          </p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
};
