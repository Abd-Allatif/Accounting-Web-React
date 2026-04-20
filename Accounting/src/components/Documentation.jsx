import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { commonCardStyles, scrollbarStyles } from '../styles/SharedStyles';
import Button from './Button';

const Documentation = React.forwardRef(({ docOpen, setDocOpen }) => {
  const { t } = useTranslation();
  const closebtn = () => setDocOpen(false);

  return (
    <ContentContainer>
      {docOpen && (
        <>
          <div className="DocOverlay" onClick={closebtn} />
          <div className="DocModal">
            <div className="DocHeader">
              <h2 className="DocTitle">{t('DocumentationTitle')}</h2>
              <button className="DocClose" onClick={closebtn} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="DocBody">
              <p className="DocAlert danger">{t('Doc10')}</p>
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <p key={n} className="DocLine">{t(`Doc${n}`)}</p>
              ))}
              <p className="DocAlert warning">{t('Doc11')}</p>
              <p className="DocLine">{t('Doc12')}</p>
              <p className="DocAlert info">{t('Doc8')}</p>
              <p className="DocAlert accent">{t('Doc9')}</p>
            </div>
            <div className="DocFooter">
              <Button onClick={closebtn}>{t('close')}</Button>
            </div>
          </div>
        </>
      )}
    </ContentContainer>
  );
});
Documentation.displayName = 'Documentation';

const ContentContainer = styled.div`
  .DocOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  .DocModal {
    ${commonCardStyles}
    ${scrollbarStyles}
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(700px, 90vw);
    max-height: 80vh;
    overflow-y: auto;
    z-index: 1001;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    padding: 0;
    gap: 0;
  }

  .DocHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25em 1.5em;
    border-bottom: 1px solid var(--border, rgba(99,102,241,0.12));
    background: linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%);
    border-radius: var(--radius-xl, 28px) var(--radius-xl, 28px) 0 0;
  }

  .DocTitle {
    color: var(--text-primary, #e8e8ff);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .DocClose {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-xs, 6px);
    border: 1px solid var(--border, rgba(99,102,241,0.12));
    background: transparent;
    color: var(--text-secondary, rgba(232,232,255,0.55));
    cursor: pointer;
    transition: all 150ms;
    &:hover {
      background: rgba(244,63,94,0.1);
      border-color: rgba(244,63,94,0.4);
      color: var(--rose, #f43f5e);
    }
  }

  .DocBody {
    padding: 1.25em 1.5em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .DocLine {
    color: var(--text-secondary, rgba(232,232,255,0.55));
    font-size: 0.9rem;
    line-height: 1.6;
    padding: 0.3em 0;
    border-bottom: 1px solid rgba(99,102,241,0.05);
  }

  .DocAlert {
    padding: 0.6em 1em;
    border-radius: var(--radius-xs, 6px);
    font-size: 0.875rem;
    font-weight: 500;
    border-left: 3px solid;

    &.danger  { background: rgba(244,63,94,0.08);  border-color: var(--rose,#f43f5e);    color: #fda4af; }
    &.warning { background: rgba(245,158,11,0.08); border-color: var(--amber,#f59e0b);   color: #fcd34d; }
    &.info    { background: rgba(34,211,238,0.08); border-color: var(--cyan,#22d3ee);    color: #67e8f9; }
    &.accent  { background: rgba(99,102,241,0.08); border-color: var(--accent,#6366f1);  color: var(--text-accent,#818cf8); }
  }

  .DocFooter {
    padding: 1em 1.5em 1.25em;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--border, rgba(99,102,241,0.12));
  }

  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); } to { opacity: 1; transform: translate(-50%, -50%); } }

  @media (max-width: 768px) {
    .DocModal { width: 90vw; max-height: 85vh; }
  }
`;

export default Documentation;
