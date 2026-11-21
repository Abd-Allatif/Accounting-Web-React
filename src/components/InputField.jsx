import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonInputStyles } from '../styles/SharedStyles';

const InputField = React.forwardRef(
  ({ className, includeSVG, svgWidth = 16, svgHeight = 16, svgColor = 'currentColor', viewBox = '0 0 16 16', svgPath, stroke, strokeWidth, strokeLinecap, strokeLinejoin, ...props }, ref) => (
    <InputStyle>
      <div className={classNames('Field', className)}>
        {includeSVG && (
          <svg className="Input-Icon" xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgHeight} fill={svgColor} viewBox={viewBox}>
            <path d={svgPath} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
          </svg>
        )}
        <input ref={ref} className="InputField" {...props} />
      </div>
    </InputStyle>
  )
);
InputField.displayName = 'InputField';

const InputStyle = styled.div`
  .Field {
    ${commonInputStyles}
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin: 0 0.75em 0.85em;
    min-height: 44px;
  }

  .InputField {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: var(--text-primary, #e8e8ff);
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.9rem;

    &::placeholder {
      color: var(--text-muted, rgba(232,232,255,0.3));
      text-align: center;
      font-size: 0.875rem;
    }
  }

  .Input-Icon {
    height: 1.1em;
    width: 1.1em;
    fill: var(--text-accent, #818cf8);
    flex-shrink: 0;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .Field { margin-left: 0; margin-right: 0; }
  }
`;

export default InputField;
