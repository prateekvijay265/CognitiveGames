import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-stone-200/80 rounded-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent animate-pulse',
        className
      )}
      {...props}
    />
  );
};

export interface SkeletonLineProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width,
  height,
  className,
  style,
  ...props
}) => {
  return (
    <Skeleton
      className={cn('h-4 w-full rounded-md', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
};

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 48,
  className,
  style,
  ...props
}) => {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      {...props}
    />
  );
};

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hasImage?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-4',
        className
      )}
      {...props}
    >
      {hasImage && <Skeleton className="h-36 w-full rounded-xl" />}
      <div className="flex items-center gap-3">
        <SkeletonCircle size={44} />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="65%" className="h-5" />
          <SkeletonLine width="40%" className="h-3" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <SkeletonLine width="100%" />
        <SkeletonLine width="85%" />
      </div>
      <div className="pt-2 flex justify-end">
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 4,
  columns = 4,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs p-4',
        className
      )}
      {...props}
    >
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-stone-100">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLine key={`th-${i}`} className="h-4" />
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-stone-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`tr-${r}`} className="grid grid-cols-4 gap-4 py-3.5 items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <SkeletonLine
                key={`td-${r}-${c}`}
                className={c === 0 ? 'h-5 w-3/4' : 'h-4 w-1/2'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  Table: SkeletonTable,
};
