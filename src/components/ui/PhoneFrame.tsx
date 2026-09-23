import React from 'react';
import { motion } from 'framer-motion';

export interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title = 'Corridor Mobile',
  badge,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[390px] h-[780px] bg-[#14171F] rounded-[48px] p-3 shadow-float border-[4px] border-[#2A2E3D] relative flex flex-col overflow-hidden"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0B0D12] rounded-full z-40 flex items-center justify-between px-3 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1E29] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D2B45] opacity-80" />
          </div>
          <div className="w-2 h-2 rounded-full bg-[#131722]" />
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-background rounded-[38px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-text-primary z-30 select-none bg-background/80 backdrop-blur-sm">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              {badge && (
                <span className="text-[9px] uppercase tracking-wider bg-accent/15 text-accent font-bold px-1.5 py-0.5 rounded">
                  {badge}
                </span>
              )}
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-4 h-2.5 border border-text-primary rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-text-primary rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Home Bar Indicator */}
          <div className="h-5 flex items-center justify-center bg-background pointer-events-none z-30">
            <div className="w-32 h-1 bg-text-muted/40 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
