import React, { useState, useEffect } from 'react';
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

function Receipts() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTypes, setSearchTypes] = useState('');
  const [typesData, setTypesData] = useState([]);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptsData, setReceiptsData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchReceipts = async () => {
    if (isGuest()) {
      setReceiptsData([
        { id: 1, type: 'Electronics', supply: 'Supply 1', countity: 10, buy_price: 5, sell_price: 10, total: 50, date: '2023-01-01', notes: 'Demo receipt' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/buy-supplies/`);
      setReceiptsData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, [username]);

  const searchForTypes = async (q = '') => {
    if (!q) { setTypesData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/${q}`);
      setTypesData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTypesData([]);
    }
  };

  const searchForSupplies = async (q = '', type = '') => {
    if (!q) { setSuppliesData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/search-supplies/${type}/${q}`);
      setSuppliesData(Array.isArray(res.data.supplies) ? res.data.supplies : []);
    } catch {
      setSuppliesData([]);
    }
  };

  const handleSearchType = (e) => {
    const q = e.target.value;
    setSearchTypes(q);
    searchForTypes(q);
    if (!q) setTypesData([]);
  };

  const handleSearchSupplies = (e) => {
    const q = e.target.value;
    setSearchSupplies(q);
    searchForSupplies(q, searchTypes);
    if (!q) setSuppliesData([]);
  };

  const buySupply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!searchTypes || !searchSupplies || !countity || !buyPrice || !sellPrice || !date) {
      setError('All fields are required');
      return;
    }
    if (isGuest()) {
      setSuccess('Demo mode: data cannot be added');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(`/${username}/buy-supplies/`, {
        user: username, types: searchTypes, supplies: searchSupplies, countity, buy_price: buyPrice, sell_price: sellPrice, date, notes,
      });
      setSearchTypes(''); setSearchSupplies(''); setCountity(''); setBuyPrice(''); setSellPrice(''); setDate(''); setNotes('');
      setSuccess('Receipt added successfully');
      fetchReceipts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add receipt');
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;
    if (isGuest()) {
      setSuccess('Demo mode: data cannot be deleted');
      return;
    }
    setLoading(true);
    try {
      await apiClient.delete(`/${username}/edit-reciepts/`, { data: { id } });
      setSuccess('Receipt deleted successfully');
      fetchReceipts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('buySupplies')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[560px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('buySupply')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={buySupply}>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  label={t('type')}
                  type="text"
                  value={searchTypes}
                  onChange={handleSearchType}
                  placeholder="Type name"
                  required
                />
                {searchTypes && typesData.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                    {typesData.map((t_item, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hover border-b border-border/50 last:border-0"
                        onClick={() => { setSearchTypes(t_item.type); setTypesData([]); }}
                      >
                        {t_item.type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  label={t('supply')}
                  type="text"
                  value={searchSupplies}
                  onChange={handleSearchSupplies}
                  placeholder="Supply name"
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
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} required />
              <Input label={t('buyPrice')} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} required />
              <Input label={t('sellPrice')} type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <Input label={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            </div>
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('buy')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-brand-accent-light"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? t('hideData') : t('showData')} <span className="text-text-secondary">{t('buySupplies')}</span>
            </button>
          </div>
          {showTable && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('supply')}</TableHead>
                    <TableHead>{t('countity')}</TableHead>
                    <TableHead>{t('buyPrice')}</TableHead>
                    <TableHead>{t('total')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receiptsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-text-muted py-4">
                        No receipts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    receiptsData.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.type}</TableCell>
                        <TableCell>{r.supply}</TableCell>
                        <TableCell>{r.countity}</TableCell>
                        <TableCell>{r.buy_price}</TableCell>
                        <TableCell>{r.total}</TableCell>
                        <TableCell>
                          <Button variant="danger" size="sm" onClick={() => deleteReceipt(r.id)}>
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

export default Receipts;
