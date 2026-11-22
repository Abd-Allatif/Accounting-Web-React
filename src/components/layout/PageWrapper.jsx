import React from 'react';
import { cn } from '../../utils/cn';

const PageWrapper = ({ children, className }) => (
  <div className={cn('min-h-screen pt-16 pb-8 px-4', className)}>
    {children}
  </div>
);

export default PageWrapper;
export { PageWrapper };
