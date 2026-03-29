import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { scrollbarStyles } from '../styles/SharedStyles';

const BackGround = React.forwardRef(({ className, ...props }, ref) => (
  <BackGroundStyle>
    <div ref={ref} className={classNames("BackGround", className)} {...props} />
  </BackGroundStyle>
));
BackGround.displayName = "BackGround";

const BackGroundStyle = styled.div`
  .BackGround {
    display: flex; align-items: center; justify-content: center;
    width: 100dvw; height: 100dvh; --s: 37px; overflow-y: auto;
    --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
    --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
    --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
    --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
    background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
      var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
      var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
    background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
    ${scrollbarStyles}
  }
`;

export default BackGround;
