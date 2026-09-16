import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full ${maxWidth} rounded-xl border border-gray-200 overflow-hidden transition-transform duration-200`}
        style={{ backgroundColor: '#EDEDED' }}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200">
          <div>
            <h2 id="modal-title" className="text-[1.5rem] font-medium text-gray-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[13px] text-gray-400 mt-1 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full transition-colors focus-visible:ring-2 ring-blue-400"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
