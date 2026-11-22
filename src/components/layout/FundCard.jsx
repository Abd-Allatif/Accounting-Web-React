import React from 'react';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/helpers';

const FundCard = ({ label, value, variant = 'default' }) => {
  const variants = {
    default: 'bg-bg-card border border-border',
    sells: 'bg-brand-emerald/10 border border-brand-emerald/20',
    perma: 'bg-brand-accent/10 border border-brand-accent/20',
  };

  return (
    <div className={cn('rounded-xl p-4 flex flex-col gap-1', variants[variant])}>
      <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold text-text-primary">{formatCurrency(value)}</div>
    </div>
  );
};

export default FundCard;
export { FundCard };
