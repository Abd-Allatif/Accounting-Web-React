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

function Income() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [moneyFrom, setMoneyFrom] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({ money_from: '', total: '', date: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchIncome = async () => {
    if (isGuest()) {
      setIncomeData([
        { id: 1, money_from: 'Guest Customer', total: 100, date: '2023-01-01', notes: 'Demo income' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/manage-income/`);
      setIncomeData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load income');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncome(); }, [username]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!moneyFrom || !total || !date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setIncomeData([...incomeData, { id: Date.now(), money_from: moneyFrom, total, date, notes }]);
      setMoneyFrom(''); setTotal(''); setDate(''); setNotes('');
      setSuccess('Income added (demo)');
      fetchIncome();
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/manage-income/`, {
        user: username, money_from: moneyFrom, total: parseFloat(total) || 0, date, notes,
      });
      setMoneyFrom(''); setTotal(''); setDate(''); setNotes('');
      setSuccess('Income added successfully');
      fetchIncome();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const saveIncome = async (id) => {
    if (!editValue.money_from || !editValue.total || !editValue.date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setIncomeData(incomeData.map((i) => (i.id === id ? { ...i, ...editValue } : i)));
      setEditId(null); setEditValue({ money_from: '', total: '', date: '', notes: '' });
      fetchIncome();
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-income/`, { id, ...editValue });
      setEditId(null); setEditValue({ money_from: '', total: '', date: '', notes: '' });
      setSuccess('Income updated successfully');
      fetchIncome();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update income');
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    setLoading(true);
    if (isGuest()) {
      setIncomeData(incomeData.filter((i) => i.id !== id));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-income/`, { data: { id } });
      setSuccess('Income deleted successfully');
      fetchIncome();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete income');
    } finally {
      setLoading(false);
    }
  };

  const filteredIncome = incomeData.filter((inc) =>
    inc.money_from.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('moneyIncome')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[460px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('addIncome')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input label={t('moneyFrom')} type="text" value={moneyFrom} onChange={(e) => setMoneyFrom(e.target.value)} placeholder="Customer or source name" required />
            <Input label={t('total')} type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0.00" required />
            <Input label={t('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('addIncome')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('incomeList')}</h3>
            <Input
              label=""
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('search')}
              className="w-48"
            />
          </div>
          {loading && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('moneyFrom')}</TableHead>
                  <TableHead>{t('total')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('notes')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncome.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-muted py-4">
                      No income records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncome.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell>
                        {editId === inc.id ? (
                          <Input
                            type="text"
                            value={editValue.money_from}
                            onChange={(e) => setEditValue({ ...editValue, money_from: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          inc.money_from
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === inc.id ? (
                          <Input
                            type="number"
                            value={editValue.total}
                            onChange={(e) => setEditValue({ ...editValue, total: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          inc.total
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === inc.id ? (
                          <Input
                            type="date"
                            value={editValue.date}
                            onChange={(e) => setEditValue({ ...editValue, date: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          inc.date
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === inc.id ? (
                          <Input
                            type="text"
                            value={editValue.notes}
                            onChange={(e) => setEditValue({ ...editValue, notes: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          inc.notes
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {editId === inc.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => saveIncome(inc.id)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue({ money_from: '', total: '', date: '', notes: '' }); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditId(inc.id);
                              setEditValue({ ...inc });
                            }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deleteIncome(inc.id)}>
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
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Income;
