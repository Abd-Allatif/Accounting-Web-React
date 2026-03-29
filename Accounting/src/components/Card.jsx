import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonCardStyles, scrollbarStyles } from '../styles/SharedStyles';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <CardStyle>
    <div ref={ref} className={classNames("Card", className)} {...props} />
  </CardStyle>
));
Card.displayName = "Card";

const CardStyle = styled.div`
  .Card {
    ${commonCardStyles}
    width: 45vw; height: 65vh; ${scrollbarStyles} overflow-y: auto;
  }
  @media (min-width: 768px) and (max-width: 1024px) { .Card { width: 80vw; height: 55vh; } }
  @media (max-width: 768px) { .Card { margin: 1.3em; width: 75vw; height: 70vh; } }
`;

export default Card;
