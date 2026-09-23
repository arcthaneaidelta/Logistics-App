import React, { useState } from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { StylizedMap } from '../../components/map/StylizedMap';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { AddressAutocomplete } from '../../components/ui/AddressAutocomplete';
import { StatusChip } from '../../components/ui/StatusChip';
import { RatingStars } from '../../components/ui/RatingStars';
import { 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomerScreen = 'home' | 'new_order' | 'matching' | 'tracking' | 'delivered';

export const CustomerApp: React.FC = () => {
  const [screen, setScreen] = useState<CustomerScreen>('home');
  const [itemDesc, setItemDesc] = useState('Sealed document pouch (Legal deeds)');
  const [pickup, setPickup] = useState('742 Evergreen Terrace, Downtown');
  const [dropoff, setDropoff] = useState('1200 Innovation Way, Tech Park');
  const [errors, setErrors] = useState<{ item?: string; pickup?: string; dropoff?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState('');
  const [demoTooltip, setDemoTooltip] = useState<string | null>(null);

  const {
    activeTrip,
    createOrder,
    cancelActiveOrder,
    rateDeliveredOrder,
    activeTripEta,
    activeTripProgress,
    simulateNoDriversError,
  } = useLogisticsStore();

  const handleValidateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { item?: string; pickup?: string; dropoff?: string } = {};

    if (!itemDesc.trim()) newErrors.item = 'Describe what you need delivered';
    if (!pickup.trim()) newErrors.pickup = 'Enter a pickup location';
    if (!dropoff.trim()) newErrors.dropoff = 'Enter a dropoff destination';
    if (pickup.trim().toLowerCase() === dropoff.trim().toLowerCase() && pickup) {
      newErrors.dropoff = 'Dropoff must differ from pickup location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setScreen('matching');

    const result = await createOrder(itemDesc, pickup, dropoff);
    setIsSubmitting(false);

    if (result.success) {
      setScreen('tracking');
    }
  };

  const handleActionTooltip = (text: string) => {
    setDemoTooltip(text);
    setTimeout(() => setDemoTooltip(null), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background relative overflow-hidden">
      {/* Action Tooltip notification for mock icons */}
      <AnimatePresence>
        {demoTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-medium py-1 px-3 rounded-full shadow-md z-50 pointer-events-none"
          >
            {demoTooltip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen 1: Customer Home */}
      {screen === 'home' && (
        <div className="flex-1 flex flex-col p-4 justify-between animate-in fade-in duration-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Welcome back</p>
                <h2 className="text-lg font-bold text-text-primary">Whitfield & Co.</h2>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                WC
              </div>
            </div>

            {/* Quick Request Delivery Hero Card */}
            <div className="bg-surface rounded-xl p-4 border border-border shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-md bg-accent-tint text-accent">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Need an item moved?</h3>
                  <p className="text-xs text-text-secondary">Direct door-to-door courier dispatch</p>
                </div>
              </div>

              <Button
                variant="accent"
                onClick={() => setScreen('new_order')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full text-sm font-semibold"
              >
                Request a Delivery
              </Button>
            </div>

            {/* In-Flight Delivery Shortcut (if active) */}
            {activeTrip && activeTrip.status !== 'delivered' && (
              <div
                onClick={() => setScreen('tracking')}
                className="bg-surface-elevated rounded-xl p-3.5 border border-accent/40 shadow-sm cursor-pointer hover:border-accent transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Active Delivery in Progress</p>
                    <p className="text-[11px] text-text-secondary truncate max-w-[200px]">
                      {activeTrip.itemDescription}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-accent">ETA {activeTripEta}m</span>
                  <span className="text-[10px] block text-text-muted">View live map →</span>
                </div>
              </div>
            )}

            {/* Recent Deliveries */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Recent Orders
              </span>
              <div className="flex flex-col gap-2">
                <div className="p-3 bg-surface rounded-lg border border-border text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Bakery wholesale order</p>
                    <p className="text-[11px] text-text-muted">Yesterday • CR-8919</p>
                  </div>
                  <StatusChip status="delivered" label="Delivered" />
                </div>
                <div className="p-3 bg-surface rounded-lg border border-border text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">3 boxes — office supplies</p>
                    <p className="text-[11px] text-text-muted">2 days ago • CR-8918</p>
                  </div>
                  <StatusChip status="delivered" label="Delivered" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-2 text-[11px] text-text-muted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>All deliveries verified with digital chain of custody</span>
          </div>
        </div>
      )}

      {/* Screen 2: New Order Form */}
      {screen === 'new_order' && (
        <div className="flex-1 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setScreen('home')}
                className="p-1 text-text-secondary hover:text-text-primary rounded cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold text-text-primary">New Delivery Request</h2>
            </div>

            <form onSubmit={handleValidateAndSubmit} className="flex flex-col gap-3.5">
              <FormInput
                label="Item Description"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                error={errors.item}
                helperText="e.g. Sealed legal documents, 2 parcels, bakery box"
                icon={<Package className="w-4 h-4" />}
              />

              <AddressAutocomplete
                label="Pickup Address"
                value={pickup}
                onChange={setPickup}
                error={errors.pickup}
              />

              <AddressAutocomplete
                label="Dropoff Address"
                value={dropoff}
                onChange={setDropoff}
                error={errors.dropoff}
              />

              <div className="bg-surface-elevated rounded-lg p-3 border border-border flex items-center justify-between text-xs mt-1">
                <div>
                  <span className="text-text-secondary block">Estimated Price</span>
                  <span className="text-xs font-semibold text-success flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Standard flat rate
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-text-primary">$16.50</span>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              variant="accent"
              size="lg"
              onClick={handleValidateAndSubmit}
              isLoading={isSubmitting}
              className="w-full font-semibold"
            >
              Confirm & Find Courier
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScreen('home')}
              className="w-full text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Screen 3: Matching (Search in Progress) */}
      {screen === 'matching' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          {!simulateNoDriversError ? (
            <div className="flex flex-col items-center gap-4 max-w-xs">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <Package className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Matching nearby courier…</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Broadcasting to vetted riders in Downtown & Midtown zones.
                </p>
              </div>
              <div className="bg-surface-elevated px-3 py-1.5 rounded-full border border-border text-[11px] text-text-muted flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-accent" />
                <span>Estimated dispatch: ~47s</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancelActiveOrder();
                  setScreen('home');
                }}
                className="mt-4 text-xs"
              >
                Cancel Request
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3.5 max-w-xs animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-warning/15 flex items-center justify-center text-warning">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No couriers nearby right now</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                All drivers in this zone are currently completing scheduled deliveries. You can retry in a few moments.
              </p>
              <div className="flex flex-col gap-2 w-full mt-2">
                <Button
                  variant="primary"
                  onClick={() => setScreen('new_order')}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-semibold"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setScreen('home')}
                  className="w-full text-xs"
                >
                  Return Home
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 4: Live Tracking Map */}
      {screen === 'tracking' && activeTrip && (
        <div className="flex-1 flex flex-col relative overflow-hidden animate-in fade-in duration-200">
          {/* Top Floating App Bar */}
          <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between">
            <button
              onClick={() => setScreen('home')}
              className="bg-surface/90 backdrop-blur-md p-2 rounded-full shadow-sm border border-border text-text-primary hover:bg-surface cursor-pointer"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <StatusChip
              status={activeTrip.status}
              label={activeTrip.status === 'delayed' ? 'Delayed Traffic' : 'Live Tracking'}
              pulse
            />
          </div>

          {/* Map canvas */}
          <div className="flex-1 w-full h-full">
            <StylizedMap />
          </div>

          {/* Bottom Floating Driver / Delivery Card */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface border-t border-border p-4 shadow-float rounded-t-2xl flex flex-col gap-3 z-30"
          >
            <div className="w-10 h-1 bg-border-strong rounded-full mx-auto" />

            {/* Courier Profile row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shadow-sm text-sm"
                  style={{ backgroundColor: activeTrip.driver?.avatarBg || '#2E4C6D' }}
                >
                  {activeTrip.driver?.initials || 'MW'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-text-primary">
                      {activeTrip.driver?.name || 'Marcus Webb'}
                    </h4>
                    <span className="text-[11px] font-semibold text-accent flex items-center">
                      ★ {activeTrip.driver?.rating || 4.9}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    {activeTrip.driver?.vehicle || 'Honda Activa (Scooter)'}
                  </p>
                </div>
              </div>

              {/* Call / Message Mock Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleActionTooltip('Calling Marcus Webb... (Demo Mode)')}
                  className="p-2.5 rounded-full bg-surface-elevated hover:bg-[#E4DFD3] text-text-primary border border-border transition-colors cursor-pointer"
                  title="Call Courier"
                  aria-label="Call Courier"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleActionTooltip('Opening courier messaging... (Demo Mode)')}
                  className="p-2.5 rounded-full bg-surface-elevated hover:bg-[#E4DFD3] text-text-primary border border-border transition-colors cursor-pointer"
                  title="Message Courier"
                  aria-label="Message Courier"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Order progress mini bar */}
            <div className="flex flex-col gap-1.5 bg-surface-elevated p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">ETA: {activeTripEta} mins</span>
                <span className="text-[11px] text-text-muted">Order {activeTrip.id}</span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(10, activeTripProgress)}%` }}
                />
              </div>
              <p className="text-[11px] text-text-secondary truncate mt-0.5">
                Dropoff: {activeTrip.dropoffAddress}
              </p>
            </div>

            {/* Trigger Mock Completion */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setScreen('delivered')}
                rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="w-full text-xs font-semibold"
              >
                Simulate Arrival & Complete
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Screen 5: Delivered & Rating Confirmation */}
      {screen === 'delivered' && (
        <div className="flex-1 flex flex-col justify-between p-5 text-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center text-success mb-1">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-text-primary font-serif">Item Delivered!</h2>
            <p className="text-xs text-text-secondary max-w-xs">
              Marcus Webb successfully delivered your document pouch to 1200 Innovation Way.
            </p>

            {/* Star Rating Card */}
            <div className="bg-surface border border-border rounded-xl p-4 w-full mt-3 flex flex-col items-center gap-2.5 shadow-sm">
              <span className="text-xs font-semibold text-text-primary">
                How was Marcus's delivery service?
              </span>
              <RatingStars
                value={userRating}
                interactive
                onChange={setUserRating}
                size="lg"
              />
              <input
                type="text"
                placeholder="Optional delivery feedback (e.g. on time, polite)"
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                className="w-full text-xs p-2.5 mt-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                if (activeTrip) {
                  rateDeliveredOrder(activeTrip.id, userRating, userFeedback);
                }
                setScreen('home');
              }}
              className="w-full text-sm font-semibold"
            >
              Submit Rating & Finish
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScreen('home')}
              className="w-full text-xs"
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
