export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  vehicleType: 'car' | 'van' | 'bike' | 'scooter';
  zone: string;
  status: 'online' | 'on_delivery' | 'offline';
  completedToday: number;
  earningsToday: number;
  initials: string;
  avatarBg: string;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  type: 'business' | 'individual';
  ordersCount: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Order {
  id: string;
  itemDescription: string;
  category: 'document' | 'parcel' | 'fragile' | 'perishable' | 'equipment';
  pickupAddress: string;
  dropoffAddress: string;
  pickupZone: string;
  dropoffZone: string;
  pickupCoords: Coordinates;
  dropoffCoords: Coordinates;
  customerName: string;
  driverId?: string;
  driver?: Driver;
  status: 'requested' | 'matched' | 'picked_up' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  fee: number;
  driverEarnings: number;
  etaMinutes: number;
  createdTime: string;
  deliveredTime?: string;
  proofOfDeliveryPhoto?: string;
  rating?: number;
  feedback?: string;
}

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Marcus Webb',
    rating: 4.9,
    vehicle: 'Honda Activa (Scooter)',
    vehicleType: 'scooter',
    zone: 'Downtown Zone',
    status: 'online',
    completedToday: 14,
    earningsToday: 118.50,
    initials: 'MW',
    avatarBg: '#2E4C6D',
    phone: '+1 (555) 234-8901',
  },
  {
    id: 'drv-2',
    name: 'Priya Nair',
    rating: 4.8,
    vehicle: 'Toyota Hiace Cargo Van',
    vehicleType: 'van',
    zone: 'Riverside Zone',
    status: 'online',
    completedToday: 11,
    earningsToday: 142.20,
    initials: 'PN',
    avatarBg: '#3F6C51',
    phone: '+1 (555) 345-9012',
  },
  {
    id: 'drv-3',
    name: 'Elena Torres',
    rating: 5.0,
    vehicle: 'Specialized Turbo e-Bike',
    vehicleType: 'bike',
    zone: 'Midtown Zone',
    status: 'on_delivery',
    completedToday: 19,
    earningsToday: 168.00,
    initials: 'ET',
    avatarBg: '#7D4F50',
    phone: '+1 (555) 456-0123',
  },
  {
    id: 'drv-4',
    name: 'Jamal Ibrahim',
    rating: 4.7,
    vehicle: 'Ford Transit 250',
    vehicleType: 'van',
    zone: 'Industrial Zone',
    status: 'online',
    completedToday: 8,
    earningsToday: 96.00,
    initials: 'JI',
    avatarBg: '#4A5568',
    phone: '+1 (555) 567-1234',
  },
  {
    id: 'drv-5',
    name: 'Sofia Reyes',
    rating: 4.9,
    vehicle: 'Toyota Prius (Hybrid)',
    vehicleType: 'car',
    zone: 'Uptown Zone',
    status: 'online',
    completedToday: 16,
    earningsToday: 135.40,
    initials: 'SR',
    avatarBg: '#5B4B8A',
    phone: '+1 (555) 678-2345',
  },
];

