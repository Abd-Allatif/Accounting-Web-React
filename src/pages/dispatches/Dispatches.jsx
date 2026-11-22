import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import apiClient, { isGuest } from '../../services/apiClient';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

function Dispatches() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');
  const [reason, setReason] = useState('');
  const [dispatchData, setDispatchData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchDispatched = async () => {
    if (isGuest()) {
      setDispatchData([
        { id: 1, supply: 'Supply 1', countity: 5, buy_price: 5, dispatch_date: '2023-01-01', reason: 'Demo dispatch' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/dispatch-supplies/`);
      setDispatchData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load dispatches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDispatched(); }, [username]);

  const searchForSupplies = useCallback(async (query = '') => {
    if (!query) { setSuppliesData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/search-supplies/${query}`);
      setSuppliesData(Array.isArray(res.data.supplies) ? res.data.supplies : []);
    } catch {
      setSuppliesData([]);
    }
  }, [username]);

  const handleSearchSupplies = (e) => {
    const q = e.target.value;
    setSearchSupplies(q);
    searchForSupplies(q);
    if (!q) setSuppliesData([]);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!searchSupplies || !countity || !buyPrice || !dispatchDate) {
      setError('Supply, countity, buy price, and date are required');
      return;
    }
    if (isGuest()) {
      setSuccess('Demo mode: data cannot be added');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(`/${username}/dispatch-supplies/`, {
        user: username, supply: searchSupplies, countity, buy_price: buyPrice, dispatch_date: dispatchDate, reason,
      });
      setSearchSupplies(''); setCountity(''); setBuyPrice(''); setDispatchDate(''); setReason('');
      setSuccess('Dispatch added successfully');
      fetchDispatched();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add dispatch');
    } finally {
      setLoading(false);
    }
  };

  const deleteDispatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dispatch?')) return;
    if (isGuest()) {
      setSuccess('Demo mode: data cannot be deleted');
      return;
    }
    setLoading(true);
    try {
      await apiClient.delete(`/${username}/edit-dispatches/`, { data: { id } });
      setSuccess('Dispatch deleted successfully');
      fetchDispatched();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('dispatchSupplies')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[480px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('recordDispatch')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <div className="relative">
              <Input
                label={t('supply')}
                type="text"
                value={searchSupplies}
                onChange={handleSearchSupplies}
                placeholder="Search supplies"
                required
              />
              {searchSupplies && suppliesData.length > 0 && (
                <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                  {suppliesData.map((s, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hover border-b border-border/50 last:border-0"
                      onClick={() => { setSearchSupplies(s.supply_name); setSuppliesData([]); }}
                    >
                      {s.supply_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} required />
              <Input label={t('buyPrice')} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} required />
              <Input label={t('date')} type="date" value={dispatchDate} onChange={(e) => setDispatchDate(e.target.value)} required />
            </div>
            <Input label={t('reason')} type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for dispatch" />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('dispatch')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-brand-accent-light"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? t('hideData') : t('showData')} <span className="text-text-secondary">{t('dispatchSupplies')}</span>
            </button>
          </div>
          {showTable && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('supply')}</TableHead>
                    <TableHead>{t('countity')}</TableHead>
                    <TableHead>{t('buyPrice')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('reason')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispatchData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-text-muted py-4">
                        No dispatches found
                      </TableCell>
                    </TableRow>
                  ) : (
                    dispatchData.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.supply}</TableCell>
                        <TableCell>{d.countity}</TableCell>
                        <TableCell>{d.buy_price}</TableCell>
                        <TableCell>{d.dispatch_date}</TableCell>
                        <TableCell>{d.reason}</TableCell>
                        <TableCell>
                          <Button variant="danger" size="sm" onClick={() => deleteDispatch(d.id)}>
                            {t('delete')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Dispatches;
