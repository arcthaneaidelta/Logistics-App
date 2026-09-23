import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import type { DemoRole } from '../../store/useLogisticsStore';
import { User, Bike, LayoutDashboard, Compass } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole } = useLogisticsStore();

  const roles: { id: DemoRole; label: string; icon: React.ReactNode }[] = [
    { id: 'marketing', label: 'Landing & Demo', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'customer', label: 'Customer App', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'driver', label: 'Driver App', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Ops Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed top-3 right-3 sm:right-6 z-[100] bg-surface/95 backdrop-blur-md border-2 border-dashed border-border-strong rounded-full p-1 shadow-md flex items-center gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2.5 hidden md:inline select-none">
        Reviewer View:
      </span>
      {roles.map((r) => {
        const isActive = activeRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => setActiveRole(r.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <span>{r.icon}</span>
            <span className="whitespace-nowrap">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
