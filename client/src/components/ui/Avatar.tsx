import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const avatarVariants = cva(
  'relative inline-flex items-center justify-center rounded-full font-bold select-none overflow-hidden shrink-0 border-2 border-white shadow-xs',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base [.patient-mode_&]:w-16 [.patient-mode_&]:h-16 [.patient-mode_&]:text-xl',
        xl: 'w-20 h-20 text-2xl [.patient-mode_&]:w-24 [.patient-mode_&]:h-24 [.patient-mode_&]:text-3xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const COLOR_PALETTES = [
  { bg: 'bg-teal-100 text-teal-800', border: 'border-teal-200' },
  { bg: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  { bg: 'bg-amber-100 text-amber-900', border: 'border-amber-200' },
  { bg: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' },
  { bg: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-200' },
  { bg: 'bg-rose-100 text-rose-800', border: 'border-rose-200' },
  { bg: 'bg-purple-100 text-purple-800', border: 'border-purple-200' },
  { bg: 'bg-cyan-100 text-cyan-800', border: 'border-cyan-200' },
];

function getInitials(name?: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name?: string) {
  if (!name) return COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  name?: string;
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size, fallback, className, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setImageError(false);
    }, [src]);

    const palette = getColorFromName(name);
    const initials = getInitials(name);
    const showImage = Boolean(src) && !imageError;

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size }),
          !showImage && palette.bg,
          className
        )}
        aria-label={alt || name || 'User avatar'}
        role="img"
        {...props}
      >
        {showImage ? (
          <img
            src={src!}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          fallback ?? <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
