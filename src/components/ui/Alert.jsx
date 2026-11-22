import React from 'react';
import { cn } from '../../utils/cn';

const Alert = React.forwardRef(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const variants = {
      info: 'bg-bg-card border border-brand-cyan/30 text-text-primary',
      success: 'bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald',
      warning: 'bg-brand-amber/10 border border-brand-amber/30 text-brand-amber',
      error: 'bg-brand-rose/10 border border-brand-rose/30 text-brand-rose',
    };

    return (
      <div ref={ref} role="alert" className={cn('rounded-lg border p-4', variants[variant], className)} {...props}>
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        {children && <p className="text-sm">{children}</p>}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
export { Alert };
