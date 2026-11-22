import React from 'react';
import { cn } from '../../utils/cn';

const Modal = React.forwardRef(
  ({ isOpen, onClose, title, children, className, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
        <div
          ref={ref}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-lg -translate-x-[50%] -translate-y-[50%] rounded-xl border border-border bg-card backdrop-blur-xl p-6 shadow-2xl text-text-primary',
            className,
          )}
          {...props}
        >
          {title && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            </div>
          )}
          <div className="mb-4">{children}</div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </>
    );
  },
);

Modal.displayName = 'Modal';

import Button from './Button';

export default Modal;
