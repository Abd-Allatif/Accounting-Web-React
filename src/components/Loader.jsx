import React from 'react';
import styled from 'styled-components';

const Loader = ({ width = '3', height = '20', animateHeight = '35' }) => (
  <LoaderStyle $w={width} $h={height} $ah={animateHeight}>
    <div className="loader">
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </div>
  </LoaderStyle>
);

const LoaderStyle = styled.div`
  .loader {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .bar {
    display: inline-block;
    width: ${p => p.$w}px;
    height: ${p => p.$h}px;
    background: linear-gradient(180deg, var(--accent, #6366f1), var(--cyan, #22d3ee));
    border-radius: 10px;
    animation: barPulse 1s ease-in-out infinite;
  }

  .bar:nth-child(2) {
    height: ${p => p.$ah}px;
    animation-delay: 0.2s;
    background: linear-gradient(180deg, var(--accent-light, #818cf8), var(--accent, #6366f1));
  }

  .bar:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes barPulse {
    0%, 100% { transform: scaleY(1); opacity: 0.6; }
    50%       { transform: scaleY(1.5); opacity: 1; }
  }
`;

export default Loader;
