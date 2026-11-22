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

function Sells() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sellData, setSellData] = useState([]);
  const [searchSells, setSearchSells] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [editSellId, setEditSellId] = useState(null);
  const [editsellData, setEditsellData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchSells = async () => {
    if (isGuest()) {
      setSellData([
        { id: 1, supply: 'Supply 1', countity: 2, price: 10, total: 20, date: '2023-01-01', notes: 'Demo sell' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/sell-supplies/`);
      setSellData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load sells');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSells(); }, [username]);

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
  };

  const handleSuppliesSelect = (s) => {
    setSearchSupplies(s.supply_name);
    setPrice(s.sell_price);
    setCountity('1');
    setSuppliesData([]);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!searchSupplies || !countity || !price || !date) {
      setError('Supply, countity, price, and date are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setSellData([...sellData, { id: Date.now(), supply: searchSupplies, countity, price, total: Number(countity) * Number(price), date, notes }]);
      setSearchSupplies(''); setCountity(''); setPrice(''); setDate(''); setNotes('');
      setSuccess('Sell added (demo)');
      fetchSells();
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/sell-supplies/`, {
        user: username, supplies: searchSupplies, countity, price, date, notes,
      });
      setSearchSupplies(''); setCountity(''); setPrice(''); setDate(''); setNotes('');
      setSuccess('Sell recorded successfully');
      fetchSells();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record sell');
    } finally {
      setLoading(false);
    }
  };

  const editSell = async (id) => {
    setLoading(true);
    if (isGuest()) {
      setSellData(sellData.map((s) => (s.id === id ? { ...s, ...editsellData, total: Number(editsellData.countity) * Number(editsellData.price) } : s)));
      setEditSellId(null);
      fetchSells();
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-sell/`, { ...editsellData });
      setEditSellId(null);
      fetchSells();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit sell');
    } finally {
      setLoading(false);
    }
  };

  const deleteSell = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sell record?')) return;
    setLoading(true);
    if (isGuest()) {
      setSellData(sellData.filter((s) => s.id !== id));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-sell/`, { data: { id } });
      setSuccess('Sell deleted successfully');
      fetchSells();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete sell');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSells = (e) => {
    setSearchSells(e.target.value);
  };

  const filteredSells = sellData.filter((s) =>
    s.supply.toLowerCase().includes(searchSells.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('sellSupplies')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[480px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('recordSell')}</h3>
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
                      onClick={() => handleSuppliesSelect(s)}
                    >
                      {s.supply_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label={t('countity')}
                type="number"
                value={countity}
                onChange={(e) => setCountity(e.target.value)}
                placeholder="0"
                required
              />
              <Input
                label={t('price')}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
              <Input
                label={t('date')}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <Input
              label={t('notes')}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('sell')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-brand-accent-light"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? t('hideData') : t('showData')} <span className="text-text-secondary">{t('sellSupplies')}</span>
            </button>
          </div>
          {showTable && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('supply')}</TableHead>
                    <TableHead>{t('countity')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead>{t('total')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="px-4 py-2">
                      <Input
                        label=""
                        type="text"
                        value={searchSells}
                        onChange={handleSearchSells}
                        placeholder={t('searchSells')}
                        className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                      />
                    </TableCell>
                  </TableRow>
                  {filteredSells.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-text-muted py-4">
                        No sells found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSells.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.supply}</TableCell>
                        <TableCell>
                          {editSellId === s.id ? (
                            <Input
                              type="number"
                              value={editsellData.countity || s.countity}
                              onChange={(e) => setEditsellData({ ...editsellData, countity: e.target.value })}
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                            />
                          ) : (
                            s.countity
                          )}
                        </TableCell>
                        <TableCell>
                          {editSellId === s.id ? (
                            <Input
                              type="number"
                              value={editsellData.price || s.price}
                              onChange={(e) => setEditsellData({ ...editsellData, price: e.target.value })}
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                            />
                          ) : (
                            s.price
                          )}
                        </TableCell>
                        <TableCell>{s.total}</TableCell>
                        <TableCell>
                          {editSellId === s.id ? (
                            <Input
                              type="date"
                              value={editsellData.date || s.date}
                              onChange={(e) => setEditsellData({ ...editsellData, date: e.target.value })}
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                            />
                          ) : (
                            s.date
                          )}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {editSellId === s.id ? (
                            <>
                              <Button variant="success" size="sm" onClick={() => editSell(s.id)} loading={loading}>
                                {t('save')}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => { setEditSellId(null); setEditsellData({}); }}>
                                {t('cancel')}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => { setEditSellId(s.id); setEditsellData({ ...s }); }}>
                                {t('edit')}
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => deleteSell(s.id)}>
                                {t('delete')}
                              </Button>
                            </>
                          )}
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

export default Sells;
