import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import apiClient, { isGuest } from '../../services/apiClient';
import { TopBar } from '../../components/layout/TopBar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';

function SetupAccount() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [types, setTypes] = useState('');
  const [displayTypes, setDisplayTypes] = useState([]);
  const [customers, setCustomers] = useState('');
  const [displayCustomers, setDisplayCustomers] = useState([]);
  const [employees, setEmployees] = useState('');
  const [displayEmployees, setDisplayEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const typesRef = useRef(null);
  const customerRef = useRef(null);
  const employeeRef = useRef(null);
  const username = user?.user_name || 'guest';

  const addToList = (list, setList, value, setValue, ref) => {
    if (value.trim()) {
      setList([...list, value]);
      setValue('');
      if (ref.current) ref.current.focus();
    }
  };

  const removeFromList = (list, setList, index) => {
    const n = [...list];
    n.splice(index, 1);
    setList(n);
  };

  const submitSetupData = async () => {
    if (!budget.trim()) {
      setError(t('setupError'));
      return;
    }
    setError('');
    setLoading(true);

    if (isGuest()) {
      setTimeout(() => {
        setLoading(false);
        setSuccess('Demo mode: setup skipped');
      }, 800);
      return;
    }

    try {
      await apiClient.post(`/${username}/setup-account/`, {
        user: username,
        budget: parseFloat(budget) || 0,
        types: displayTypes,
        customers: displayCustomers,
        employees: displayEmployees,
      });
      setSuccess('Account setup completed successfully');
      setTimeout(() => {
        window.location.href = '/main/dashboard';
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Error setting up account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <TopBar title={t('setupAccount')} onMenuClick={() => setSidebarOpen(true)} showBack backLabel={t('back')} />
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 animate-[cardIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-1">{t('setupAccount')}</h2>
            <p className="text-text-secondary text-sm">{t('setUpInitialData')}</p>
          </div>

          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">{success}</Alert>}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('enterBudget')}
              </label>
              <Input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('insertTypes')}
              </label>
              <div className="flex gap-2">
                <Input
                  ref={typesRef}
                  type="text"
                  value={types}
                  onChange={(e) => setTypes(e.target.value)}
                  placeholder="e.g. Electronics"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToList(displayTypes, setDisplayTypes, types, setTypes, typesRef)}
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {displayTypes.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent border border-brand-accent/20">
                    {item}
                    <button
                      type="button"
                      className="ml-1 hover:text-brand-accent"
                      onClick={() => removeFromList(displayTypes, setDisplayTypes, i)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('insertExistingCustomer')}
              </label>
              <div className="flex gap-2">
                <Input
                  ref={customerRef}
                  type="text"
                  value={customers}
                  onChange={(e) => setCustomers(e.target.value)}
                  placeholder="Customer name"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToList(displayCustomers, setDisplayCustomers, customers, setCustomers, customerRef)}
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {displayCustomers.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent border border-brand-accent/20">
                    {item}
                    <button
                      type="button"
                      className="ml-1 hover:text-brand-accent"
                      onClick={() => removeFromList(displayCustomers, setDisplayCustomers, i)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('insertExistingEmployees')}
              </label>
              <div className="flex gap-2">
                <Input
                  ref={employeeRef}
                  type="text"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="Employee name"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToList(displayEmployees, setDisplayEmployees, employees, setEmployees, employeeRef)}
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {displayEmployees.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent border border-brand-accent/20">
                    {item}
                    <button
                      type="button"
                      className="ml-1 hover:text-brand-accent"
                      onClick={() => removeFromList(displayEmployees, setDisplayEmployees, i)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => window.location.href = '/main/dashboard'}>
                {t('skip')}
              </Button>
              <Button type="button" variant="primary" className="flex-1" loading={loading} onClick={submitSetupData}>
                {t('submit')}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="mt-6 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default SetupAccount;
