import * as React from 'react';
import { Loader2, Check, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

export interface SyncIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: SyncStatus;
  showLabel?: boolean;
  lastSyncTime?: Date | string | null;
  onRetry?: () => void;
}

const STATUS_CONFIG: Record<
  SyncStatus,
  {
    label: string;
    dotClass: string;
    textClass: string;
    bgClass: string;
    icon: (className: string) => React.ReactNode;
  }
> = {
  online: {
    label: 'Online',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50/80 border-emerald-200/80',
    icon: (c) => <Wifi className={c} />,
  },
  offline: {
    label: 'Offline',
    dotClass: 'bg-stone-400',
    textClass: 'text-stone-600',
    bgClass: 'bg-stone-100 border-stone-200',
    icon: (c) => <WifiOff className={c} />,
  },
  syncing: {
    label: 'Syncing',
    dotClass: 'bg-teal-500',
    textClass: 'text-teal-700',
    bgClass: 'bg-teal-50 border-teal-200',
    icon: (c) => <Loader2 className={cn(c, 'animate-spin')} />,
  },
  synced: {
    label: 'Synced',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50/60 border-emerald-200/60',
    icon: (c) => <Check className={c} />,
  },
  error: {
    label: 'Sync Error',
    dotClass: 'bg-red-500',
    textClass: 'text-red-700',
    bgClass: 'bg-red-50 border-red-200',
    icon: (c) => <AlertCircle className={c} />,
  },
};

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status = typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online',
  showLabel = true,
  lastSyncTime,
  onRetry,
  className,
  ...props
}) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.online;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border select-none transition-all duration-150',
        config.bgClass,
        config.textClass,
        onRetry && status === 'error' && 'cursor-pointer hover:bg-red-100',
        className
      )}
      role="status"
      aria-label={`Connection status: ${config.label}`}
      onClick={status === 'error' && onRetry ? onRetry : undefined}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {status === 'syncing' ? (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
        ) : status === 'online' ? (
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        ) : null}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.dotClass)} />
      </span>

      {showLabel && <span className="font-semibold">{config.label}</span>}

      {lastSyncTime && status === 'synced' && (
        <span className="text-[10px] text-stone-400 font-normal hidden sm:inline">
          {typeof lastSyncTime === 'string'
            ? lastSyncTime
            : lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
};

export default SyncIndicator;
