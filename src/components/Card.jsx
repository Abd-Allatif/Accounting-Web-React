import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonCardStyles, scrollbarStyles } from '../styles/SharedStyles';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <CardStyle>
    <div ref={ref} className={classNames('Card', className)} {...props} />
  </CardStyle>
));
Card.displayName = 'Card';

const CardStyle = styled.div`
  .Card {
    ${commonCardStyles}
    width: 48vw;
    height: 65vh;
    ${scrollbarStyles}
    overflow-y: auto;
    position: relative;
    animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;

    &:hover {
      border-color: var(--border-hover, rgba(99, 102, 241, 0.35));
      box-shadow: var(--shadow-card), var(--shadow-glow, 0 0 30px rgba(99,102,241,0.2));
    }
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .Card { width: 80vw; height: 55vh; }
  }
  @media (max-width: 768px) {
    .Card { margin: 1rem; width: 88vw; height: auto; min-height: 60vh; border-radius: var(--radius-lg, 20px); }
  }
`;

export default Card;
