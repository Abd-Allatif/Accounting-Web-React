import React from 'react';
import { cn } from '../../utils/cn';

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label ref={ref} className={cn('block text-sm font-medium text-text-secondary mb-1', className)} {...props}>
    {children}
  </label>
));

Label.displayName = 'Label';

export default Label;
export { Label };
