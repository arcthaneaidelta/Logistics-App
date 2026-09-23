import React, { useEffect, useRef } from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { MapPin, Navigation } from 'lucide-react';

interface StylizedMapProps {
  className?: string;
  showMultiVehicles?: boolean;
  interactive?: boolean;
}

export const StylizedMap: React.FC<StylizedMapProps> = ({
  className = '',
  showMultiVehicles = false,
}) => {
  const {
    activeTrip,
    activeTripProgress,
    activeTripEta,
    currentVehicleCoord,
    updateTripProgress,
    speedMultiplier,
    simulateDelayError,
  } = useLogisticsStore();

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Fixed demo delivery route coordinates
  const routePoints = [
    { x: 180, y: 150 }, // Pickup: Downtown 742 Evergreen
    { x: 230, y: 150 },
    { x: 230, y: 200 },
    { x: 310, y: 200 },
    { x: 310, y: 220 },
    { x: 420, y: 220 }, // Dropoff: Tech Park 1200 Innovation
  ];

  // Calculate position along multi-segment path
  const getPointAtProgress = (progressPercent: number) => {
    const totalSegments = routePoints.length - 1;
    const progressClamped = Math.max(0, Math.min(100, progressPercent));
    const exactIndex = (progressClamped / 100) * totalSegments;
    const segIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
    const segT = exactIndex - segIndex;

    const pA = routePoints[segIndex];
    const pB = routePoints[segIndex + 1];

    return {
      x: pA.x + (pB.x - pA.x) * segT,
      y: pA.y + (pB.y - pA.y) * segT,
    };
  };

  // Continuous RAF loop for smooth live tracking
  useEffect(() => {
    const step = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Base trip takes ~40s, multiplied by user demo speed
      const progressDelta = (100 / 40) * delta * speedMultiplier;
      let nextProgress = activeTripProgress + progressDelta;

      if (nextProgress >= 100) {
        nextProgress = 0; // Seamless loop for persistent reviewer wow
      }

      const nextEta = Math.max(1, Math.round((1 - nextProgress / 100) * 8));
      const nextCoord = getPointAtProgress(nextProgress);

      updateTripProgress(nextProgress, nextEta, nextCoord);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeTripProgress, speedMultiplier]);

  // Secondary ambient fleet couriers for Ops view
  const ambientCouriers = [
    { id: 'c1', x: 580, y: 340, angle: 45, label: 'Priya (Van)' },
    { id: 'c2', x: 290, y: 440, angle: 120, label: 'Jamal (Van)' },
    { id: 'c3', x: 500, y: 130, angle: -30, label: 'Sofia (Car)' },
    { id: 'c4', x: 190, y: 310, angle: 90, label: 'Elena (e-Bike)' },
    { id: 'c5', x: 640, y: 180, angle: 210, label: 'Fleet #18' },
    { id: 'c6', x: 360, y: 350, angle: 15, label: 'Fleet #22' },
  ];

  return (
    <div className={`relative w-full h-full bg-[#EAE6DE] overflow-hidden select-none ${className}`}>
      {/* Stylized Vector Street Map Canvas */}
      <svg
        viewBox="0 0 700 500"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#DCD7CD" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Base Map Tone */}
        <rect width="100%" height="100%" fill="#FAF8F5" />
        <rect width="100%" height="100%" fill="url(#streetGrid)" opacity="0.6" />

        {/* Water River feature */}
        <path
          d="M 610 0 C 580 120, 670 250, 630 500"
          fill="none"
          stroke="#D3E0EA"
          strokeWidth="32"
          strokeLinecap="round"
        />

        {/* Parks / Greenery */}
        <rect x="30" y="40" width="80" height="90" rx="8" fill="#E4ECE4" />
        <rect x="480" y="270" width="90" height="70" rx="6" fill="#E4ECE4" />

        {/* Major Arterial Roads */}
        <path d="M 0 150 L 700 150" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M 0 150 L 700 150" stroke="#D0CBC0" strokeWidth="1" strokeDasharray="6 6" />

        <path d="M 0 300 L 700 300" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M 230 0 L 230 500" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M 450 0 L 450 500" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M 330 80 L 330 450" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M 0 450 L 700 450" stroke="#FFFFFF" strokeWidth="9" />

        {/* Secondary Cross-Streets */}
        <path d="M 120 40 L 120 480" stroke="#F0EDE6" strokeWidth="5" />
        <path d="M 540 20 L 540 460" stroke="#F0EDE6" strokeWidth="5" />
        <path d="M 40 220 L 680 220" stroke="#F0EDE6" strokeWidth="5" />
        <path d="M 80 80 L 650 80" stroke="#F0EDE6" strokeWidth="4" />

        {/* City Zone Labels */}
        <text x="50" y="65" fill="#8B909B" fontSize="10" fontWeight="600" letterSpacing="1">DOWNTOWN HUB</text>
        <text x="350" y="100" fill="#8B909B" fontSize="10" fontWeight="600" letterSpacing="1">MIDTOWN DISTRICT</text>
        <text x="490" y="420" fill="#8B909B" fontSize="10" fontWeight="600" letterSpacing="1">RIVERSIDE COMMERCE</text>
        <text x="70" y="420" fill="#8B909B" fontSize="10" fontWeight="600" letterSpacing="1">INDUSTRIAL GATE</text>

        {/* Active Delivery Route Polyline */}
        <polyline
          points={routePoints.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#D97B3D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          className="opacity-40"
        />

        {/* Traveled Route Line (Solid Amber) */}
        <polyline
          points={`${routePoints[0].x},${routePoints[0].y} ${currentVehicleCoord.x},${currentVehicleCoord.y}`}
          fill="none"
          stroke="#D97B3D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pickup Pin */}
        <g transform={`translate(${routePoints[0].x}, ${routePoints[0].y})`}>
          <circle r="6" fill="#14213D" />
          <circle r="3" fill="#FFFFFF" />
          <text x="-25" y="-12" fill="#14213D" fontSize="9" fontWeight="700">PICKUP</text>
        </g>

        {/* Dropoff Pin */}
        <g transform={`translate(${routePoints[routePoints.length - 1].x}, ${routePoints[routePoints.length - 1].y})`}>
          <circle r="7" fill="#2E7D5B" />
          <circle r="3.5" fill="#FFFFFF" />
          <text x="-28" y="-12" fill="#2E7D5B" fontSize="9" fontWeight="700">DROPOFF</text>
        </g>

        {/* Ambient Fleet Vehicles (Ops Dashboard multi-marker mode) */}
        {showMultiVehicles &&
          ambientCouriers.map((courier) => (
            <g key={courier.id} transform={`translate(${courier.x}, ${courier.y})`}>
              <circle r="12" fill="#14213D" opacity="0.1" />
              <circle r="5" fill="#14213D" />
              <circle r="2" fill="#FFFFFF" />
              <text x="8" y="3" fill="#171A1F" fontSize="8" fontWeight="600">
                {courier.label}
              </text>
            </g>
          ))}

        {/* Active Primary Vehicle Courier */}
        <g transform={`translate(${currentVehicleCoord.x}, ${currentVehicleCoord.y})`}>
          {/* Pulsing attention ring */}
          <circle r="16" fill="#D97B3D" className="animate-pulse-ring" />
          {/* Main courier vehicle dot */}
          <circle r="8" fill="#D97B3D" stroke="#FFFFFF" strokeWidth="2" />
          <circle r="3" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Floating Status Badge on Map */}
      <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-border flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span className="text-xs font-semibold text-text-primary">
          {simulateDelayError
            ? 'Traffic Delay (+6m)'
            : activeTripProgress >= 100
            ? 'Delivered'
            : activeTripProgress >= 40
            ? 'En route to customer'
            : 'Heading to pickup'}
        </span>
        <span className="text-[11px] font-mono text-text-secondary bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
          ETA {activeTripEta}m
        </span>
      </div>

      {/* Speed & Live Telemetry pill */}
      <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-text-secondary border border-border flex items-center gap-1.5 shadow-sm">
        <Navigation className="w-3 h-3 text-accent" />
        <span>GPS Live 60fps</span>
        <span>•</span>
        <span>Sim {speedMultiplier}x</span>
      </div>
    </div>
  );
};
