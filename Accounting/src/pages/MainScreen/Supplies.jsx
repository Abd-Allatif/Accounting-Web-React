import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getSupplies, getTypes, debounce, searchType, searchBy_only_Supplies } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Supplies() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliesData, setSuppliesData] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [supplyName, setSupplyName] = useState('');
  const [unit, setUnit] = useState('Unit');
  const [type, setType] = useState('');
  const [countity, setCountity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [supplyAdded, setSupplyAdded] = useState('');
  const [editSupplyId, setEditSupplyId] = useState(null);
  const [editSupplyValue, setEditSupplyValue] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchSupplies = () => getSupplies(userData, setSuppliesData);
  const fetchTypes = () => getTypes(userData, setTypesData);
  useEffect(() => { fetchSupplies(); fetchTypes(); }, []);

  const handleSearchChange = (event) => { const q = event.target.value; setSearchQuery(q); debounce(() => searchBy_only_Supplies(userData, q, setSuppliesData), 300)(); };
  const handleTypeChange = (event) => { const q = event.target.value; setType(q); setShowDropdown(true); debounce(() => searchType(userData, q, setTypesData), 300)(); };
  const selectType = (typeName) => { setType(typeName); setShowDropdown(false); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!supplyName || !type || !unit || !countity || !buyPrice || !sellPrice) return alert(t('null_err_supply'));
    setLoading(true);
    if (isGuest()) {
      addMockData('supplies', { supply_name: supplyName, type, unit, countity, buy_price: buyPrice, sell_price: sellPrice });
      setSupplyAdded(`${supplyName} added successfully`); setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice(''); fetchSupplies(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-supplies/`, { user: userData.user_name, supply_name: supplyName, type, unit, countity, buy_price: buyPrice, sell_price: sellPrice });
      setSupplyAdded(`${supplyName} added successfully`); setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice(''); fetchSupplies();
      setTimeout(() => setShowAddModal(false), 1000);
    } catch { alert('Error adding supply.'); } finally { setLoading(false); }
  };

  const saveSupply = async (supplyKey) => {
    if (isGuest()) { updateMockData('supplies', supplyKey, editSupplyValue); setEditSupplyId(null); fetchSupplies(); return; }
    try { await apiClient.put(`/${userData.user_name}/edit-supplies/`, { old_supply: supplyKey, ...editSupplyValue }); fetchSupplies(); setEditSupplyId(null); } catch { alert('Error editing supply.'); }
  };

  const deleteSupply = async (supplyKey) => {
    if (isGuest()) { deleteMockData('supplies', supplyKey); fetchSupplies(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-supplies/`, { data: { supply: supplyKey } }); fetchSupplies(); } catch { alert('Error deleting supply.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('supplies')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('supplies')}</h2>
            <Button className="success AddBtn" onClick={() => { setSupplyAdded(''); setShowAddModal(true); }}>
              + {t('addSupply')}
            </Button>
          </div>

          <div className="TableSection">
            <SearchField onClick={fetchSupplies} value={searchQuery} onChange={handleSearchChange} />
            <div className="TableScrollWrapper">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{t('supplies')}</TableHead><TableHead>{t('type')}</TableHead>
                  <TableHead>{t('unit')}</TableHead><TableHead>{t('countity')}</TableHead>
                  <TableHead>{t('buyPrice')}</TableHead><TableHead>{t('sellPrice')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {suppliesData.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="text" value={editSupplyValue.supply_name} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, supply_name: e.target.value })} /> : s.supply_name}</TableCell>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="text" value={editSupplyValue.type} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, type: e.target.value })} /> : s.type}</TableCell>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="text" value={editSupplyValue.unit} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, unit: e.target.value })} /> : s.unit}</TableCell>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="number" value={editSupplyValue.countity} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, countity: e.target.value })} /> : s.countity}</TableCell>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="number" value={editSupplyValue.buy_price} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, buy_price: e.target.value })} /> : s.buy_price}</TableCell>
                      <TableCell>{editSupplyId === s.supply_name ? <InputField type="number" value={editSupplyValue.sell_price} onChange={(e) => setEditSupplyValue({ ...editSupplyValue, sell_price: e.target.value })} /> : s.sell_price}</TableCell>
                      <TableCell>
                        {editSupplyId === s.supply_name
                          ? <Button className="success" onClick={() => saveSupply(s.supply_name)}>{t('save')}</Button>
                          : <Button onClick={() => { setEditSupplyId(s.supply_name); setEditSupplyValue({ ...s }); }}>{t('edit')}</Button>}
                        <Button className="danger" onClick={() => deleteSupply(s.supply_name)}>{t('delete')}</Button>
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
                <h3 className="ModalTitle">{t('addSupply')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row">
                  <InputField placeholder={t('supplyName')} type="text" value={supplyName} onChange={(e) => setSupplyName(e.target.value)} />
                </div>
                <div className="Row typeField">
                  <InputField placeholder={t('type')} type="text" value={type} onChange={handleTypeChange} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />
                  {showDropdown && typesData.length > 0 && (
                    <div className="dropdown">{typesData.map((t_item, i) => <div key={i} className="dropdown-item" onClick={() => selectType(t_item.type_name)}>{t_item.type_name}</div>)}</div>
                  )}
                </div>
                <div className="Row FlexRow">
                  <select className="StyledSelect" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="Unit">{t('unit')}</option>
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="pcs">pcs</option>
                  </select>
                  <InputField placeholder={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                </div>
                <div className="Row FlexRow">
                  <InputField placeholder={t('buyPrice')} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                  <InputField placeholder={t('sellPrice')} type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                </div>
                {supplyAdded && <div className="SuccessMsg">{supplyAdded}</div>}
                <div className="Row"><Button className="accent" onClick={send_data}>{t('addSupply')}</Button></div>
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
  .FlexRow { display: flex; gap: 0.5em; }
  
  .StyledSelect { padding:0.75em 1em; border-radius:var(--radius-md); border:1px solid var(--border); background:var(--bg-elevated); color:var(--text-primary); font-size:0.9rem; font-family:inherit; outline:none; transition:border-color 200ms; width: 100px; &:focus{border-color:var(--accent);} }
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

export default Supplies;
