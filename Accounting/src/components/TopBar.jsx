import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const TopBar = React.forwardRef(({ drawerButton_Onclick, backButton_Onclick, Text, buttonText, ...props }, ref) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const goMathNotes = () => navigate('/math-notes');

  return (
    <TopBarStyle>
      <header>
        <div className="TopBar">
          {/* Left: Drawer + Math Notes */}
          <div className="TopBar__left">
            <button className="IconBtn" onClick={drawerButton_Onclick} aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <button className="IconBtn MathBtn" onClick={goMathNotes} aria-label="Math Notes">
              <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2.5" stroke="currentColor" fill="none">
                <path d="M14.84,11.08H48.28a5,5,0,0,1,5,5V49.53a5,5,0,0,1-5,5H14.84a5,5,0,0,1-5-5V16.08A5,5,0,0,1,14.84,11.08Z" strokeLinecap="round" />
                <line x1="20.8" y1="18.15" x2="20.8" y2="26.5" strokeLinecap="round" />
                <line x1="16.63" y1="22.32" x2="24.98" y2="22.32" strokeLinecap="round" />
                <line x1="17.37" y1="40.37" x2="24.08" y2="47.08" strokeLinecap="round" />
                <line x1="17.37" y1="47.08" x2="24.08" y2="40.37" strokeLinecap="round" />
                <line x1="37.8" y1="22.32" x2="47.28" y2="22.32" strokeLinecap="round" />
                <line x1="37.74" y1="40.37" x2="47.22" y2="40.37" strokeLinecap="round" />
                <line x1="37.74" y1="46.22" x2="47.22" y2="46.22" strokeLinecap="round" />
                <line x1="31.57" y1="11.08" x2="31.57" y2="54.53" strokeLinecap="round" />
                <line x1="9.84" y1="32.8" x2="53.29" y2="32.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Center: Title */}
          <h2 className="TopBar__title">{Text}</h2>

          {/* Right: Back/Action button */}
          <div className="TopBar__right">
            <Button className="backbtn" onClick={backButton_Onclick}>
              {buttonText ? buttonText : t('back')}
            </Button>
          </div>
        </div>
      </header>
    </TopBarStyle>
  );
});
TopBar.displayName = 'TopBar';

const TopBarStyle = styled.div`
  header {
    margin-bottom: 4.5em;
  }

  .TopBar {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    height: 64px;
    padding: 0 1em;
    background: rgba(7, 7, 15, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border, rgba(99,102,241,0.12));
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }

  .TopBar__left {
    display: flex;
    align-items: center;
    gap: 0.25em;
    min-width: 90px;
  }

  .TopBar__title {
    flex: 1;
    text-align: center;
    color: var(--text-primary, #e8e8ff);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 0.5em;
  }

  .TopBar__right {
    min-width: 90px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .IconBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm, 10px);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary, rgba(232,232,255,0.55));
    cursor: pointer;
    transition: all var(--transition-fast, 150ms);

    &:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: var(--border-hover, rgba(99,102,241,0.35));
      color: var(--text-primary, #e8e8ff);
    }
  }

  .backbtn {
    font-size: 0.82rem;
    padding: 0.4em 1em;
    margin-right: 0;
  }

  @media (max-width: 768px) {
    .TopBar { height: 56px; padding: 0 0.6em; }
    .TopBar__left { min-width: 70px; gap: 0; }
    .TopBar__right { min-width: 70px; }
    .TopBar__title { font-size: 0.9rem; }
    .MathBtn { display: none; }
  }
`;

export default TopBar;
