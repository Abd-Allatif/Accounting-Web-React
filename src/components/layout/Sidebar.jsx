import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/main/dashboard' },
  { key: 'supplies', label: 'Supplies', path: '/main/supplies' },
  { key: 'types', label: 'Types', path: '/main/types' },
  { key: 'customers', label: 'Customers', path: '/main/customers' },
  { key: 'employees', label: 'Employees', path: '/main/employees' },
  { key: 'sells', label: 'Sells', path: '/main/sells' },
  { key: 'customerSells', label: 'Customer Sells', path: '/main/customer-sells' },
  { key: 'receipts', label: 'Buy Supplies', path: '/main/receipts' },
  { key: 'payments', label: 'Payments', path: '/main/payments' },
  { key: 'income', label: 'Income', path: '/main/income' },
  { key: 'dispatches', label: 'Dispatches', path: '/main/dispatches' },
  { key: 'inventory', label: 'Inventory', path: '/main/inventory' },
  { key: 'options', label: 'Options', path: '/main/options' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { refreshAuth, user } = useAuth();
  const { t, i18n } = useTranslation();
  const [drawerSide, setDrawerSide] = React.useState(i18n.dir() === 'rtl' ? 'right' : 'left');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDrawerSide(i18n.dir() === 'rtl' ? 'right' : 'left');
  };

  React.useEffect(() => { document.body.dir = i18n.dir(); }, [i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_guest');
    refreshAuth();
    navigate('/');
  };

  return (
    <>
      <div
        className={cn('fixed inset-0 bg-black/60 backdrop-blur-sm z-40', isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none transition-opacity duration-300')}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed top-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out',
          drawerSide === 'left' ? 'left-0' : 'right-0',
          isOpen ? 'translate-x-0' : drawerSide === 'left' ? '-translate-x-full' : 'translate-x-full',
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand-accent to-brand-accent-dark flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">Accountify</span>
          </div>
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
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm px-3 py-2.5 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              onClick={() => { navigate(item.path); onClose(); }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-6 border-t border-border">
          <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
            {t('logout')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
export { Sidebar };
