import React, { useState } from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { StylizedMap } from '../../components/map/StylizedMap';
import { Button } from '../../components/ui/Button';
import { StatusChip } from '../../components/ui/StatusChip';
import { 
  Bike, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  UserCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DriverApp: React.FC = () => {
  const {
    currentDriver,
    isDriverOnline,
    toggleDriverOnline,
    incomingOffer,
    acceptJobOffer,
    declineJobOffer,
    driverStep,
    advanceDriverStep,
    activeTrip,
    floatingEarningsDelta,
    activeTripEta,
  } = useLogisticsStore();

  const [hasPhotoProof, setHasPhotoProof] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'earnings' | 'profile'>('deliveries');

  const handleSimulatePhoto = () => {
    setIsPhotoUploading(true);
    setTimeout(() => {
      setIsPhotoUploading(false);
      setHasPhotoProof(true);
    }, 700);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background relative overflow-hidden select-none">
      {/* Driver Top Status Bar */}
      <div className="p-3 bg-surface border-b border-border flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-sm"
            style={{ backgroundColor: currentDriver.avatarBg }}
          >
            {currentDriver.initials}
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-primary leading-tight">{currentDriver.name}</h3>
            <p className="text-[10px] text-text-muted">{currentDriver.zone} • ★ {currentDriver.rating}</p>
          </div>
        </div>

        {/* Online / Offline Spring Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {isDriverOnline ? 'Online' : 'Offline'}
          </span>
          <button
            onClick={toggleDriverOnline}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              isDriverOnline ? 'bg-success' : 'bg-border-strong'
            }`}
            aria-label="Toggle Online Status"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`bg-white w-4 h-4 rounded-full shadow-md ${
                isDriverOnline ? 'ml-auto' : 'mr-auto'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto flex flex-col relative">
        {activeTab === 'deliveries' && (
          <div className="flex-1 flex flex-col relative">
            {/* INCOMING OFFER MODAL / CARD */}
            <AnimatePresence>
              {incomingOffer && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="absolute top-3 left-3 right-3 z-40 bg-surface border-2 border-accent rounded-2xl p-4 shadow-float flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-border/70 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" /> High-Priority Job Offer
                    </span>
                    <span className="text-xs font-mono font-bold bg-accent-tint text-accent px-2 py-0.5 rounded">
                      +${(incomingOffer.driverEarnings || 12.40).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-text-primary leading-snug">
                      {incomingOffer.itemDescription}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate">From: {incomingOffer.pickupAddress}</span>
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">To: {incomingOffer.dropoffAddress}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={declineJobOffer}
                      className="text-xs"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={acceptJobOffer}
                      className="text-xs font-bold"
                    >
                      Accept Job
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Offline Screen State */}
            {!isDriverOnline ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-secondary gap-3">
                <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-text-muted">
                  <Bike className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-text-primary">You are currently Offline</h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Toggle your status to Online above to start receiving instant delivery dispatches in your zone.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={toggleDriverOnline}
                  className="mt-2 text-xs font-semibold"
                >
                  Go Online Now
                </Button>
              </div>
            ) : driverStep === 'none' && !incomingOffer ? (
              /* Idle Waiting for Dispatch */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/20" />
                  <div className="w-14 h-14 rounded-full bg-accent-tint text-accent flex items-center justify-center">
                    <Navigation className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Scanning for nearby dispatches…</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-xs">
                    You're queued in {currentDriver.zone}. Switch to Customer App to request a delivery and see it appear here!
                  </p>
                </div>
              </div>
            ) : (
              /* Active Delivery Step Progression */
              <div className="flex-1 flex flex-col relative">
                {/* Step Progression Bar */}
                <div className="p-3 bg-surface border-b border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      driverStep === 'accepted' ? 'bg-accent text-white' : 'bg-success text-white'
                    }`}>
                      1
                    </span>
                    <span className={`font-semibold ${driverStep === 'accepted' ? 'text-accent' : 'text-text-muted'}`}>
                      Pickup
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-border-strong" />
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      driverStep === 'picked_up' ? 'bg-accent text-white' : driverStep === 'delivered' ? 'bg-success text-white' : 'bg-surface-elevated text-text-muted border border-border'
                    }`}>
                      2
                    </span>
                    <span className={`font-semibold ${driverStep === 'picked_up' ? 'text-accent' : 'text-text-muted'}`}>
                      Drop-off
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-border-strong" />
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      driverStep === 'delivered' ? 'bg-success text-white' : 'bg-surface-elevated text-text-muted border border-border'
                    }`}>
                      ✓
                    </span>
                    <span className="text-text-muted font-medium">Done</span>
                  </div>
                </div>

                {/* Live Navigation Map View */}
                <div className="flex-1 w-full min-h-[220px]">
                  <StylizedMap />
                </div>

                {/* Step Action Bottom Sheet */}
                <div className="bg-surface border-t border-border p-4 shadow-float flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-text-primary text-sm">
                        {driverStep === 'accepted' ? 'Pickup Location' : 'Delivery Destination'}
                      </p>
                      <p className="text-text-secondary text-[11px] truncate max-w-[220px]">
                        {driverStep === 'accepted'
                          ? activeTrip?.pickupAddress || '742 Evergreen Terrace'
                          : activeTrip?.dropoffAddress || '1200 Innovation Way'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-accent">ETA {activeTripEta}m</span>
                  </div>

                  {/* Proof of Delivery photo tile (when dropping off) */}
                  {driverStep === 'picked_up' && (
                    <div
                      onClick={handleSimulatePhoto}
                      className="border-2 border-dashed border-border-strong rounded-xl p-3 bg-surface-elevated flex items-center justify-center gap-2 cursor-pointer hover:border-accent transition-colors"
                    >
                      <Camera className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-text-primary">
                        {isPhotoUploading
                          ? 'Capturing photo…'
                          : hasPhotoProof
                          ? '✓ Photo of package secured'
                          : 'Tap to capture Proof of Delivery photo'}
                      </span>
                    </div>
                  )}

                  {/* Advance Button */}
                  {driverStep === 'accepted' ? (
                    <Button
                      variant="accent"
                      size="md"
                      onClick={() => advanceDriverStep('picked_up')}
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="w-full text-xs font-bold"
                    >
                      Confirm Item Picked Up
                    </Button>
                  ) : driverStep === 'picked_up' ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => advanceDriverStep('delivered')}
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="w-full text-xs font-bold"
                    >
                      Confirm Drop-off & Earn +${(activeTrip?.driverEarnings || 11.20).toFixed(2)}
                    </Button>
                  ) : (
                    <div className="p-2 bg-success/15 border border-success/30 rounded-lg text-center text-xs font-semibold text-success flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Delivery Complete! Ready for next job.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Driver Earnings */}
        {activeTab === 'earnings' && (
          <div className="p-4 flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Earnings Hero Banner */}
            <div className="bg-primary text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                Today's Courier Earnings
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-3xl font-extrabold font-mono tabular-nums">
                  ${currentDriver.earningsToday.toFixed(2)}
                </h2>
                {/* Floating animated delta on completion */}
                <AnimatePresence>
                  {floatingEarningsDelta !== null && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -8 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-full"
                    >
                      +${floatingEarningsDelta.toFixed(2)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Completed Today</span>
                  <span className="font-bold text-white text-sm">{currentDriver.completedToday} trips</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Avg. per Delivery</span>
                  <span className="font-bold text-white text-sm">
                    ${(currentDriver.earningsToday / Math.max(1, currentDriver.completedToday)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Recent Completed Dispatches
              </span>
              <div className="bg-surface border border-border rounded-xl divide-y divide-border text-xs">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Legal Document Pouch</p>
                    <p className="text-[11px] text-text-muted">Downtown → Midtown • 18 min</p>
                  </div>
                  <span className="font-mono font-bold text-success">+$10.80</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Bakery Wholesale 12x</p>
                    <p className="text-[11px] text-text-muted">Central Depot → Riverside • 26 min</p>
                  </div>
                  <span className="font-mono font-bold text-success">+$21.00</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Priority Tech Supplies</p>
                    <p className="text-[11px] text-text-muted">Uptown → Midtown • 14 min</p>
                  </div>
                  <span className="font-mono font-bold text-success">+$14.20</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Driver Profile */}
        {activeTab === 'profile' && (
          <div className="p-4 flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div
                className="w-16 h-16 rounded-full text-white font-extrabold flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: currentDriver.avatarBg }}
              >
                {currentDriver.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{currentDriver.name}</h3>
                <p className="text-xs text-text-secondary">Verified Courier Partner</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold bg-accent-tint text-accent px-2.5 py-0.5 rounded-full">
                  ★ {currentDriver.rating} Rating
                </span>
                <span className="text-xs font-semibold bg-success/10 text-success px-2.5 py-0.5 rounded-full">
                  98.4% On-Time
                </span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-3.5 flex flex-col gap-2.5 text-xs">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                Courier Vehicle Details
              </span>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Registered Vehicle</span>
                <span className="font-semibold text-text-primary">{currentDriver.vehicle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-text-muted">Active Zone Hub</span>
                <span className="font-semibold text-text-primary">{currentDriver.zone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Direct Phone</span>
                <span className="font-semibold text-text-primary font-mono">{currentDriver.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Driver Bottom Navigation Tab Bar */}
      <div className="h-14 bg-surface border-t border-border flex items-center justify-around z-20">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex flex-col items-center gap-0.5 p-1 text-xs cursor-pointer ${
            activeTab === 'deliveries' ? 'text-accent font-bold' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span className="text-[10px]">Deliveries</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-0.5 p-1 text-xs cursor-pointer ${
            activeTab === 'earnings' ? 'text-accent font-bold' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px]">Earnings</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 text-xs cursor-pointer ${
            activeTab === 'profile' ? 'text-accent font-bold' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
