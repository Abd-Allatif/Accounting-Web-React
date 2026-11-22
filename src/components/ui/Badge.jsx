import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'border-transparent bg-bg-elevated text-text-primary',
      success: 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20',
      danger: 'bg-brand-rose/10 text-brand-rose border border-brand-rose/20',
      warning: 'bg-brand-amber/10 text-brand-amber border border-brand-amber/20',
      info: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
export { Badge };
