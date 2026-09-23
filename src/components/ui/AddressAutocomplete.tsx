import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { CANNED_ADDRESSES } from '../../data/mockData';

export interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAddresses = CANNED_ADDRESSES.filter((item) =>
    item.address.toLowerCase().includes((value || '').toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className={`relative flex items-center bg-white border rounded-md transition-all duration-150 ${
        error
          ? 'border-error animate-shake ring-2 ring-error/20'
          : isOpen
          ? 'border-primary ring-2 ring-primary/10 shadow-sm'
          : 'border-border hover:border-border-strong'
      }`}>
        <span className="pl-3.5 text-text-muted shrink-0">
          <MapPin className="w-4 h-4 text-accent" />
        </span>
        <div className="relative w-full py-2 px-3.5">
          <input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={label}
            className="w-full bg-transparent text-sm text-text-primary placeholder-transparent focus:outline-none pt-3 pb-0.5"
          />
          <label
            className={`absolute left-3.5 pointer-events-none transition-all duration-150 origin-left select-none ${
              isOpen || value
                ? 'top-1.5 text-[10px] uppercase tracking-wider font-semibold text-text-secondary'
                : 'top-3.5 text-sm text-text-muted'
            } ${error ? 'text-error font-medium' : ''}`}
          >
            {label}
          </label>
        </div>
      </div>

      {error && (
        <span className="text-xs font-medium text-error px-1 mt-1 block">
          {error}
        </span>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface rounded-lg shadow-lg border border-border py-1 z-30 max-h-48 overflow-y-auto animate-in fade-in duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center justify-between border-b border-border/50">
            <span>Verified Zone Depots</span>
            <span className="text-accent flex items-center gap-1 font-normal"><Navigation className="w-3 h-3"/> Fast Dispatch</span>
          </div>
          {filteredAddresses.length > 0 ? (
            filteredAddresses.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(item.address);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs hover:bg-surface-elevated transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-medium text-text-primary group-hover:text-primary">{item.address}</p>
                  <p className="text-[11px] text-text-muted">{item.zone}</p>
                </div>
                <span className="text-[10px] bg-background text-text-secondary px-2 py-0.5 rounded border border-border group-hover:border-accent group-hover:text-accent">
                  Select
                </span>
              </button>
            ))
          ) : (
            <div className="px-3.5 py-2.5 text-xs text-text-muted">
              No standard hub found. Press enter to use custom address.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
