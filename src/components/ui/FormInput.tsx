import React, { useState } from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasValue = Boolean(value || (props.defaultValue && props.defaultValue !== ''));

  return (
    <div className={`relative flex flex-col gap-1 w-full ${className}`}>
      <div className={`relative flex items-center bg-white border rounded-md transition-all duration-150 ${
        error
          ? 'border-error animate-shake ring-2 ring-error/20'
          : isFocused
          ? 'border-primary ring-2 ring-primary/10 shadow-sm'
          : 'border-border hover:border-border-strong'
      }`}>
        {icon && (
          <span className="pl-3.5 text-text-muted shrink-0 flex items-center">
            {icon}
          </span>
        )}
        <div className="relative w-full py-2 px-3.5">
          <input
            id={inputId}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className="w-full bg-transparent text-sm text-text-primary placeholder-transparent focus:outline-none pt-3 pb-0.5"
            placeholder={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={`absolute left-3.5 pointer-events-none transition-all duration-150 origin-left select-none ${
              isFocused || hasValue
                ? 'top-1.5 text-[10px] uppercase tracking-wider font-semibold text-text-secondary'
                : 'top-3.5 text-sm text-text-muted'
            } ${error ? 'text-error font-medium' : ''}`}
          >
            {label}
          </label>
        </div>
      </div>
      {error ? (
        <span id={`${inputId}-error`} className="text-xs font-medium text-error px-1 flex items-center gap-1">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-desc`} className="text-xs text-text-muted px-1">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
