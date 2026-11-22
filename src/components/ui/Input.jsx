import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'block w-full rounded-sm border border-border bg-bg-input px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:bg-bg-hover transition-colors duration-150',
            error && 'border-brand-rose focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-brand-rose">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
export { Input };
