import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { scrollbarStyles } from '../styles/SharedStyles';

const BackGround = React.forwardRef(({ className, ...props }, ref) => (
  <BackGroundStyle>
    <div ref={ref} className={classNames('BackGround', className)} {...props} />
  </BackGroundStyle>
));
BackGround.displayName = 'BackGround';

const BackGroundStyle = styled.div`
  .BackGround {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    min-height: 100dvh;
    overflow-y: auto;
    position: relative;
    background-color: var(--bg-root, #07070f);

    /* Radial gradient overlays for depth */
    &::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 90%, rgba(34, 211, 238, 0.05) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(79, 70, 229, 0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    /* Subtle grid pattern */
    &::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 102, 241, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.025) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 0;
    }

    /* Content above overlays */
    > * { position: relative; z-index: 1; }

    ${scrollbarStyles}
  }
`;

export default BackGround;
