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

function Payments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [moneyFor, setMoneyFor] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({ money_for: '', total: '', date: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchPayments = async () => {
    if (isGuest()) {
      setPaymentData([
        { id: 1, money_for: 'Salary', total: 50, date: '2023-01-01', notes: 'Demo payment' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/manage-payment/`);
      setPaymentData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [username]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!moneyFor || !total || !date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setPaymentData([...paymentData, { id: Date.now(), money_for: moneyFor, total, date, notes }]);
      setMoneyFor(''); setTotal(''); setDate(''); setNotes('');
      setSuccess('Payment added (demo)');
      fetchPayments();
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/manage-payment/`, {
        user: username, money_for: moneyFor, total: parseFloat(total) || 0, date, notes,
      });
      setMoneyFor(''); setTotal(''); setDate(''); setNotes('');
      setSuccess('Payment added successfully');
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const savePayment = async (id) => {
    if (!editValue.money_for || !editValue.total || !editValue.date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setPaymentData(paymentData.map((p) => (p.id === id ? { ...p, ...editValue } : p)));
      setEditId(null); setEditValue({ money_for: '', total: '', date: '', notes: '' });
      fetchPayments();
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-payment/`, { id, ...editValue });
      setEditId(null); setEditValue({ money_for: '', total: '', date: '', notes: '' });
      setSuccess('Payment updated successfully');
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    setLoading(true);
    if (isGuest()) {
      setPaymentData(paymentData.filter((p) => p.id !== id));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-payment/`, { data: { id } });
      setSuccess('Payment deleted successfully');
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete payment');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = paymentData.filter((p) =>
    p.money_for.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('payment')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[460px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('addPayment')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input label={t('moneyFor')} type="text" value={moneyFor} onChange={(e) => setMoneyFor(e.target.value)} placeholder="e.g. Salary, Rent" required />
            <Input label={t('total')} type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0.00" required />
            <Input label={t('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('addPayment')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('paymentsList')}</h3>
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
                  <TableHead>{t('moneyFor')}</TableHead>
                  <TableHead>{t('total')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('notes')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-muted py-4">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((pay) => (
                    <TableRow key={pay.id}>
                      <TableCell>
                        {editId === pay.id ? (
                          <Input
                            type="text"
                            value={editValue.money_for}
                            onChange={(e) => setEditValue({ ...editValue, money_for: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          pay.money_for
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === pay.id ? (
                          <Input
                            type="number"
                            value={editValue.total}
                            onChange={(e) => setEditValue({ ...editValue, total: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          pay.total
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === pay.id ? (
                          <Input
                            type="date"
                            value={editValue.date}
                            onChange={(e) => setEditValue({ ...editValue, date: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          pay.date
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === pay.id ? (
                          <Input
                            type="text"
                            value={editValue.notes}
                            onChange={(e) => setEditValue({ ...editValue, notes: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          pay.notes
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {editId === pay.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => savePayment(pay.id)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue({ money_for: '', total: '', date: '', notes: '' }); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditId(pay.id);
                              setEditValue({ ...pay });
                            }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deletePayment(pay.id)}>
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

export default Payments;
