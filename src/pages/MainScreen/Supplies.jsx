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
  const [showTable, setShowTable] = useState(false);
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
      setSupplyAdded(`${supplyName} added successfully`); setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice(''); fetchSupplies(); setLoading(false); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/manage-supplies/`, { user: userData.user_name, supply_name: supplyName, type, unit, countity, buy_price: buyPrice, sell_price: sellPrice });
      setSupplyAdded(`${supplyName} added successfully`); setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice(''); fetchSupplies();
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
        <Card className="ItemsContainer">
          <div className="Row">
            <InputField placeholder={t('supplyName')} type="text" value={supplyName} onChange={(e) => setSupplyName(e.target.value)} />
            <div className="typeField">
              <InputField placeholder={t('type')} type="text" value={type} onChange={handleTypeChange} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />
              {showDropdown && typesData.length > 0 && (
                <div className="dropdown">{typesData.map((t_item, i) => <div key={i} className="dropdown-item" onClick={() => selectType(t_item.type_name)}>{t_item.type_name}</div>)}</div>
              )}
            </div>
          </div>
          <div className="Row">
            <select className="StyledSelect" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="Unit">{t('unit')}</option>
              <option value="kg">kg</option>
              <option value="m">m</option>
              <option value="pcs">pcs</option>
            </select>
            <InputField placeholder={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
            <InputField placeholder={t('buyPrice')} type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
            <InputField placeholder={t('sellPrice')} type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
          </div>
          {supplyAdded && <div className="SuccessMsg">{supplyAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('addSupply')}</Button></div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('supplies')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchSupplies} value={searchQuery} onChange={handleSearchChange} />
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
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}
  .ItemsContainer{width:56vw;height:auto;min-height:36vh;}
  .Row{display:flex;justify-content:center;align-items:center;margin:6px 0;flex-wrap:wrap;gap:0.5em;}
  .StyledSelect{padding:0.75em 1em;border-radius:var(--radius-md);border:1px solid var(--border);background:var(--bg-elevated);color:var(--text-primary);font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 200ms;&:focus{border-color:var(--accent);}}
  .typeField{position:relative;}
  .dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--bg-elevated);border:1px solid var(--border-hover);border-radius:var(--radius-sm);z-index:1000;max-height:160px;overflow-y:auto;box-shadow:var(--shadow-md);}
  .dropdown-item{padding:0.65em 1em;cursor:pointer;color:var(--text-secondary);font-size:0.875rem;transition:background 100ms;&:hover{background:rgba(99,102,241,0.1);color:var(--text-primary);}}
  .SuccessMsg{text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.4em 1em;margin:0 1em;}
  .LoaderRow{display:flex;justify-content:center;margin:0.5em 0;}
  .PageFooter{margin-top:1.5em;display:flex;justify-content:center;}
  .dataScreen{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95vw;max-height:82vh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5em;overflow-y:auto;z-index:1001;box-shadow:var(--shadow-lg);}
  .dataScreenHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:1em;}
  .dataScreenTitle{font-size:1rem;font-weight:600;color:var(--text-primary);}
  @media(max-width:768px){.ItemsContainer{width:92vw;}.dataScreen{width:98vw;}}
`;

export default Supplies;
