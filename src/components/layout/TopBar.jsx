import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

const TopBar = ({ title, onMenuClick, showBack = false, backAction, backLabel = 'Back', showLogout = false, onLogout }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = i18n.dir();
  };

  const handleBack = () => {
    if (backAction) backAction();
    else navigate('/main/dashboard');
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('is_guest');
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-bg-root/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-sm hover:bg-bg-hover text-text-secondary transition-colors"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showBack && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-brand-accent hover:bg-bg-accent/5 hover:text-brand-accent-dark transition-colors" onClick={handleBack}>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </button>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <h1 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {showLogout && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t('logout')}
            </Button>
          )}
          <div className="flex gap-1">
            {['en', 'ar'].map((l) => (
              <button
                key={l}
                className={cn('px-2 py-1 rounded text-xs border border-border', l === i18n.language ? 'bg-brand-accent text-primary border-brand-accent' : 'bg-bg-input text-text-secondary')}
                onClick={() => changeLanguage(l)}
              >
                {l === 'en' ? 'EN' : 'ع'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
export { TopBar };
