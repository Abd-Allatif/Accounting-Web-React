import { css } from 'styled-components';

export const scrollbarStyles = css`
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
`;

export const commonCardStyles = css`
  background: var(--bg-card, rgba(13, 13, 26, 0.75));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.12));
  border-radius: var(--radius-xl, 28px);
  padding: 2em;
  box-shadow: var(--shadow-card, 0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06));
  transition: border-color var(--transition-normal, 250ms);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const commonInputStyles = css`
  border-radius: var(--radius-sm, 10px);
  padding: 0.65em 1em;
  border: 1px solid var(--border, rgba(99, 102, 241, 0.12));
  outline: none;
  color: var(--text-primary, #e8e8ff);
  background: var(--bg-input, rgba(255, 255, 255, 0.04));
  transition: border-color var(--transition-fast, 150ms), box-shadow var(--transition-fast, 150ms), background var(--transition-fast, 150ms);
  &:focus-within {
    border-color: var(--accent, #6366f1);
    background: rgba(99, 102, 241, 0.07);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

export const commonButtonStyles = css`
  padding: 0.55em 1.3em;
  border-radius: var(--radius-sm, 10px);
  border: 1px solid transparent;
  outline: none;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: all var(--transition-normal, 250ms);
  background: linear-gradient(135deg, var(--accent, #6366f1), var(--accent-dark, #4f46e5));
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    opacity: 0;
    transition: opacity var(--transition-fast, 150ms);
  }
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    border-color: rgba(255,255,255,0.1);
    &::before { opacity: 1; }
  }
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;
