import * as React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-stone-200/90 bg-[#f8f7f4]/60 transition-all [.patient-mode_&]:p-12',
        className
      )}
      {...props}
    >
      {/* Icon with soft warm ring */}
      <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xs border border-stone-200 text-teal-600 mb-4 [.patient-mode_&]:w-24 [.patient-mode_&]:h-24">
        {icon ?? <Inbox className="w-8 h-8 sm:w-10 sm:h-10 text-stone-400 stroke-[1.5]" />}
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2 [.patient-mode_&]:text-3xl">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="max-w-md text-stone-500 text-sm sm:text-base leading-relaxed mb-6 [.patient-mode_&]:text-xl [.patient-mode_&]:max-w-lg">
          {description}
        </p>
      )}

      {/* Optional CTA */}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          size="lg"
          onClick={action.onClick}
          className="shadow-sm [.patient-mode_&]:text-xl [.patient-mode_&]:h-14 [.patient-mode_&]:px-8"
        >
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
};

export default EmptyState;
