import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { searchBy_only_Supplies } from '../../services/BackendServices';
import { addMockData, deleteMockData, getMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Inventory() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliesData, setSuppliesData] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [supplyName, setSupplyName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchInventories = async () => {
    if (isGuest()) return setInventories(getMockData('inventories'));
    try { const response = await apiClient.get(`/${userData.user_name}/generate-inventory/`); setInventories(response.data); } catch { alert('Error fetching inventories.'); }
  };
  useEffect(() => { fetchInventories(); }, []);

  const handleSupplyChange = (event) => { const query = event.target.value; setSupplyName(query); setShowDropdown(true); searchBy_only_Supplies(userData, query, setSuppliesData); };
  const selectSupply = (name) => { setSupplyName(name); setShowDropdown(false); };

  const generateInventory = async (event) => {
    event.preventDefault();
    if (!supplyName || !startDate || !endDate) return alert(t('null_err_inventory'));
    setLoading(true);
    if (isGuest()) {
      const newInv = { id: Date.now(), supply: supplyName, start_date: startDate, end_date: endDate, initial_countity: 100, final_countity: 80, initial_fund: 1000, final_fund: 1200, sales_countity: 20, sales_value: 200, purchase_countity: 0, purchase_value: 0, debt_countity: 5, unpaid_customers: 50, discrepancy: 0, dispatched_supply: 0, dispatched_value: 0, profits: 100, inventory_date: new Date().toISOString().split('T')[0] };
      addMockData('inventories', newInv); fetchInventories(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000); return;
    }
    try { await apiClient.post(`/${userData.user_name}/generate-inventory/`, { user: userData.user_name, supply_name: supplyName, start_date: startDate, end_date: endDate }); fetchInventories(); setTimeout(() => setShowAddModal(false), 1000); } catch { alert('Error generating inventory.'); } finally { setLoading(false); }
  };

  const deleteInventory = async (id) => {
    if (isGuest()) { deleteMockData('inventories', id); fetchInventories(); return; }
    try { await apiClient.delete(`/${userData.user_name}/generate-inventory/`, { data: { id } }); fetchInventories(); } catch { alert('Error deleting inventory.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('inventory')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('inventory')}</h2>
            <Button className="success AddBtn" onClick={() => { setShowAddModal(true); }}>
              + {t('generateInventory')}
            </Button>
          </div>

          <div className="TableSection">
            <div className="TableScrollWrapper">
              <Table>
                <TableHeader><TableRow><TableHead>{t('inventory')}</TableHead><TableHead>{t('actions')}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {inventories.map((inv, i) => (
                    <TableRow key={i}>
                      <TableCell>{inv.supply} ({inv.start_date} - {inv.end_date})</TableCell>
                      <TableCell>
                        <Button onClick={() => setSelectedInventory(inv)}>{t('show')}</Button>
                        <Button className="danger" onClick={() => deleteInventory(inv.id)}>{t('delete')}</Button>
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
                <h3 className="ModalTitle">{t('generateInventory')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row typeField">
                  <InputField placeholder={t('supply')} type="text" value={supplyName} onChange={handleSupplyChange} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />
                  {showDropdown && suppliesData.length > 0 && (
                    <div className="dropdown">{suppliesData.map((s, i) => <div key={i} className="dropdown-item" onClick={() => selectSupply(s.supply_name)}>{s.supply_name}</div>)}</div>
                  )}
                </div>
                <div className="Row FlexRow">
                  <InputField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <InputField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="Row"><Button className="accent" onClick={generateInventory}>{t('generateInventory')}</Button></div>
                {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
              </div>
            </Card>
          </div>
        )}

        {selectedInventory && (
          <div className="ModalOverlay" onClick={(e) => e.target.className === 'ModalOverlay' && setSelectedInventory(null)}>
            <div className="SubScreen">
              <div className="ModalHeader">
                <h3 className="ModalTitle">{t('inventory')} - {selectedInventory.supply}</h3>
                <button className="CloseBtn" onClick={() => setSelectedInventory(null)}>×</button>
              </div>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>{t('supply')}</TableHead><TableHead>{t('initialCountity')}</TableHead><TableHead>{t('finalCountity')}</TableHead>
                    <TableHead>{t('initialFund')}</TableHead><TableHead>{t('finalFund')}</TableHead><TableHead>{t('salesCountity')}</TableHead>
                    <TableHead>{t('sells_value')}</TableHead><TableHead>{t('purchaseCountity')}</TableHead><TableHead>{t('purchase_value')}</TableHead>
                    <TableHead>{t('debtCountity')}</TableHead><TableHead>{t('unPaidCustomers')}</TableHead><TableHead>{t('discrepancy')}</TableHead>
                    <TableHead>{t('dispatchedSupply')}</TableHead><TableHead>{t('dispatchedValue')}</TableHead><TableHead>{t('profits')}</TableHead>
                    <TableHead>{t('startDate')}</TableHead><TableHead>{t('endDate')}</TableHead><TableHead>{t('inventoryDate')}</TableHead>
                  </TableRow></TableHeader>
                  <TableBody><TableRow>
                    <TableCell>{selectedInventory.supply}</TableCell><TableCell>{selectedInventory.initial_countity}</TableCell><TableCell>{selectedInventory.final_countity}</TableCell>
                    <TableCell>{selectedInventory.initial_fund}</TableCell><TableCell>{selectedInventory.final_fund}</TableCell><TableCell>{selectedInventory.sales_countity}</TableCell>
                    <TableCell>{selectedInventory.sales_value}</TableCell><TableCell>{selectedInventory.purchase_countity}</TableCell><TableCell>{selectedInventory.purchase_value}</TableCell>
                    <TableCell>{selectedInventory.debt_countity}</TableCell><TableCell>{selectedInventory.unpaid_customers}</TableCell><TableCell>{selectedInventory.discrepancy}</TableCell>
                    <TableCell>{selectedInventory.dispatched_supply}</TableCell><TableCell>{selectedInventory.dispatched_value}</TableCell><TableCell className="accent">{selectedInventory.profits}</TableCell>
                    <TableCell>{selectedInventory.start_date}</TableCell><TableCell>{selectedInventory.end_date}</TableCell><TableCell>{selectedInventory.inventory_date}</TableCell>
                  </TableRow></TableBody>
                </Table>
              </div>
            </div>
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
  .SubScreen { width: 95vw; max-height: 85vh; background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5em; overflow-y: auto; box-shadow: var(--shadow-lg); animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
  
  .ModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5em; }
  .ModalTitle { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin: 0; }
  .CloseBtn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s ease; }
  .CloseBtn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
  .ModalBody { display: flex; flex-direction: column; gap: 1em; }
  
  .Row { display:flex;justify-content:center;align-items:center; width: 100%; }
  .Row > * { width: 100%; }
  .FlexRow { display: flex; gap: 0.5em; }
  
  .typeField { position: relative; }
  .dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--bg-elevated); border: 1px solid var(--border-hover); border-radius: var(--radius-sm); z-index: 1000; max-height: 160px; overflow-y: auto; box-shadow: var(--shadow-md); }
  .dropdown-item { padding: 0.65em 1em; cursor: pointer; color: var(--text-secondary); font-size: 0.875rem; transition: background 100ms; &:hover { background: rgba(99,102,241,0.1); color: var(--text-primary); } }
  
  .accent { color: var(--accent-light); font-weight: 700; }
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

export default Inventory;
