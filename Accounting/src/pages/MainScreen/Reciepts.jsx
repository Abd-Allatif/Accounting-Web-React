import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchBy_only_Supplies, getReciepts } from '../../services/BackendServices';
import { addMockData, deleteMockData, updateMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Reciepts() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [buy_price, setbuy_price] = useState('');
  const [purchase_date, setpurchase_date] = useState('');
  const [reason, setreason] = useState('');
  const [receiptAdded, setreceiptAdded] = useState('');
  const [receiptData, setreceiptData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReceiptID, setEditReceiptID] = useState(null);
  const [editReceiptValue, setEditReceiptValue] = useState({});
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchReceipts = () => getReciepts(userData, setreceiptData);
  useEffect(() => { fetchReceipts(); }, []);

  const searchForSupplies = async (query = '') => searchBy_only_Supplies(userData, query, setSuppliesData);
  const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
  const handleSearchSupplies = (e) => { const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q); if (!q) setSuppliesData([]); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!searchSupplies || !countity || !buy_price || !purchase_date) return alert(t('null_err_fill_all'));
    setLoading(true);
    if (isGuest()) {
      addMockData('receipts', { supply: searchSupplies, countity, buy_price, purchase_date, reason, total: countity * buy_price });
      setreceiptAdded(`${searchSupplies} receipt added`); setSearchSupplies(''); setCountity(''); setbuy_price(''); setpurchase_date(''); setreason(''); fetchReceipts(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-receipts/`, { user: userData.user_name, supply: searchSupplies, countity, buy_price, purchase_date, reason });
      setreceiptAdded(`${searchSupplies} receipt added`); setSearchSupplies(''); setCountity(''); setbuy_price(''); setpurchase_date(''); setreason(''); fetchReceipts();
      setTimeout(() => setShowAddModal(false), 1000);
    } catch { alert('Error adding receipt.'); } finally { setLoading(false); }
  };

  const editReceipt = async (receiptKey) => {
    if (isGuest()) { updateMockData('receipts', receiptKey, { ...editReceiptValue, total: editReceiptValue.countity * editReceiptValue.buy_price }); setEditReceiptID(null); fetchReceipts(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-receipts/`, { id: receiptKey, countity: editReceiptValue.countity, buy_price: editReceiptValue.buy_price }); fetchReceipts(); setEditReceiptID(null); } catch { alert('Error editing receipt.'); }
  };

  const deleteReceipt = async (receiptKey) => {
    if (isGuest()) { deleteMockData('receipts', receiptKey); fetchReceipts(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-receipts/`, { data: { id: receiptKey } }); fetchReceipts(); } catch { alert('Error deleting receipt.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('reciepts')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('reciepts')}</h2>
            <Button className="success AddBtn" onClick={() => { setreceiptAdded(''); setShowAddModal(true); }}>
              + {t('addReceipt')}
            </Button>
          </div>

          <div className="TableSection">
            <SearchField onClick={fetchReceipts} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="TableScrollWrapper">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{t('supply')}</TableHead><TableHead>{t('countity')}</TableHead>
                  <TableHead>{t('buyPrice')}</TableHead><TableHead>{t('date')}</TableHead>
                  <TableHead>{t('total')}</TableHead><TableHead>{t('reason')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {receiptData.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.supply}</TableCell>
                      <TableCell>{editReceiptID === r.id ? <InputField type="number" value={editReceiptValue.countity} onChange={(e) => setEditReceiptValue({...editReceiptValue, countity: e.target.value})} /> : r.countity}</TableCell>
                      <TableCell>{editReceiptID === r.id ? <InputField type="number" value={editReceiptValue.buy_price} onChange={(e) => setEditReceiptValue({...editReceiptValue, buy_price: e.target.value})} /> : r.buy_price}</TableCell>
                      <TableCell>{r.purchase_date}</TableCell>
                      <TableCell>{r.total}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>
                        {editReceiptID === r.id
                          ? <Button className="success" onClick={() => editReceipt(r.id)}>{t('save')}</Button>
                          : <Button onClick={() => { setEditReceiptID(r.id); setEditReceiptValue({countity: r.countity, buy_price: r.buy_price}); }}>{t('edit')}</Button>}
                        <Button className="danger" onClick={() => deleteReceipt(r.id)}>{t('delete')}</Button>
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
                <h3 className="ModalTitle">{t('addReceipt')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row typeField">
                  <InputField placeholder={t('supply')} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
                  {searchSupplies && suppliesData.length > 0 && (
                    <div className="dropdown">
                      {suppliesData.map((s, i) => <div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setSuppliesData([]); }}>{s.supply_name}</div>)}
                    </div>
                  )}
                </div>
                <div className="Row">
                  <InputField placeholder={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField placeholder={t('buyPrice')} type="number" value={buy_price} onChange={(e) => setbuy_price(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField type="date" value={purchase_date} onChange={(e) => setpurchase_date(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField placeholder={t('reason')} type="text" value={reason} onChange={(e) => setreason(e.target.value)} />
                </div>
                {receiptAdded && <div className="SuccessMsg">{receiptAdded}</div>}
                <div className="Row"><Button className="accent" onClick={send_data}>{t('addReceipt')}</Button></div>
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

export default Reciepts;
