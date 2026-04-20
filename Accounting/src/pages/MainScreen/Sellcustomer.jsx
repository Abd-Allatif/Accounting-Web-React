import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchCustomer, searchBy_only_Supplies, getCustomerSell } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function SellCustomer() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState('');
  const [customerData, setcustomerData] = useState([]);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [price, setPrice] = useState('');
  const [debt, setdebt] = useState('');
  const [paid, setPaid] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sellCustomerAdded, setsellCustomerAdded] = useState('');
  const [sellCustomerData, setsellCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSellID, setEditSellID] = useState(null);
  const [editsellData, setEditsellData] = useState({});
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const navigate = useNavigate();

  const fetchCustomerSell = () => getCustomerSell(userData, setsellCustomerData);
  useEffect(() => { fetchCustomerSell(); }, []);

  const searchForCustomer = async (q = '') => searchCustomer(userData, q, setcustomerData);
  const debouncedFetchCustomer = useCallback(debounce(searchForCustomer, 300), []);
  const handleSearchCustomers = (e) => { const q = e.target.value; setSearchCustomers(q); debouncedFetchCustomer(q); if (!q) setcustomerData([]); };

  const searchForSupplies = async (q = '') => searchBy_only_Supplies(userData, q, setSuppliesData);
  const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
  const handleSearchSupplies = (e) => { const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q); if (!q) setSuppliesData([]); };

  const send_data = async (e) => {
    e.preventDefault();
    if (!searchCustomers || !searchSupplies || !countity || !price || !debt || !paid || !date) return alert(t('null_err_fill_all'));
    setLoading(true);
    if (isGuest()) {
      addMockData('customer_sells', { customer_name: searchCustomers, supply: searchSupplies, countity, price, debt, paid, total: countity * price, date_of_buying: date, notes });
      setsellCustomerAdded(`${searchSupplies} added successfully`);
      setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setdebt(''); setPaid(''); setDate(''); setNotes(''); fetchCustomerSell(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/sell-customer/`, { user: userData.user_name, customer_name: searchCustomers, date_of_buying: date, supply: searchSupplies, price, countity, debt, paid, notes });
      setsellCustomerAdded(`${searchSupplies} added successfully`);
      setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setdebt(''); setPaid(''); setDate(''); setNotes(''); fetchCustomerSell();
      setTimeout(() => setShowAddModal(false), 1000);
    } catch { alert('Error adding entry.'); } finally { setLoading(false); }
  };

  const editCustomerSell = async (id) => {
    if (isGuest()) { updateMockData('customer_sells', id, { ...editsellData, total: editsellData.countity * editsellData.price }); setEditSellID(null); fetchCustomerSell(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-customer-sell/`, { ...editsellData }); fetchCustomerSell(); setEditSellID(null); } catch { alert('Error editing entry.'); }
  };

  const deleteCustomerSell = async (id) => {
    if (isGuest()) { deleteMockData('customer_sells', id); fetchCustomerSell(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-customer-sell/`, { data: { id } }); fetchCustomerSell(); } catch { alert('Error deleting entry.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('sellCustomer')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('sellCustomer')}</h2>
            <Button className="success AddBtn" onClick={() => { setsellCustomerAdded(''); setShowAddModal(true); }}>
              + {t('sellCustomerbtn')}
            </Button>
          </div>

          <div className="TableSection">
            <SearchField onClick={fetchCustomerSell} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="TableScrollWrapper">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{t('customer')}</TableHead><TableHead>{t('supply')}</TableHead>
                  <TableHead>{t('countity')}</TableHead><TableHead>{t('price')}</TableHead>
                  <TableHead>{t('total')}</TableHead><TableHead>{t('actions')}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {sellCustomerData.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{c.customer_name}</TableCell>
                      <TableCell>{c.supply}</TableCell>
                      <TableCell>{editSellID === c.id ? <InputField type="number" value={editsellData.countity} onChange={(e) => setEditsellData({...editsellData, countity: e.target.value})} /> : c.countity}</TableCell>
                      <TableCell>{editSellID === c.id ? <InputField type="number" value={editsellData.price} onChange={(e) => setEditsellData({...editsellData, price: e.target.value})} /> : c.price}</TableCell>
                      <TableCell>{c.total}</TableCell>
                      <TableCell>
                        {editSellID === c.id
                          ? <Button className="success" onClick={() => editCustomerSell(c.id)}>{t('save')}</Button>
                          : <Button onClick={() => { setEditSellID(c.id); setEditsellData({ ...c }); }}>{t('edit')}</Button>}
                        <Button className="danger" onClick={() => deleteCustomerSell(c.id)}>{t('delete')}</Button>
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
                <h3 className="ModalTitle">{t('sellCustomerbtn')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row FlexRow">
                  <div className="typeField" style={{ flex: 1 }}>
                    <InputField placeholder={t('customer')} type="text" value={searchCustomers} onChange={handleSearchCustomers} />
                    {searchCustomers && customerData.length > 0 && (
                      <div className="dropdown">{customerData.map((c, i) => <div key={i} className="dropdown-item" onClick={() => { setSearchCustomers(c.customer_name); setcustomerData([]); }}>{c.customer_name}</div>)}</div>
                    )}
                  </div>
                  <div className="supplyField" style={{ flex: 1 }}>
                    <InputField placeholder={t('supply')} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
                    {searchSupplies && suppliesData.length > 0 && (
                      <div className="dropdown">{suppliesData.map((s, i) => <div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setPrice(s.sell_price); setCountity(1); setSuppliesData([]); }}>{s.supply_name}</div>)}</div>
                    )}
                  </div>
                </div>
                <div className="Row FlexRow">
                  <InputField placeholder={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                  <InputField placeholder={t('price')} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="Row FlexRow">
                  <InputField placeholder={t('debt')} type="number" value={debt} onChange={(e) => setdebt(e.target.value)} />
                  <InputField placeholder={t('paid')} type="text" value={paid} onChange={(e) => setPaid(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField placeholder={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                {sellCustomerAdded && <div className="SuccessMsg">{sellCustomerAdded}</div>}
                <div className="Row"><Button className="accent" onClick={send_data}>{t('sellCustomerbtn')}</Button></div>
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
  .AddModalCard { width: 500px; max-width: 100%; padding: 1.5em; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
  .ModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5em; }
  .ModalTitle { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin: 0; }
  .CloseBtn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s ease; }
  .CloseBtn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
  .ModalBody { display: flex; flex-direction: column; gap: 1em; }
  
  .Row { display:flex;justify-content:center;align-items:center; width: 100%; }
  .Row > * { width: 100%; }
  .FlexRow { display: flex; gap: 0.5em; }
  
  .typeField, .supplyField { position: relative; }
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
    .FlexRow { flex-direction: column; gap: 1em; }
  }
`;

export default SellCustomer;
