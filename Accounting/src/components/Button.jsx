import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonButtonStyles } from '../styles/SharedStyles';

const Button = React.forwardRef(({ className, children, ...props }, ref) => (
  <ButtonStyle>
    <button ref={ref} className={classNames('Button', className)} {...props}>
      {children}
    </button>
  </ButtonStyle>
));
Button.displayName = 'Button';

const ButtonStyle = styled.div`
  display: inline-flex;
  .Button {
    ${commonButtonStyles}
    margin-right: 0.4em;
  }

  /* Danger variant */
  .Button.danger {
    background: linear-gradient(135deg, #f43f5e, #e11d48);
    &:hover { box-shadow: 0 4px 20px rgba(244, 63, 94, 0.4); }
  }

  /* Ghost variant */
  .Button.ghost {
    background: transparent;
    border-color: var(--border-hover, rgba(99,102,241,0.35));
    color: var(--text-accent, #818cf8);
    &:hover {
      background: rgba(99,102,241,0.1);
      box-shadow: none;
      border-color: var(--accent, #6366f1);
    }
  }

  /* Success variant */
  .Button.success {
    background: linear-gradient(135deg, #10b981, #059669);
    &:hover { box-shadow: 0 4px 20px rgba(16,185,129,0.35); }
  }
`;

export default Button;
