import * as React from 'react';
import { Volume2 } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { voiceService } from '@/services/voice';

export interface VoiceButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  textToSpeak?: string;
  size?: 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  size = 'lg',
  showLabel = false,
  label = 'Repeat Instructions',
  className,
  onClick,
  ...props
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }

    try {
      setIsSpeaking(true);
      if (textToSpeak) {
        await voiceService.speak(textToSpeak);
      } else {
        await voiceService.repeat();
      }
    } catch (err) {
      console.error('Voice playback error:', err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const sizeClasses = {
    md: 'w-11 h-11 min-h-[2.75rem] text-sm',
    lg: 'w-14 h-14 min-h-[3.5rem] text-base [.patient-mode_&]:w-16 [.patient-mode_&]:h-16',
    xl: 'w-16 h-16 min-h-[4rem] text-lg [.patient-mode_&]:w-20 [.patient-mode_&]:h-20',
  };

  const iconSizes = {
    md: 'w-5 h-5',
    lg: 'w-7 h-7 [.patient-mode_&]:w-8 [.patient-mode_&]:h-8',
    xl: 'w-8 h-8 [.patient-mode_&]:w-10 [.patient-mode_&]:h-10',
  };

  return (
    <div className="inline-flex flex-col items-center justify-center gap-1.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
        className={cn(
          'relative rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 active:scale-95 select-none',
          'bg-amber-500 hover:bg-amber-600 text-white',
          sizeClasses[size],
          className
        )}
        aria-label={props['aria-label'] || label || 'Listen to instructions'}
        title={label}
        {...props}
      >
        {/* Animated pulse rings when speaking */}
        {isSpeaking && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-400 opacity-60 pointer-events-none"
              animate={{ scale: [1, 1.45, 1.7], opacity: [0.7, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-500 opacity-40 pointer-events-none"
              animate={{ scale: [1, 1.25, 1.45], opacity: [0.6, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            />
          </>
        )}

        {isSpeaking ? (
          <Volume2 className={cn(iconSizes[size], 'animate-pulse text-white relative z-10')} />
        ) : (
          <Volume2 className={cn(iconSizes[size], 'text-white relative z-10')} />
        )}
      </motion.button>

      {showLabel && (
        <span className="text-xs font-semibold text-stone-700 select-none text-center [.patient-mode_&]:text-base">
          {label}
        </span>
      )}
    </div>
  );
};

export default VoiceButton;
