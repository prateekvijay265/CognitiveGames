import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors select-none [.patient-mode_&]:text-base [.patient-mode_&]:px-3.5 [.patient-mode_&]:py-1.5 [.patient-mode_&]:font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-stone-100 text-stone-800 border border-stone-200/90',
        success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-900 border border-amber-200',
        danger: 'bg-red-50 text-red-800 border border-red-200',
        info: 'bg-blue-50 text-blue-800 border border-blue-200',
        outline: 'bg-transparent text-stone-700 border border-stone-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
        md: 'px-2.5 py-1 text-sm rounded-lg gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
