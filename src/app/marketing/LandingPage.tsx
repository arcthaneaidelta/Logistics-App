import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { CustomerApp } from '../customer/CustomerApp';
import { PhoneFrame } from '../../components/ui/PhoneFrame';
import { Button } from '../../components/ui/Button';
import { StylizedMap } from '../../components/map/StylizedMap';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Package, 
  Zap, 
  CheckCircle2, 
  ChevronDown,
  Navigation,
  Sparkles,
  Users,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setActiveRole, activeTrip, activeTripEta } = useLogisticsStore();

  return (
    <div className="w-full min-h-screen bg-background text-text-primary flex flex-col font-sans select-none">
      {/* Marketing Top Navigation */}
      <header className="h-20 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-accent" />
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            CORRIDOR
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#marketplace" className="hover:text-primary transition-colors">Marketplace</a>
          <a href="#metrics" className="hover:text-primary transition-colors">Operations</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveRole('driver')}
            className="hidden sm:inline-flex text-xs font-semibold"
          >
            Partner as Courier
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveRole('customer')}
            className="text-xs font-semibold"
          >
            Launch Web App
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-12 pb-20 px-6 lg:px-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Serious Editorial Copy */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-accent-tint border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Logistics, Simplified
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-primary leading-[1.1]">
            Every delivery, tracked to the minute.
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
            Corridor connects customers and courier riders in real time, from doorstep pickup to destination handoff — engineered for businesses and individuals that cannot afford delays.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#demo">
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold text-sm"
              >
                Test Interactive Demo
              </Button>
            </a>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setActiveRole('dashboard')}
              className="text-sm font-semibold"
            >
              Explore Ops HQ
            </Button>
          </div>

          <div className="pt-4 flex items-center gap-6 text-xs text-text-muted border-t border-border">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              <span>Avg. 47s Courier Match</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>100% Chain of Custody</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Live Map Preview Visual with Floating Card */}
        <div className="lg:col-span-6 relative w-full h-[420px] rounded-3xl overflow-hidden border border-border shadow-md">
          <StylizedMap />

          {/* Floating In-Flight Delivery Preview Card */}
          <div className="absolute bottom-6 left-6 right-6 bg-surface/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-float animate-float max-w-sm">
            <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                <span className="text-xs font-bold text-text-primary">Live Dispatch CR-8921</span>
              </div>
              <span className="text-xs font-mono font-bold text-accent bg-accent-tint px-2 py-0.5 rounded">
                ETA {activeTripEta}m
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow-sm">
                MW
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Marcus Webb (Scooter)</h4>
                <p className="text-[11px] text-text-muted">En route: Legal Document Pouch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 21 WOW MOMENT: EMBEDDED REAL INTERACTIVE PHONE DEMO */}
      <section id="demo" className="py-20 bg-surface-elevated/70 border-y border-border px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-accent">
              Live Interactive Prototype
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">
              Try Corridor directly on this page.
            </h2>
            <p className="text-sm text-text-secondary mt-3">
              Click through the embedded phone below. Request a delivery, watch our real-time matching algorithm simulate dispatch, and inspect live GPS telemetry along the route.
            </p>
          </div>

          {/* Interactive Embedded Phone Chassis */}
          <div className="w-full max-w-md">
            <PhoneFrame badge="Live Demo">
              <CustomerApp />
            </PhoneFrame>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3-STEP EDITORIAL SECTION) */}
      <section id="how-it-works" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-accent">
            Seamless Three-Step Flow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">
            Engineered for zero-friction dispatches.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-tint text-accent flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-text-primary">1. Request with Precision</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Describe your parcel, select verified metropolitan hubs or enter a custom address, and instantly receive transparent flat rates.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-tint text-accent flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-text-primary">2. Sub-Minute Driver Match</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our intelligent dispatch broadcasts requests directly to the closest active vehicle, matching riders in an average of 47 seconds.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-tint text-accent flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-text-primary">3. Live Doorstep Telemetry</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Track courier progress with 60fps path interpolation, real-time ETA recalculations, and digital proof-of-delivery photos.
            </p>
          </div>
        </div>
      </section>

      {/* TWO-SIDED MARKETPLACE SPLIT SECTION */}
      <section id="marketplace" className="py-20 bg-surface border-t border-border px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Customers */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">For Businesses & Senders</span>
              <h3 className="font-serif text-2xl font-bold text-primary">Reliable courier logistics at your fingertips.</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Whether you need urgent confidential legal papers delivered or daily commercial inventory transferred across the city, Corridor guarantees end-to-end oversight.
              </p>
              <ul className="text-xs text-text-primary flex flex-col gap-2 mt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Instant booking in under 3 taps</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Direct in-app driver contact</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Digital signature & photo receipt</li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveRole('customer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-fit text-xs font-semibold"
            >
              Open Customer App
            </Button>
          </div>

          {/* For Couriers */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">For Courier Partners</span>
              <h3 className="font-serif text-2xl font-bold text-primary">Drive, ride, and earn with total control.</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Receive high-paying localized dispatch offers, navigate with pre-optimized street routes, and watch your earnings increase instantaneously upon every completed delivery.
              </p>
              <ul className="text-xs text-text-primary flex flex-col gap-2 mt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Single-tap offer acceptance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Instant earnings ticker credited live</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Flexible online/offline schedule toggle</li>
              </ul>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => setActiveRole('driver')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-fit text-xs font-semibold"
            >
              Open Courier App
            </Button>
          </div>
        </div>
      </section>

      {/* METRICS & RELIABILITY BAND */}
      <section id="metrics" className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-r border-border last:border-none">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">128</p>
            <p className="text-xs text-text-muted uppercase tracking-wider mt-1 font-semibold">Active Dispatches</p>
          </div>
          <div className="p-4 border-r border-border last:border-none">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-accent">47s</p>
            <p className="text-xs text-text-muted uppercase tracking-wider mt-1 font-semibold">Avg. Dispatch Speed</p>
          </div>
          <div className="p-4 border-r border-border last:border-none">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-success">96.2%</p>
            <p className="text-xs text-text-muted uppercase tracking-wider mt-1 font-semibold">On-Time Arrival Rate</p>
          </div>
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">342</p>
            <p className="text-xs text-text-muted uppercase tracking-wider mt-1 font-semibold">Vetted Active Couriers</p>
          </div>
        </div>
      </section>

      {/* FOOTER (SECTION 20: INK NAVY CONTRAST) */}
      <footer className="bg-primary text-white py-16 px-6 lg:px-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="font-serif text-2xl font-bold tracking-tight">CORRIDOR</span>
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                The reliable, scalable, real-time operating system for modern courier marketplaces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => setActiveRole('customer')}
                className="font-bold text-xs"
              >
                Launch Live App
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setActiveRole('dashboard')}
                className="text-xs text-white border-slate-600 hover:bg-slate-800"
              >
                Ops Command Center
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 Corridor Logistics Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Courier Agreement</span>
              <span>API Documentation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
