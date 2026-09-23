import React, { useState } from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { StylizedMap } from '../../components/map/StylizedMap';
import { StatusChip, type StatusType } from '../../components/ui/StatusChip';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { MOCK_DRIVERS, ANALYTICS_TREND_DATA } from '../../data/mockData';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Bell
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export const OpsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'drivers' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    orders,
    kpis,
    activeTrip,
  } = useLogisticsStore();

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Filtered orders for table
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-background text-text-primary flex font-sans select-none">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="flex flex-col">
          {/* Brand Wordmark */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="font-serif text-xl font-bold tracking-tight text-primary">CORRIDOR</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-primary text-white px-2 py-0.5 rounded font-bold">
              OPS HQ
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-surface-elevated text-primary border-l-4 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-accent" />
              <span>Network Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-surface-elevated text-primary border-l-4 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-accent" />
                <span>Active Dispatches</span>
              </div>
              <span className="text-[10px] font-mono bg-border px-1.5 py-0.5 rounded text-text-secondary font-bold">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-surface-elevated text-primary border-l-4 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <Users className="w-4 h-4 text-accent" />
              <span>Courier Fleet</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-surface-elevated text-primary border-l-4 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-accent" />
              <span>Performance Trends</span>
            </button>
          </nav>
        </div>

        {/* Live System Status card in sidebar */}
        <div className="p-4 border-t border-border bg-surface-elevated/50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            <span className="text-xs font-bold text-text-primary">Dispatch Engine 100% OK</span>
          </div>
          <p className="text-[11px] text-text-muted leading-tight">
            Routing latencies under 47ms across 5 metropolitan zones.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-4 md:px-8 border-b border-border bg-surface flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Pills */}
            <div className="flex md:hidden gap-1">
              {(['overview', 'orders', 'drivers', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-bold capitalize px-2 py-1 rounded cursor-pointer ${
                    activeTab === tab ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Live Metropolitan Hub • North Region</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders, clients, couriers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-64 bg-background text-xs py-1.5 pl-8 pr-3 rounded-md border border-border focus:outline-none focus:border-primary"
              />
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            </div>
            <button
              className="p-2 text-text-secondary hover:text-text-primary rounded-md border border-border bg-surface-elevated relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-accent absolute top-1.5 right-1.5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-text-muted text-xs font-semibold uppercase tracking-wider">
                    <span>Active Deliveries</span>
                    <Package className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl lg:text-3xl font-extrabold font-mono text-text-primary">
                      {kpis.activeDeliveries}
                    </span>
                    <span className="text-xs font-semibold text-success flex items-center">
                      <ArrowUpRight className="w-3 h-3" /> +4.2%
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted mt-1 block">18 in final doorstep leg</span>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-text-muted text-xs font-semibold uppercase tracking-wider">
                    <span>Avg. Match Time</span>
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl lg:text-3xl font-extrabold font-mono text-text-primary">
                      {kpis.avgMatchTimeSec}s
                    </span>
                    <span className="text-xs font-semibold text-success flex items-center">
                      <ArrowUpRight className="w-3 h-3" /> -12% faster
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted mt-1 block">99.1% sub-60s matching</span>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-text-muted text-xs font-semibold uppercase tracking-wider">
                    <span>On-Time Rate</span>
                    <ShieldCheck className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl lg:text-3xl font-extrabold font-mono text-text-primary">
                      {kpis.onTimeRatePercent}%
                    </span>
                    <span className="text-xs font-semibold text-success flex items-center">
                      <ArrowUpRight className="w-3 h-3" /> +0.8%
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted mt-1 block">Benchmark target: 95.0%</span>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-text-muted text-xs font-semibold uppercase tracking-wider">
                    <span>Active Fleet</span>
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl lg:text-3xl font-extrabold font-mono text-text-primary">
                      {kpis.activeDrivers}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary">
                      5 Hub Zones
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted mt-1 block">82% couriers on active jobs</span>
                </div>
              </div>

              {/* Large Multi-Courier Live Vector Map Panel */}
              <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                    <h3 className="text-sm font-bold text-text-primary">Metropolitan Courier Telemetry</h3>
                    <span className="text-xs text-text-muted hidden sm:inline">• Live 8–12 active fleet positions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-surface px-2.5 py-1 rounded border border-border text-text-secondary">
                      Zone: North Metropole
                    </span>
                  </div>
                </div>

                <div className="h-[380px] w-full relative">
                  <StylizedMap showMultiVehicles />
                </div>
              </div>

              {/* Attention Needed List */}
              <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-bold text-text-primary">Attention Needed (Exceptions & Delays)</h3>
                  </div>
                  <span className="text-xs text-text-muted font-mono">1 Item Requiring Review</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    onClick={() => {
                      setSelectedOrderId('CR-8915');
                      setActiveTab('orders');
                    }}
                    className="p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center justify-between cursor-pointer hover:bg-warning/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-text-primary">CR-8915</span>
                          <span className="text-xs font-semibold text-text-primary">Dana Achebe Engineering</span>
                          <span className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded font-bold">
                            Delay: Industrial Zone Congestion
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Assigned to Priya Nair (Toyota Hiace Van) • Estimated delivery pushed by 12 mins.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-accent flex items-center gap-1">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS TABLE & DRAWER */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-border">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  {(['all', 'in_transit', 'picked_up', 'matched', 'delivered', 'delayed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer border ${
                        statusFilter === st
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-text-muted">
                  Showing {filteredOrders.length} dispatches
                </span>
              </div>

              {/* Orders Data Table */}
              <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-elevated text-text-muted uppercase tracking-wider font-semibold border-b border-border">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Item & Destination</th>
                        <th className="py-3 px-4">Courier</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Fee</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className="hover:bg-surface-elevated/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-text-primary group-hover:text-accent">
                            {order.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-text-primary">
                            {order.customerName}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-text-primary max-w-xs truncate">
                              {order.itemDescription}
                            </p>
                            <p className="text-[11px] text-text-muted truncate max-w-xs">
                              {order.dropoffAddress}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {order.driver?.name || 'Searching...'}
                          </td>
                          <td className="py-3 px-4">
                            <StatusChip status={order.status} />
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-text-primary text-right">
                            ${order.fee.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-xs font-semibold text-accent group-hover:underline">
                              View →
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET ROSTER */}
          {activeTab === 'drivers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
              {MOCK_DRIVERS.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-sm"
                        style={{ backgroundColor: driver.avatarBg }}
                      >
                        {driver.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">{driver.name}</h4>
                        <p className="text-xs text-text-secondary">{driver.vehicle}</p>
                      </div>
                    </div>
                    <StatusChip status={driver.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-surface-elevated p-2.5 rounded-lg border border-border text-center text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-text-muted block">Rating</span>
                      <span className="font-bold text-accent font-mono">★ {driver.rating}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-muted block">Trips Today</span>
                      <span className="font-bold text-text-primary font-mono">{driver.completedToday}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-muted block">Zone Hub</span>
                      <span className="font-bold text-text-primary truncate block text-[11px]">{driver.zone.replace(' Zone', '')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border/60">
                    <span className="font-mono">{driver.phone}</span>
                    <span className="text-success font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Background Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150">
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Metropolitan Hourly Dispatch Throughput</h3>
                    <p className="text-xs text-text-secondary">Orders delivered vs active couriers over the past 12 hours</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-accent-tint text-accent px-2.5 py-1 rounded">
                    Peak: 16:00 (162 orders/hr)
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D97B3D" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#D97B3D" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DA" />
                      <XAxis dataKey="time" stroke="#8B909B" fontSize={11} />
                      <YAxis stroke="#8B909B" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E2DA', borderRadius: '8px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="deliveries" stroke="#D97B3D" strokeWidth={2.5} fillOpacity={1} fill="url(#deliveryGradient)" name="Deliveries Completed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETAIL DRAWER FOR ORDERS */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="absolute inset-0 bg-primary cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-surface h-full shadow-lg border-l border-border p-6 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-accent-tint text-accent font-bold px-2 py-0.5 rounded">
                      Dispatch Dossier
                    </span>
                    <h3 className="text-lg font-bold font-mono text-text-primary mt-1">
                      {selectedOrder.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-md cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status and Fee Banner */}
                <div className="bg-surface-elevated p-3.5 rounded-xl border border-border flex items-center justify-between">
                  <StatusChip status={selectedOrder.status} size="md" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-text-muted block">Total Fare</span>
                    <span className="text-base font-bold font-mono text-text-primary">
                      ${selectedOrder.fee.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Item & Addresses */}
                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <span className="text-text-muted uppercase text-[10px] font-bold tracking-wider">
                      Item Description
                    </span>
                    <p className="font-semibold text-text-primary text-sm mt-0.5">
                      {selectedOrder.itemDescription}
                    </p>
                  </div>

                  <div className="border-t border-border pt-2 flex flex-col gap-2">
                    <div>
                      <span className="text-text-muted text-[11px] block">Pickup Location</span>
                      <p className="font-medium text-text-primary">{selectedOrder.pickupAddress}</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] block">Dropoff Destination</span>
                      <p className="font-medium text-text-primary">{selectedOrder.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Courier assigned */}
                <div className="bg-surface border border-border rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-xs"
                      style={{ backgroundColor: selectedOrder.driver?.avatarBg || '#2E4C6D' }}
                    >
                      {selectedOrder.driver?.initials || 'MW'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">
                        {selectedOrder.driver?.name || 'Unassigned'}
                      </h4>
                      <p className="text-[10px] text-text-muted">
                        {selectedOrder.driver?.vehicle || 'Dispatched Courier'}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.driver && (
                    <span className="text-xs font-mono font-bold text-accent">
                      ★ {selectedOrder.driver.rating}
                    </span>
                  )}
                </div>

                {/* Rating & Review (if delivered) */}
                {selectedOrder.rating && (
                  <div className="bg-success/10 border border-success/30 rounded-xl p-3 text-xs flex flex-col gap-1">
                    <span className="font-bold text-success">Customer Review</span>
                    <RatingStars value={selectedOrder.rating} size="sm" />
                    {selectedOrder.feedback && (
                      <p className="text-text-secondary italic mt-1">"{selectedOrder.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSelectedOrderId(null)}
                  className="w-full text-xs font-semibold"
                >
                  Close Dossier
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
