import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonInputStyles } from '../styles/SharedStyles';

const InputField = React.forwardRef(
  ({ className, includeSVG, svgWidth = 16, svgHeight = 16, svgColor = "currentColor", viewBox = "0 0 16 16", svgPath, stroke, strokeWidth, strokeLinecap, strokeLinejoin, ...props }, ref) => (
    <InputStyle>
      <div className={classNames("Field", className)}>
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
InputField.displayName = "InputField";

const InputStyle = styled.div`
  .Field {
    ${commonInputStyles}
    display: flex; align-items: center; justify-content: center;
    margin: 0 1em 15px;
  }
  .InputField {
    background: none; border: none; outline: none; width: 100%; color: #d3d3d3;
    &::placeholder { text-align: center; }
  }
  .Input-Icon { height: 1.3em; width: 1.3em; fill: white; }
  @media (max-width: 768px) { .Field { margin-left: 0; margin-right: 0; } }
`;

export default InputField;