export const CANNED_ADDRESSES = [
  { address: '742 Evergreen Terrace, Downtown', zone: 'Downtown Zone', coords: { x: 180, y: 150 } },
  { address: '1200 Innovation Way, Tech Park', zone: 'Midtown Zone', coords: { x: 420, y: 220 } },
  { address: '450 Harbor Point Blvd, Riverside', zone: 'Riverside Zone', coords: { x: 620, y: 380 } },
  { address: '88 Logistics Parkway, Gate 4', zone: 'Industrial Zone', coords: { x: 260, y: 460 } },
  { address: '310 Pinecrest Avenue, Suite 500', zone: 'Uptown Zone', coords: { x: 540, y: 110 } },
  { address: '15 Market Square, Central Depot', zone: 'Downtown Zone', coords: { x: 220, y: 280 } },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CR-8921',
    itemDescription: 'Sealed document pouch (Legal deeds)',
    category: 'document',
    pickupAddress: '742 Evergreen Terrace, Downtown',
    dropoffAddress: '1200 Innovation Way, Tech Park',
    pickupZone: 'Downtown Zone',
    dropoffZone: 'Midtown Zone',
    pickupCoords: { x: 180, y: 150 },
    dropoffCoords: { x: 420, y: 220 },
    customerName: 'Whitfield & Co. Law',
    driverId: 'drv-1',
    driver: MOCK_DRIVERS[0],
    status: 'in_transit',
    fee: 14.50,
    driverEarnings: 10.80,
    etaMinutes: 6,
    createdTime: '12 min ago',
  },
  {
    id: 'CR-8919',
    itemDescription: 'Bakery wholesale order — 12 artisan boxes',
    category: 'perishable',
    pickupAddress: '15 Market Square, Central Depot',
    dropoffAddress: '450 Harbor Point Blvd, Riverside',
    pickupZone: 'Downtown Zone',
    dropoffZone: 'Riverside Zone',
    pickupCoords: { x: 220, y: 280 },
    dropoffCoords: { x: 620, y: 380 },
    customerName: 'Green Leaf Bakery',
    driverId: 'drv-3',
    driver: MOCK_DRIVERS[2],
    status: 'picked_up',
    fee: 28.00,
    driverEarnings: 21.00,
    etaMinutes: 14,
    createdTime: '22 min ago',
  },
  {
    id: 'CR-8918',
    itemDescription: '3 boxes — high-priority office supplies',
    category: 'parcel',
    pickupAddress: '310 Pinecrest Avenue, Suite 500',
    dropoffAddress: '1200 Innovation Way, Tech Park',
    pickupZone: 'Uptown Zone',
    dropoffZone: 'Midtown Zone',
    pickupCoords: { x: 540, y: 110 },
    dropoffCoords: { x: 420, y: 220 },
    customerName: 'Tomasz Nowak',
    driverId: 'drv-5',
    driver: MOCK_DRIVERS[4],
    status: 'delivered',
    fee: 19.50,
    driverEarnings: 14.20,
    etaMinutes: 0,
    createdTime: '45 min ago',
    deliveredTime: '8 min ago',
    rating: 5,
    feedback: 'Prompt and very polite delivery.',
  },
  {
    id: 'CR-8915',
    itemDescription: 'Heavy-duty hydraulic valve component',
    category: 'equipment',
    pickupAddress: '88 Logistics Parkway, Gate 4',
    dropoffAddress: '450 Harbor Point Blvd, Riverside',
    pickupZone: 'Industrial Zone',
    dropoffZone: 'Riverside Zone',
    pickupCoords: { x: 260, y: 460 },
    dropoffCoords: { x: 620, y: 380 },
    customerName: 'Dana Achebe Engineering',
    driverId: 'drv-2',
    driver: MOCK_DRIVERS[1],
    status: 'delayed',
    fee: 34.00,
    driverEarnings: 25.50,
    etaMinutes: 24,
    createdTime: '1 hr ago',
  },
  {
    id: 'CR-8912',
    itemDescription: 'Electronics prototype batch (Confidential)',
    category: 'fragile',
    pickupAddress: '1200 Innovation Way, Tech Park',
    dropoffAddress: '310 Pinecrest Avenue, Suite 500',
    pickupZone: 'Midtown Zone',
    dropoffZone: 'Uptown Zone',
    pickupCoords: { x: 420, y: 220 },
    dropoffCoords: { x: 540, y: 110 },
    customerName: 'Ravi Kapoor',
    driverId: 'drv-4',
    driver: MOCK_DRIVERS[3],
    status: 'delivered',
    fee: 22.00,
    driverEarnings: 16.50,
    etaMinutes: 0,
    createdTime: '2 hrs ago',
    deliveredTime: '1 hr ago',
    rating: 5,
  },
];

export const INITIAL_KPIS = {
  activeDeliveries: 128,
  avgMatchTimeSec: 47,
  onTimeRatePercent: 96.2,
  activeDrivers: 342,
  completedTodayCount: 1420,
};

export const ANALYTICS_TREND_DATA = [
  { time: '08:00', deliveries: 42, onTime: 97.4, activeCouriers: 190 },
  { time: '10:00', deliveries: 88, onTime: 96.8, activeCouriers: 240 },
  { time: '12:00', deliveries: 145, onTime: 95.9, activeCouriers: 320 },
  { time: '14:00', deliveries: 130, onTime: 96.5, activeCouriers: 310 },
  { time: '16:00', deliveries: 162, onTime: 96.1, activeCouriers: 342 },
  { time: '18:00', deliveries: 118, onTime: 97.0, activeCouriers: 280 },
  { time: '20:00', deliveries: 65, onTime: 98.2, activeCouriers: 185 },
];
