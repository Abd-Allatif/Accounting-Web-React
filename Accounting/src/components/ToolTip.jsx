import React from 'react';
import styled from 'styled-components';

const ToolTip = React.forwardRef(({ text }) => (
  <ToolTipDesign>
    <div className="tooltip-container">
      <div className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={22} height={22} fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="tooltip">
        <p>{text}</p>
      </div>
    </div>
  </ToolTipDesign>
));
ToolTip.displayName = 'Tooltip';

const ToolTipDesign = styled.div`
  .tooltip-container {
    position: relative;
    display: inline-block;
    margin: 0 0.5em;
  }

  .icon {
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--text-muted, rgba(232,232,255,0.3));
    transition: color var(--transition-fast, 150ms), transform var(--transition-normal, 250ms);

    &:hover {
      color: var(--accent-light, #818cf8);
      transform: rotate(15deg) scale(1.1);
    }
  }

  .tooltip {
    visibility: hidden;
    width: 220px;
    background: var(--bg-elevated, rgba(20,20,38,0.9));
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-hover, rgba(99,102,241,0.35));
    color: var(--text-secondary, rgba(232,232,255,0.55));
    text-align: center;
    border-radius: var(--radius-sm, 10px);
    padding: 0.75em 1em;
    font-size: 0.82rem;
    line-height: 1.5;
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    opacity: 0;
    transition: opacity 0.25s, transform 0.25s;
    box-shadow: var(--shadow-md, 0 4px 20px rgba(0,0,0,0.5));
    pointer-events: none;
    z-index: 100;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(99,102,241,0.35) transparent transparent transparent;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

export default ToolTip;
