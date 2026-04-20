/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../services/authService';
import apiClient, { isGuest } from '../services/apiClient';
import { getMockData } from '../services/mockService';
import { useTranslation } from 'react-i18next';

function CustomDrawer({ isOpen, toggleDrawer }) {
  const { t, i18n } = useTranslation();
  const [sellsFund, setSellsFund] = useState('');
  const [permanatFund, setPermanatFund] = useState('');
  const [drawerSide, setDrawerSide] = useState(i18n.dir() === 'rtl' ? 'right' : 'left');
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const navigate = useNavigate();

  const fetchFunds = async () => {
    if (isGuest()) {
      const f = getMockData('funds'); setSellsFund(f.sells_fund); setPermanatFund(f.permanant_fund); return;
    }
    try {
      const res = await apiClient.get(`/${userData.user_name}/money-funds/`);
      setSellsFund(res.data.sells_fund); setPermanatFund(res.data.permanant_fund);
    } catch (e) { console.error('Error fetching funds'); }
  };

  useEffect(() => { fetchFunds(); }, []);

  const send_data = async (e) => {
    e.preventDefault();
    if (isGuest()) return alert('Demo Mode: Action not available.');
    if (sellsFund != 0) {
      try {
        await apiClient.post(`/${userData.user_name}/move-sells-funds/`, { user: userData.user_name, sellsFund });
        location.reload();
      } catch (e) { alert('Error moving funds.'); }
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDrawerSide(i18n.dir() === 'rtl' ? 'right' : 'left');
  };
  useEffect(() => { document.body.dir = i18n.dir(); }, [i18n.language]);

  const navItems = [
    { key: 'customers',       path: '/main/customers' },
    { key: 'sellCustomer',    path: '/main/sell-customers' },
    { key: 'moneyIncome',     path: '/main/money-income' },
    { key: 'payment',         path: '/main/payments' },
    { key: 'types',           path: '/main/types' },
    { key: 'supplies',        path: '/main/supplies' },
    { key: 'dispatchSupplies',path: '/main/dispatch-supplies' },
    { key: 'buySupplies',     path: '/main/reciepts' },
    { key: 'employees',       path: '/main/employees' },
    { key: 'inventory',       path: '/main/inventory' },
  ];

  const drawerContent = (
    <>
      <Overlay $isOpen={isOpen} onClick={toggleDrawer(false)} />
      <DrawerContent $drawerSide={drawerSide} $isOpen={isOpen}>
        <div className="Drawer" onClick={toggleDrawer(false)}>
          {/* Header */}
          <div className="DrawerHeader">
            <div className="DrawerLogo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>{t('options')}</span>
            </div>
            {/* Language selector */}
            <div className="LangPills">
              {['en', 'ar'].map(l => (
                <button
                  key={l}
                  className={l === i18n.language ? 'LangPill active' : 'LangPill'}
                  onClick={() => changeLanguage(l)}
                >
                  {l === 'en' ? 'EN' : 'ع'}
                </button>
              ))}
              <button onClick={() => navigate('/main/options')} className="LangPill opts">⚙</button>
            </div>
          </div>

          {/* Fund Cards */}
          <div className="FundsSection">
            <div className="FundCard">
              <span className="FundLabel">{t('sellsFund')}</span>
              <span className="FundValue accent">{sellsFund}</span>
              <button className="MoveBtn" onClick={send_data}>{t('moveToPerma')}</button>
            </div>
            <div className="FundCard">
              <span className="FundLabel">{t('permaFund')}</span>
              <span className="FundValue emerald">{permanatFund}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="NavSection">
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.path)} className="NavItem">
                {t(item.key)}
              </button>
            ))}
          </nav>
        </div>
      </DrawerContent>
    </>
  );

  return createPortal(drawerContent, document.body);
}



const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: ${p => p.$isOpen ? '1' : '0'};
  pointer-events: ${p => p.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  z-index: 9999;
`;

const DrawerContent = styled.div`
  .Drawer {
    position: fixed;
    top: 0;
    ${p => p.$drawerSide === 'left' ? 'left: 0;' : 'right: 0;'}
    height: 100%;
    width: 280px;
    background: rgba(10, 10, 22, 0.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-${p => p.$drawerSide === 'left' ? 'right' : 'left'}: 1px solid var(--border, rgba(99,102,241,0.12));
    transform: translateX(${p => p.$isOpen ? '0' : p.$drawerSide === 'left' ? '-100%' : '100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 99px; }
  }

  .DrawerHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2em 1.2em 1em;
    border-bottom: 1px solid var(--border, rgba(99,102,241,0.12));
    background: linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%);
  }

  .DrawerLogo {
    display: flex;
    align-items: center;
    gap: 0.5em;
    color: var(--text-primary, #e8e8ff);
    font-weight: 600;
    font-size: 0.95rem;
    svg { color: var(--accent, #6366f1); }
  }

  .LangPills {
    display: flex;
    gap: 0.3em;
  }

  .LangPill {
    padding: 0.25em 0.6em;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid var(--border, rgba(99,102,241,0.12));
    background: transparent;
    color: var(--text-secondary, rgba(232,232,255,0.55));
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 150ms;

    &.active {
      background: var(--accent, #6366f1);
      border-color: var(--accent, #6366f1);
      color: #fff;
    }
    &:hover:not(.active) {
      border-color: var(--border-hover, rgba(99,102,241,0.35));
      color: var(--text-primary, #e8e8ff);
    }
    &.opts { font-size: 1rem; padding: 0.2em 0.5em; }
  }

  .FundsSection {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
  }

  .FundCard {
    background: var(--bg-input, rgba(255,255,255,0.04));
    border: 1px solid var(--border, rgba(99,102,241,0.12));
    border-radius: var(--radius-md, 14px);
    padding: 0.85em 1em;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  .FundLabel {
    font-size: 0.75rem;
    color: var(--text-muted, rgba(232,232,255,0.3));
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  .FundValue {
    font-size: 1.4rem;
    font-weight: 700;
    &.accent { color: var(--accent-light, #818cf8); }
    &.emerald { color: var(--emerald, #10b981); }
  }

  .MoveBtn {
    margin-top: 0.4em;
    padding: 0.4em 0.8em;
    border-radius: var(--radius-xs, 6px);
    border: 1px solid var(--border, rgba(99,102,241,0.12));
    background: rgba(99,102,241,0.1);
    color: var(--text-accent, #818cf8);
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 150ms;
    align-self: flex-start;
    &:hover {
      background: rgba(99,102,241,0.2);
      border-color: var(--accent, #6366f1);
    }
  }

  .NavSection {
    padding: 0.5em 0.75em 1.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    flex: 1;
  }

  .NavItem {
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.7em 1em;
    border-radius: var(--radius-sm, 10px);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary, rgba(232,232,255,0.55));
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: start;
    transition: all 150ms;
    &:hover {
      background: rgba(99,102,241,0.08);
      border-color: var(--border, rgba(99,102,241,0.12));
      color: var(--text-primary, #e8e8ff);
    }
  }

  @media (max-width: 768px) {
    .Drawer { width: 75vw; }
  }
`;

export default CustomDrawer;
