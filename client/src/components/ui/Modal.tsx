import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  className,
  footer,
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in'
          )}
        />

        {/* Modal content dialog */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPrimitive.Content
            className={cn(
              'relative w-full bg-white rounded-2xl shadow-xl border border-stone-200/90 p-6 my-8 text-stone-900 focus:outline-none animate-in fade-in-95 zoom-in-95 duration-200 [.patient-mode_&]:p-8 [.patient-mode_&]:rounded-3xl',
              SIZE_CLASSES[size],
              className
            )}
          >
            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 mb-4">
                <div className="space-y-1">
                  {title && (
                    <DialogPrimitive.Title className="text-xl font-bold tracking-tight text-stone-900 [.patient-mode_&]:text-2xl">
                      {title}
                    </DialogPrimitive.Title>
                  )}
                  {description && (
                    <DialogPrimitive.Description className="text-sm text-stone-500 [.patient-mode_&]:text-lg">
                      {description}
                    </DialogPrimitive.Description>
                  )}
                </div>

                {showCloseButton && (
                  <DialogPrimitive.Close
                    onClick={onClose}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 [.patient-mode_&]:p-3 [.patient-mode_&]:min-h-[3rem] [.patient-mode_&]:min-w-[3rem]"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 [.patient-mode_&]:w-7 [.patient-mode_&]:h-7" />
                  </DialogPrimitive.Close>
                )}
              </div>
            )}

            {/* Body */}
            <div className="text-stone-700 [.patient-mode_&]:text-lg">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-end gap-3 [.patient-mode_&]:pt-6">
                {footer}
              </div>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Modal;
