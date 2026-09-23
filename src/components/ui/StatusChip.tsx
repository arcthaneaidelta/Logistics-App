import React from 'react';

export type StatusType = 'requested' | 'matched' | 'picked_up' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled' | 'online' | 'offline' | 'on_delivery';

interface StatusChipProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'sm',
  pulse = false,
}) => {
  const configMap: Record<StatusType, { text: string; bg: string; textClass: string; dotClass: string }> = {
    requested: {
      text: 'Order Requested',
      bg: 'bg-surface-elevated border-border',
      textClass: 'text-text-secondary',
      dotClass: 'bg-secondary',
    },
    matched: {
      text: 'Driver Matched',
      bg: 'bg-info/10 border-info/30',
      textClass: 'text-info',
      dotClass: 'bg-info',
    },
    picked_up: {
      text: 'Item Picked Up',
      bg: 'bg-accent-subtle border-accent/30',
      textClass: 'text-accent-hover font-semibold',
      dotClass: 'bg-accent',
    },
    in_transit: {
      text: 'In Transit',
      bg: 'bg-accent-tint border-accent/40',
      textClass: 'text-accent-hover font-semibold',
      dotClass: 'bg-accent',
    },
    delivered: {
      text: 'Delivered',
      bg: 'bg-success/10 border-success/30',
      textClass: 'text-success font-semibold',
      dotClass: 'bg-success',
    },
    delayed: {
      text: 'Delayed Traffic',
      bg: 'bg-warning/10 border-warning/30',
      textClass: 'text-warning font-semibold',
      dotClass: 'bg-warning',
    },
    cancelled: {
      text: 'Cancelled',
      bg: 'bg-error/10 border-error/30',
      textClass: 'text-error',
      dotClass: 'bg-error',
    },
    online: {
      text: 'Online & Available',
      bg: 'bg-success/10 border-success/30',
      textClass: 'text-success',
      dotClass: 'bg-success',
    },
    offline: {
      text: 'Offline',
      bg: 'bg-surface-elevated border-border',
      textClass: 'text-text-muted',
      dotClass: 'bg-text-muted',
    },
    on_delivery: {
      text: 'Active Delivery',
      bg: 'bg-accent-tint border-accent/40',
      textClass: 'text-accent',
      dotClass: 'bg-accent',
    },
  };

  const config = configMap[status] || configMap.requested;
  const displayText = label || config.text;

  const sizeClasses = {
    sm: 'text-[11px] py-0.5 px-2.5 gap-1.5',
    md: 'text-xs py-1 px-3 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${config.textClass} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {(pulse || status === 'in_transit' || status === 'online') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`} />
      </span>
      <span>{displayText}</span>
    </span>
  );
};
