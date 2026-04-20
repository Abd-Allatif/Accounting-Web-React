import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchCustomer, getIncome } from '../../services/BackendServices';
import { addMockData, deleteMockData, updateMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Moneyincome() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState('');
  const [customerData, setcustomerData] = useState([]);
  const [income, setincome] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [incomeAdded, setincomeAdded] = useState('');
  const [incomeData, setincomeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editIncomeID, setEditIncomeID] = useState(null);
  const [editIncomeValue, setEditIncomeValue] = useState('');
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchIncomes = () => getIncome(userData, setincomeData);
  useEffect(() => { fetchIncomes(); }, []);

  const searchForCustomer = async (query = '') => searchCustomer(userData, query, setcustomerData);
  const debouncedFetchCustomer = useCallback(debounce(searchForCustomer, 300), []);
  const handleSearchCustomers = (e) => { const q = e.target.value; setSearchCustomers(q); debouncedFetchCustomer(q); if (!q) setcustomerData([]); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!searchCustomers || !income || !date) return alert(t('null_err_fill_all'));
    setLoading(true);
    if (isGuest()) {
      addMockData('incomes', { customer_name: searchCustomers, income, date_of_income: date, notes });
      setincomeAdded(`${income} added successfully`); setSearchCustomers(''); setincome(''); setDate(''); setNotes(''); fetchIncomes(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-income/`, { user: userData.user_name, customer_name: searchCustomers, income, date_of_income: date, notes });
      setincomeAdded(`${income} added successfully`); setSearchCustomers(''); setincome(''); setDate(''); setNotes(''); fetchIncomes();
      setTimeout(() => setShowAddModal(false), 1000);
    } catch { alert('Error adding income.'); } finally { setLoading(false); }
  };

  const editIncome = async (incomeKey) => {
    if (!editIncomeValue) return alert(t('null_err_fill_all'));
    if (isGuest()) { updateMockData('incomes', incomeKey, { income: editIncomeValue }); setEditIncomeID(null); fetchIncomes(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-incomes/`, { id: incomeKey, income: editIncomeValue }); fetchIncomes(); setEditIncomeID(null); } catch { alert('Error editing income.'); }
  };

  const deleteIncome = async (incomeKey) => {
    if (isGuest()) { deleteMockData('incomes', incomeKey); fetchIncomes(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-incomes/`, { data: { id: incomeKey } }); fetchIncomes(); } catch { alert('Error deleting income.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('moneyIncome')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('moneyIncome')}</h2>
            <Button className="success AddBtn" onClick={() => { setincomeAdded(''); setShowAddModal(true); }}>
              + {t('addincome')}
            </Button>
          </div>

          <div className="TableSection">
            <SearchField onClick={fetchIncomes} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="TableScrollWrapper">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{t('customer')}</TableHead><TableHead>{t('income')}</TableHead>
                  <TableHead>{t('date')}</TableHead><TableHead>{t('notes')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {incomeData.map((inc, i) => (
                    <TableRow key={i}>
                      <TableCell>{inc.customer_name}</TableCell>
                      <TableCell>{editIncomeID === inc.id ? <InputField type="number" value={editIncomeValue} onChange={(e) => setEditIncomeValue(e.target.value)} /> : inc.income}</TableCell>
                      <TableCell>{inc.date_of_income}</TableCell>
                      <TableCell>{inc.notes}</TableCell>
                      <TableCell>
                        {editIncomeID === inc.id
                          ? <Button className="success" onClick={() => editIncome(inc.id)}>{t('save')}</Button>
                          : <Button onClick={() => { setEditIncomeID(inc.id); setEditIncomeValue(inc.income); }}>{t('edit')}</Button>}
                        <Button className="danger" onClick={() => deleteIncome(inc.id)}>{t('delete')}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="ModalOverlay" onClick={(e) => e.target.className === 'ModalOverlay' && setShowAddModal(false)}>
            <Card className="AddModalCard">
              <div className="ModalHeader">
                <h3 className="ModalTitle">{t('addincome')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row typeField">
                  <InputField placeholder={t('customer')} type="text" value={searchCustomers} onChange={handleSearchCustomers} />
                  {searchCustomers && customerData.length > 0 && (
                    <div className="dropdown">
                      {customerData.map((c, i) => <div key={i} className="dropdown-item" onClick={() => { setSearchCustomers(c.customer_name); setcustomerData([]); }}>{c.customer_name}</div>)}
                    </div>
                  )}
                </div>
                <div className="Row">
                  <InputField placeholder={t('income')} type="number" value={income} onChange={(e) => setincome(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField placeholder={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                {incomeAdded && <div className="SuccessMsg">{incomeAdded}</div>}
                <div className="Row"><Button className="accent" onClick={send_data}>{t('addincome')}</Button></div>
                {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
              </div>
            </Card>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container { display:flex;flex-direction:column;min-height:100vh; }
  
  .MainContent {
    flex: 1; padding: 2em; margin-top: 60px; max-width: 1400px; width: 100%; align-self: center; display: flex; flex-direction: column; gap: 1.5em;
  }
  
  .PageHeader { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1em; }
  .PageTitle { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin: 0; }
  .AddBtn { font-weight: 600; padding: 0.6em 1.2em; font-size: 0.95rem; }

  .TableSection { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 1.5em; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1em; flex: 1; min-height: 0; }
  .TableScrollWrapper { overflow-x: auto; flex: 1; border-radius: var(--radius-md); }

  .ModalOverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1em; animation: fadeIn 0.2s ease; }
  .AddModalCard { width: 450px; max-width: 100%; padding: 1.5em; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
  .ModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5em; }
  .ModalTitle { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin: 0; }
  .CloseBtn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s ease; }
  .CloseBtn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
  .ModalBody { display: flex; flex-direction: column; gap: 1em; }
  
  .Row { display:flex;justify-content:center;align-items:center; width: 100%; }
  .Row > * { width: 100%; }
  .typeField { position: relative; }
  .dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--bg-elevated); border: 1px solid var(--border-hover); border-radius: var(--radius-sm); z-index: 1000; max-height: 160px; overflow-y: auto; box-shadow: var(--shadow-md); }
  .dropdown-item { padding: 0.65em 1em; cursor: pointer; color: var(--text-secondary); font-size: 0.875rem; transition: background 100ms; &:hover { background: rgba(99,102,241,0.1); color: var(--text-primary); } }
  
  .SuccessMsg { text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.6em 1em; }
  .LoaderRow { display:flex;justify-content:center;margin:0.5em 0; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  @media(max-width:768px) { 
    .MainContent { padding: 1em; padding-top: 2em; margin-top: 50px; }
    .PageHeader { flex-direction: column; align-items: flex-start; gap: 1em; }
    .AddBtn { width: 100%; }
    .TableSection { padding: 1em; }
  }
`;

export default Moneyincome;
