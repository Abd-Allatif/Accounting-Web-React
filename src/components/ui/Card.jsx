import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-card text-text-primary transition-colors duration-200 hover:border-border-hover',
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

export default Card;
export { Card };
