import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const cardVariants = cva(
  'rounded-2xl transition-all duration-200 overflow-hidden text-stone-900 [.patient-mode_&]:rounded-3xl',
  {
    variants: {
      variant: {
        default: 'bg-white border border-stone-200/80 shadow-sm',
        elevated: 'bg-white border border-stone-100 shadow-md hover:shadow-lg',
        flat: 'bg-stone-50/80 border border-stone-200/60 shadow-none',
        colored:
          'bg-gradient-to-br from-teal-50/80 via-white to-blue-50/40 border border-teal-100 shadow-sm',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8',
        xl: 'p-8 sm:p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, as: Component = 'div', onClick, role, ...props }, ref) => {
    const isInteractive = Boolean(onClick);
    return (
      <Component
        ref={ref}
        onClick={onClick}
        role={role || (isInteractive ? 'button' : undefined)}
        tabIndex={isInteractive ? 0 : undefined}
        className={cn(
          cardVariants({ variant, padding }),
          isInteractive &&
            'cursor-pointer hover:border-teal-300 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5 pb-4 border-b border-stone-100/80 [.patient-mode_&]:pb-5',
          className
        )}
        {...props}
      >
        {children ?? (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h3 className="text-xl font-bold tracking-tight text-stone-900 [.patient-mode_&]:text-2xl">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-stone-500 [.patient-mode_&]:text-lg font-normal">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pt-4 text-stone-800 [.patient-mode_&]:text-lg', className)}
        {...props}
      />
    );
  }
);
CardBody.displayName = 'CardBody';

export const CardContent = CardBody;

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between pt-4 mt-4 border-t border-stone-100/80 [.patient-mode_&]:pt-5',
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export default Card;
