import React, { useState, useEffect } from 'react';
import { useLogisticsStore } from './store/useLogisticsStore';
import { LandingPage } from './app/marketing/LandingPage';
import { CustomerApp } from './app/customer/CustomerApp';
import { DriverApp } from './app/driver/DriverApp';
import { OpsDashboard } from './app/dashboard/OpsDashboard';
import { PhoneFrame } from './components/ui/PhoneFrame';
import { DemoRoleSwitcher } from './components/ui/DemoRoleSwitcher';
import { DemoControlsPanel } from './components/ui/DemoControlsPanel';
import { ToastContainer } from './components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const { activeRole } = useLogisticsStore();
  const [isLoading, setIsLoading] = useState(true);

  // Section 6 Loading Experience (~1.2s, adaptive, never blocking)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary relative selection:bg-accent selection:text-white">
      {/* SECTION 6: CURATED LOADING EXPERIENCE */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center pointer-events-none select-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3"
            >
              <span className="w-4 h-4 rounded-full bg-accent" />
              <h1 className="font-serif text-3xl font-bold tracking-tight text-primary">
                CORRIDOR
              </h1>
            </motion.div>

            {/* Drawing thin accent line */}
            <div className="w-36 h-0.5 bg-border mt-3 overflow-hidden rounded-full relative">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full bg-accent origin-left"
              />
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-2 tracking-wider uppercase">
              Initializing Logistics Telemetry…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Reviewer Affordances */}
      <DemoRoleSwitcher />
      <DemoControlsPanel />
      <ToastContainer />

      {/* Active Surface Router Rendering */}
      <div className="w-full min-h-screen">
        {activeRole === 'marketing' && <LandingPage />}

        {activeRole === 'customer' && (
          <div className="min-h-screen bg-surface-elevated flex flex-col items-center justify-center p-4">
            <div className="text-center mb-2">
              <span className="text-[11px] font-mono uppercase font-bold text-accent">
                Standalone Surface
              </span>
              <h2 className="text-xl font-bold text-primary font-serif">Customer Delivery Portal</h2>
            </div>
            <PhoneFrame badge="Customer">
              <CustomerApp />
            </PhoneFrame>
          </div>
        )}

        {activeRole === 'driver' && (
          <div className="min-h-screen bg-surface-elevated flex flex-col items-center justify-center p-4">
            <div className="text-center mb-2">
              <span className="text-[11px] font-mono uppercase font-bold text-accent">
                Standalone Surface
              </span>
              <h2 className="text-xl font-bold text-primary font-serif">Courier Driver Terminal</h2>
            </div>
            <PhoneFrame badge="Courier">
              <DriverApp />
            </PhoneFrame>
          </div>
        )}

        {activeRole === 'dashboard' && <OpsDashboard />}
      </div>
    </div>
  );
}

export default App;
