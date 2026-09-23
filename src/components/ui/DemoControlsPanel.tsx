import React, { useState } from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { Settings, RefreshCw, AlertTriangle, UserX, FastForward, Check } from 'lucide-react';

export const DemoControlsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    speedMultiplier,
    setSpeedMultiplier,
    simulateNoDriversError,
    toggleSimulateNoDriversError,
    simulateDelayError,
    toggleSimulateDelayError,
    resetDemoData,
  } = useLogisticsStore();

  return (
    <div className="fixed bottom-4 left-4 z-[90] font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-full shadow-lg border border-border-strong flex items-center gap-2 group transition-all duration-150 cursor-pointer"
          title="Demo Simulation Controls"
          aria-label="Open Demo Simulation Controls"
        >
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-medium pr-1.5 hidden sm:inline">Demo Controls</span>
        </button>
      ) : (
        <div className="bg-surface border border-border-strong rounded-xl shadow-lg p-4 w-72 flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Demo Sim Controls
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary text-xs font-semibold p-1"
            >
              ✕
            </button>
          </div>

          {/* Speed Multiplier */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-secondary flex items-center justify-between">
              <span className="flex items-center gap-1"><FastForward className="w-3.5 h-3.5 text-accent" /> Route Speed</span>
              <span className="font-mono text-accent font-semibold">{speedMultiplier}x</span>
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`py-1 rounded text-xs font-medium transition-colors border cursor-pointer ${
                    speedMultiplier === speed
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Simulate Errors / Edge Cases */}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Simulate Edge Cases
            </span>

            {/* No drivers error */}
            <button
              onClick={toggleSimulateNoDriversError}
              className={`flex items-center justify-between p-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                simulateNoDriversError
                  ? 'bg-error/10 border-error/40 text-error'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UserX className="w-3.5 h-3.5" />
                Simulate: No Drivers Nearby
              </span>
              {simulateNoDriversError && <Check className="w-3.5 h-3.5 text-error" />}
            </button>

            {/* Traffic Delay error */}
            <button
              onClick={toggleSimulateDelayError}
              className={`flex items-center justify-between p-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                simulateDelayError
                  ? 'bg-warning/15 border-warning/40 text-warning font-semibold'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Simulate: Delivery Delay
              </span>
              {simulateDelayError && <Check className="w-3.5 h-3.5 text-warning" />}
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 bg-surface-elevated hover:bg-[#E8E4DA] text-text-primary rounded-md border border-border-strong transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Demo Data
          </button>
        </div>
      )}
    </div>
  );
};
