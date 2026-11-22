import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', disabled, loading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-accent text-white hover:bg-brand-accent-dark focus:ring-2 focus:ring-brand-accent-focus',
      secondary: 'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border-hover',
      danger: 'bg-brand-rose text-white hover:bg-rose-700 focus:ring-2 focus:ring-brand-rose/20',
      success: 'bg-brand-emerald text-white hover:bg-emerald-700 focus:ring-2 focus:ring-brand-emerald/20',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-hover focus:ring-2 focus:ring-transparent',
      outline: 'border border-border-hover text-text-primary hover:bg-bg-hover',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
export { Button };
