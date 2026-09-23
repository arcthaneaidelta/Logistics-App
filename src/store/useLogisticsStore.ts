import { create } from 'zustand';
import type { Driver, Order } from '../data/mockData';
import { MOCK_DRIVERS, INITIAL_ORDERS, INITIAL_KPIS } from '../data/mockData';

export type DemoRole = 'marketing' | 'customer' | 'driver' | 'dashboard';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface LogisticsState {
  // Current Active Role
  activeRole: DemoRole;
  setActiveRole: (role: DemoRole) => void;

  // Active Order & Trip Simulation
  orders: Order[];
  activeTrip: Order | null;
  activeTripProgress: number; // 0 to 100
  activeTripEta: number; // in minutes
  currentVehicleCoord: { x: number; y: number };

  // Driver View State
  currentDriver: Driver;
  isDriverOnline: boolean;
  incomingOffer: Order | null;
  driverStep: 'none' | 'accepted' | 'picked_up' | 'delivered';
  floatingEarningsDelta: number | null;

  // Demo Controls & Edge Cases
  speedMultiplier: number;
  simulateNoDriversError: boolean;
  simulateDelayError: boolean;
  setSpeedMultiplier: (multiplier: number) => void;
  toggleSimulateNoDriversError: () => void;
  toggleSimulateDelayError: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // KPIs
  kpis: typeof INITIAL_KPIS;

  // Actions
  createOrder: (item: string, pickup: string, dropoff: string) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  cancelActiveOrder: () => void;
  acceptJobOffer: () => void;
  declineJobOffer: () => void;
  advanceDriverStep: (step: 'picked_up' | 'delivered') => void;
  rateDeliveredOrder: (orderId: string, rating: number, feedback?: string) => void;
  toggleDriverOnline: () => void;
  selectOrderForDetail: (orderId: string | null) => void;
  selectedDetailOrderId: string | null;
  updateTripProgress: (progress: number, eta: number, coords: { x: number; y: number }) => void;
  resetDemoData: () => void;
}

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  activeRole: 'marketing',
  setActiveRole: (role) => set({ activeRole: role }),

  orders: INITIAL_ORDERS,
  activeTrip: INITIAL_ORDERS[0], // Pre-loaded with CR-8921 for instant interactive tracking
  activeTripProgress: 35,
  activeTripEta: 6,
  currentVehicleCoord: { x: 264, y: 174 },

  currentDriver: { ...MOCK_DRIVERS[0] },
  isDriverOnline: true,
  incomingOffer: null,
  driverStep: 'accepted',
  floatingEarningsDelta: null,

  speedMultiplier: 1.5,
  simulateNoDriversError: false,
  simulateDelayError: false,

  setSpeedMultiplier: (multiplier) => set({ speedMultiplier: multiplier }),
  toggleSimulateNoDriversError: () => set((state) => ({ simulateNoDriversError: !state.simulateNoDriversError })),
  toggleSimulateDelayError: () => {
    set((state) => {
      const nextDelay = !state.simulateDelayError;
      if (state.activeTrip) {
        return {
          simulateDelayError: nextDelay,
          activeTrip: {
            ...state.activeTrip,
            status: nextDelay ? 'delayed' : 'in_transit',
            etaMinutes: nextDelay ? 14 : 6,
          },
        };
      }
      return { simulateDelayError: nextDelay };
    });
  },

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  kpis: INITIAL_KPIS,
  selectedDetailOrderId: null,
  selectOrderForDetail: (orderId) => set({ selectedDetailOrderId: orderId }),

  updateTripProgress: (progress, eta, coords) => {
    set((state) => {
      if (!state.activeTrip) return {};
      const newStatus = progress >= 100 
        ? 'delivered' 
        : progress >= 40 
          ? 'in_transit' 
          : 'picked_up';

      return {
        activeTripProgress: progress,
        activeTripEta: eta,
        currentVehicleCoord: coords,
        activeTrip: {
          ...state.activeTrip,
          status: state.simulateDelayError ? 'delayed' : newStatus,
          etaMinutes: eta,
        },
      };
    });
  },

  createOrder: async (item, pickup, dropoff) => {
    const { simulateNoDriversError, addToast } = get();

    // Fake simulated search latency (1200ms)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    if (simulateNoDriversError) {
      addToast({
        type: 'warning',
        title: 'Dispatch Alert',
        message: 'No active couriers available in your selected zone.',
      });
      return { success: false, error: 'No drivers available nearby right now.' };
    }

    const assignedDriver = MOCK_DRIVERS[0]; // Marcus Webb
    const newOrderId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      itemDescription: item,
      category: 'parcel',
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      pickupZone: 'Downtown Zone',
      dropoffZone: 'Midtown Zone',
      pickupCoords: { x: 180, y: 150 },
      dropoffCoords: { x: 420, y: 220 },
      customerName: 'You (Demo User)',
      driverId: assignedDriver.id,
      driver: assignedDriver,
      status: 'matched',
      fee: 16.50,
      driverEarnings: 12.40,
      etaMinutes: 8,
      createdTime: 'Just now',
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      activeTrip: newOrder,
      activeTripProgress: 0,
      activeTripEta: 8,
      currentVehicleCoord: { x: 180, y: 150 },
      incomingOffer: newOrder,
      driverStep: 'none',
      kpis: {
        ...state.kpis,
        activeDeliveries: state.kpis.activeDeliveries + 1,
      },
    }));

    addToast({
      type: 'success',
      title: 'Courier Matched!',
      message: `${assignedDriver.name} (${assignedDriver.rating}★) accepted your request.`,
    });

    return { success: true, orderId: newOrderId };
  },

  cancelActiveOrder: () => {
    set((state) => {
      if (!state.activeTrip) return {};
      const updated = state.orders.map((o) =>
        o.id === state.activeTrip?.id ? { ...o, status: 'cancelled' as const } : o
      );
      return {
        orders: updated,
        activeTrip: null,
        incomingOffer: null,
        driverStep: 'none',
      };
    });
    get().addToast({
      type: 'info',
      title: 'Order Cancelled',
      message: 'Your delivery request has been removed.',
    });
  },

  acceptJobOffer: () => {
    const { incomingOffer, addToast } = get();
    if (!incomingOffer) return;

    set((state) => ({
      incomingOffer: null,
      driverStep: 'accepted',
      activeTrip: {
        ...incomingOffer,
        status: 'matched',
      },
    }));

    addToast({
      type: 'success',
      title: 'Job Accepted!',
      message: `En route to pickup at ${incomingOffer.pickupAddress.split(',')[0]}`,
    });
  },

  declineJobOffer: () => {
    set({ incomingOffer: null });
    get().addToast({
      type: 'warning',
      title: 'Offer Declined',
      message: 'Job re-routed to the next nearest courier.',
    });
  },

  advanceDriverStep: (nextStep) => {
    const { activeTrip, currentDriver, addToast } = get();
    if (!activeTrip) return;

    if (nextStep === 'picked_up') {
      set((state) => ({
        driverStep: 'picked_up',
        activeTrip: state.activeTrip ? { ...state.activeTrip, status: 'in_transit' } : null,
      }));
      addToast({
        type: 'info',
        title: 'Pickup Confirmed',
        message: 'Item secured. Heading towards delivery destination.',
      });
    } else if (nextStep === 'delivered') {
      const earned = activeTrip.driverEarnings || 11.20;
      set((state) => ({
        driverStep: 'delivered',
        floatingEarningsDelta: earned,
        currentDriver: {
          ...state.currentDriver,
          completedToday: state.currentDriver.completedToday + 1,
          earningsToday: Number((state.currentDriver.earningsToday + earned).toFixed(2)),
        },
        activeTrip: state.activeTrip ? {
          ...state.activeTrip,
          status: 'delivered',
          deliveredTime: 'Just now',
          etaMinutes: 0,
        } : null,
        kpis: {
          ...state.kpis,
          activeDeliveries: Math.max(0, state.kpis.activeDeliveries - 1),
          completedTodayCount: state.kpis.completedTodayCount + 1,
        },
      }));

      addToast({
        type: 'success',
        title: 'Delivery Completed!',
        message: `+$${earned.toFixed(2)} credited to your courier balance.`,
      });

      setTimeout(() => {
        set({ floatingEarningsDelta: null });
      }, 2500);
    }
  },

  rateDeliveredOrder: (orderId, rating, feedback) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, rating, feedback } : o
      ),
      activeTrip: state.activeTrip?.id === orderId ? { ...state.activeTrip, rating, feedback } : state.activeTrip,
    }));
    get().addToast({
      type: 'success',
      title: 'Rating Submitted',
      message: 'Thank you for keeping our delivery network reliable.',
    });
  },

  toggleDriverOnline: () => {
    set((state) => {
      const nextOnline = !state.isDriverOnline;
      return {
        isDriverOnline: nextOnline,
        currentDriver: {
          ...state.currentDriver,
          status: nextOnline ? 'online' : 'offline',
        },
      };
    });
  },

  resetDemoData: () => {
    set({
      orders: INITIAL_ORDERS,
      activeTrip: INITIAL_ORDERS[0],
      activeTripProgress: 35,
      activeTripEta: 6,
      currentVehicleCoord: { x: 264, y: 174 },
      currentDriver: { ...MOCK_DRIVERS[0] },
      isDriverOnline: true,
      incomingOffer: null,
      driverStep: 'accepted',
      floatingEarningsDelta: null,
      kpis: INITIAL_KPIS,
      selectedDetailOrderId: null,
      simulateNoDriversError: false,
      simulateDelayError: false,
    });
    get().addToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'All mock orders, drivers, and KPIs returned to baseline.',
    });
  },
}));
