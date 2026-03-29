import { css } from 'styled-components';

export const scrollbarStyles = css`
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #1e1e1e; }
  &::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #444; }
`;

export const commonCardStyles = css`
  background-color: #171717;
  border-radius: 25px;
  padding: 2em;
  transition: 0.4s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const commonInputStyles = css`
  border-radius: 25px;
  padding: 0.6em;
  border: none;
  outline: none;
  color: white;
  background-color: #171717;
  box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
`;

export const commonButtonStyles = css`
  padding: 0.5em 1.1em;
  border-radius: 5px;
  border: none;
  outline: none;
  transition: 0.4s ease-in-out;
  background-color: #252525;
  color: white;
  cursor: pointer;
  &:hover { background-color: black; }
`;
