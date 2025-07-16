import React from 'react';
import { cn } from '@/lib/utils';

interface BunduiInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  required?: boolean;
}

export const BunduiInput: React.FC<BunduiInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  error = false,
  label,
  required = false
}) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorClasses = error ? 'border-destructive focus-visible:ring-destructive' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(baseClasses, errorClasses, className)}
        disabled={disabled}
        required={required}
      />
      {error && (
        <p className="text-sm text-destructive">
          Este campo es requerido
        </p>
      )}
    </div>
  );
}; 