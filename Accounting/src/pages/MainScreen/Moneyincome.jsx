import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getIncome, debounce, searchIncome } from '../../services/BackendServices';
import { addMockData, deleteMockData, updateMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function MoneyIncome() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [moneyFrom, setMoneyFrom] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [incomeAdded, setIncomeAdded] = useState('');
  const [editIncomeId, setEditIncomeId] = useState(null);
  const [editIncomeValue, setEditIncomeValue] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchIncome = () => getIncome(userData, setIncomeData);
  useEffect(() => { fetchIncome(); }, []);
  const handleSearchChange = (event) => { const q = event.target.value; setSearchQuery(q); debounce(() => searchIncome(userData, q, setIncomeData), 300)(); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!moneyFrom || !total || !date) return alert(t('null_err_income'));
    setLoading(true);
    if (isGuest()) {
      addMockData('income', { money_from: moneyFrom, total, date, notes });
      setIncomeAdded(`${moneyFrom} added successfully`); setMoneyFrom(''); setTotal(''); setDate(''); setNotes(''); fetchIncome(); setLoading(false); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-income/`, { user: userData.user_name, money_from: moneyFrom, total, date, notes });
      setIncomeAdded(`${moneyFrom} added successfully`); setMoneyFrom(''); setTotal(''); setDate(''); setNotes(''); fetchIncome();
    } catch { alert('Error adding income.'); } finally { setLoading(false); }
  };

  const saveIncome = async (id) => {
    if (isGuest()) { updateMockData('income', id, editIncomeValue); setEditIncomeId(null); fetchIncome(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-income/`, { id, ...editIncomeValue }); fetchIncome(); setEditIncomeId(null); } catch { alert('Error editing income.'); }
  };

  const deleteIncome = async (id) => {
    if (isGuest()) { deleteMockData('income', id); fetchIncome(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-income/`, { data: { id } }); fetchIncome(); } catch { alert('Error deleting income.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('moneyIncome')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <InputField placeholder={t('moneyFrom')} type="text" value={moneyFrom} onChange={(e) => setMoneyFrom(e.target.value)} />
            <InputField placeholder={t('total')} type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>
          <div className="Row">
            <InputField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <InputField placeholder={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {incomeAdded && <div className="SuccessMsg">{incomeAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('addIncome')}</Button></div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('moneyIncome')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchIncome} value={searchQuery} onChange={handleSearchChange} />
            <Table>
              <TableHeader><TableRow>
                <TableHead>{t('moneyFrom')}</TableHead><TableHead>{t('total')}</TableHead>
                <TableHead>{t('date')}</TableHead><TableHead>{t('notes')}</TableHead><TableHead>{t('actions')}</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {incomeData.map((inc, i) => (
                  <TableRow key={i}>
                    <TableCell>{editIncomeId === inc.id ? <InputField type="text" value={editIncomeValue.money_from} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, money_from: e.target.value })} /> : inc.money_from}</TableCell>
                    <TableCell>{editIncomeId === inc.id ? <InputField type="number" value={editIncomeValue.total} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, total: e.target.value })} /> : inc.total}</TableCell>
                    <TableCell>{editIncomeId === inc.id ? <InputField type="date" value={editIncomeValue.date} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, date: e.target.value })} /> : inc.date}</TableCell>
                    <TableCell>{editIncomeId === inc.id ? <InputField type="text" value={editIncomeValue.notes} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, notes: e.target.value })} /> : inc.notes}</TableCell>
                    <TableCell>
                      {editIncomeId === inc.id
                        ? <Button className="success" onClick={() => saveIncome(inc.id)}>{t('save')}</Button>
                        : <Button onClick={() => { setEditIncomeId(inc.id); setEditIncomeValue({ ...inc }); }}>{t('edit')}</Button>}
                      <Button className="danger" onClick={() => deleteIncome(inc.id)}>{t('delete')}</Button>
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

export default MoneyIncome;
