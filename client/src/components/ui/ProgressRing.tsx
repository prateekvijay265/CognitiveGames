import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  color?: string; // stroke color class or hex
  trackColor?: string;
  label?: string;
  showPercent?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 84,
  strokeWidth = 8,
  color = '#0d9488', // teal-600
  trackColor = '#e7e5e4', // stone-200
  label,
  showPercent = true,
  className,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex flex-col items-center justify-center', className)}
      style={{ width: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${Math.round(clampedValue)}% completed`}
      {...props}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 origin-center transform overflow-visible"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            className="transition-colors"
          />

          {/* Animated Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center label / percentage */}
        {showPercent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-stone-900 [.patient-mode_&]:text-xl leading-none">
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="mt-1.5 text-xs text-stone-600 font-medium text-center [.patient-mode_&]:text-base">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
