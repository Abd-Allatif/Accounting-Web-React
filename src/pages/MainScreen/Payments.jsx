import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getPayment, debounce, searchPayment } from '../../services/BackendServices';
import { addMockData, deleteMockData, updateMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Payments() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [moneyFor, setMoneyFor] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentAdded, setPaymentAdded] = useState('');
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [editPaymentValue, setEditPaymentValue] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchPayments = () => getPayment(userData, setPaymentData);
  useEffect(() => { fetchPayments(); }, []);
  const handleSearchChange = (event) => { const q = event.target.value; setSearchQuery(q); debounce(() => searchPayment(userData, q, setPaymentData), 300)(); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!moneyFor || !total || !date) return alert(t('null_err_payment'));
    setLoading(true);
    if (isGuest()) {
      addMockData('payment', { money_for: moneyFor, total, date, notes });
      setPaymentAdded(`${moneyFor} added successfully`); setMoneyFor(''); setTotal(''); setDate(''); setNotes(''); fetchPayments(); setLoading(false); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-payment/`, { user: userData.user_name, money_for: moneyFor, total, date, notes });
      setPaymentAdded(`${moneyFor} added successfully`); setMoneyFor(''); setTotal(''); setDate(''); setNotes(''); fetchPayments();
    } catch { alert('Error adding payment.'); } finally { setLoading(false); }
  };

  const savePayment = async (id) => {
    if (isGuest()) { updateMockData('payment', id, editPaymentValue); setEditPaymentId(null); fetchPayments(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-payment/`, { id, ...editPaymentValue }); fetchPayments(); setEditPaymentId(null); } catch { alert('Error editing payment.'); }
  };

  const deletePayment = async (id) => {
    if (isGuest()) { deleteMockData('payment', id); fetchPayments(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-payment/`, { data: { id } }); fetchPayments(); } catch { alert('Error deleting payment.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('payments')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <InputField placeholder={t('moneyFor')} type="text" value={moneyFor} onChange={(e) => setMoneyFor(e.target.value)} />
            <InputField placeholder={t('total')} type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>
          <div className="Row">
            <InputField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <InputField placeholder={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {paymentAdded && <div className="SuccessMsg">{paymentAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('addPayment')}</Button></div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('payments')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchPayments} value={searchQuery} onChange={handleSearchChange} />
            <Table>
              <TableHeader><TableRow>
                <TableHead>{t('moneyFor')}</TableHead><TableHead>{t('total')}</TableHead>
                <TableHead>{t('date')}</TableHead><TableHead>{t('notes')}</TableHead><TableHead>{t('actions')}</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {paymentData.map((pay, i) => (
                  <TableRow key={i}>
                    <TableCell>{editPaymentId === pay.id ? <InputField type="text" value={editPaymentValue.money_for} onChange={(e) => setEditPaymentValue({ ...editPaymentValue, money_for: e.target.value })} /> : pay.money_for}</TableCell>
                    <TableCell>{editPaymentId === pay.id ? <InputField type="number" value={editPaymentValue.total} onChange={(e) => setEditPaymentValue({ ...editPaymentValue, total: e.target.value })} /> : pay.total}</TableCell>
                    <TableCell>{editPaymentId === pay.id ? <InputField type="date" value={editPaymentValue.date} onChange={(e) => setEditPaymentValue({ ...editPaymentValue, date: e.target.value })} /> : pay.date}</TableCell>
                    <TableCell>{editPaymentId === pay.id ? <InputField type="text" value={editPaymentValue.notes} onChange={(e) => setEditPaymentValue({ ...editPaymentValue, notes: e.target.value })} /> : pay.notes}</TableCell>
                    <TableCell>
                      {editPaymentId === pay.id
                        ? <Button className="success" onClick={() => savePayment(pay.id)}>{t('save')}</Button>
                        : <Button onClick={() => { setEditPaymentId(pay.id); setEditPaymentValue({ ...pay }); }}>{t('edit')}</Button>}
                      <Button className="danger" onClick={() => deletePayment(pay.id)}>{t('delete')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}
  .ItemsContainer{width:46vw;height:auto;min-height:36vh;}
  .Row{display:flex;justify-content:center;align-items:center;margin:6px 0;flex-wrap:wrap;}
  .SuccessMsg{text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.4em 1em;margin:0 1em;}
  .LoaderRow{display:flex;justify-content:center;margin:0.5em 0;}
  .PageFooter{margin-top:1.5em;display:flex;justify-content:center;}
  .dataScreen{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:92vw;max-height:82vh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5em;overflow-y:auto;z-index:1001;box-shadow:var(--shadow-lg);}
  .dataScreenHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:1em;}
  .dataScreenTitle{font-size:1rem;font-weight:600;color:var(--text-primary);}
  @media(max-width:768px){.ItemsContainer{width:88vw;}.dataScreen{width:96vw;}}
`;

export default Payments;
