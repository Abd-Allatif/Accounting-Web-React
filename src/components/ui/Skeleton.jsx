import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-sm bg-bg-elevated', className)} />
);

export default Skeleton;
export { Skeleton };
