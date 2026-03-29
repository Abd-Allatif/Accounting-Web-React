import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { commonButtonStyles } from '../styles/SharedStyles';

const Button = React.forwardRef(({ className, children, ...props }, ref) => (
  <ButtonStyle>
    <button ref={ref} className={classNames("Button", className)} {...props}>
      {children}
    </button>
  </ButtonStyle>
));
Button.displayName = "Button";

const ButtonStyle = styled.div`
  .Button { ${commonButtonStyles} margin-right: 0.5em; }
`;

export default Button;
