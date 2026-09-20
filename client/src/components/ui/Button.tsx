import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [.patient-mode_&]:min-h-[3.5rem] [.patient-mode_&]:text-lg [.patient-mode_&]:tracking-wide [.patient-mode_&]:font-semibold',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-sm active:scale-[0.98] border border-transparent',
        secondary:
          'bg-white border-2 border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300 shadow-sm active:scale-[0.98]',
        ghost:
          'bg-transparent hover:bg-stone-100 text-stone-700 active:scale-[0.98]',
        danger:
          'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
        md: 'h-11 px-5 text-base rounded-xl gap-2',
        lg: 'h-12 px-6 text-lg rounded-xl gap-2.5',
        xl: 'h-14 px-8 text-xl rounded-2xl gap-3 min-h-[3.5rem]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      children,
      asChild = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        className: cn(combinedClassName, (children.props as { className?: string }).className),
        ref,
        ...props,
        'aria-disabled': disabled || isLoading,
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
