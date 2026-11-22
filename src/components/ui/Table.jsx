import React from 'react';
import { cn } from '../../utils/cn';

const Table = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={cn('overflow-x-auto', className)} {...props}>
    <table className="min-w-full divide-y divide-border">
      {children}
    </table>
  </div>
));

Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-bg-surface/50', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-border', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('hover:bg-bg-hover transition-colors duration-150', className)} {...props} />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} className={cn('px-4 py-3 text-left text-xs font-semibold text-text-accent uppercase tracking-wider', className)} {...props} />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 text-sm text-text-primary', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
