import styled from 'styled-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchBy_only_Supplies, getDispatches } from '../../services/BackendServices';
import { BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip, Drawer, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function DispatchSupplies() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [buy_price, setbuy_price] = useState('');
  const [dispatch_date, setdispatch_date] = useState('');
  const [reason, setreason] = useState('');
  const [dispatchAdded, setdispatchAdded] = useState('');
  const [dispatchData, setdispatchData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchDispatched = () => getDispatches(userData, setdispatchData);
  useEffect(() => { fetchDispatched(); }, []);

  const searchForSupplies = async (query = '') => searchBy_only_Supplies(userData, query, setSuppliesData);
  const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
  const handleSearchSupplies = (e) => { const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q); if (!q) setSuppliesData([]); };

  const send_data = async (e) => {
    e.preventDefault();
    if (!searchSupplies || !countity || !buy_price || !dispatch_date) return alert(t('null_err_fill_all'));
    if (isGuest()) return alert('Demo Mode: Data cannot be added.');
    try {
      await apiClient.post(`/${userData.user_name}/dispatch-supplies/`, { user: userData.user_name, supply: searchSupplies, countity, buy_price, dispatch_date, reason });
      setdispatchAdded(`${searchSupplies} added successfully`);
      setSearchSupplies(''); setCountity(''); setbuy_price(''); setdispatch_date(''); setreason(''); fetchDispatched();
    } catch { alert('Error adding dispatch.'); }
  };

  const deleteDispatch = async (id) => {
    if (isGuest()) return alert('Demo Mode: Data cannot be deleted.');
    try { await apiClient.delete(`/${userData.user_name}/edit-dispatches/`, { data: { id } }); fetchDispatched(); } catch { alert('Error deleting dispatch.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('dispatchSupplies')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <div className="supplyField">
              <InputField placeholder={t('supply')} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
              {searchSupplies && suppliesData.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                  {suppliesData.map((s, i) => <div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setSuppliesData([]); }}>{s.supply_name}</div>)}
                </div>
              )}
            </div>
          </div>
          <div className="Row">
            <InputField placeholder={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
            <InputField placeholder={t('buyPrice')} type="number" value={buy_price} onChange={(e) => setbuy_price(e.target.value)} />
            <InputField placeholder={t('date')} type="date" value={dispatch_date} onChange={(e) => setdispatch_date(e.target.value)} />
          </div>
          <div className="Row">
            <InputField placeholder={t('reason')} type="text" value={reason} onChange={(e) => setreason(e.target.value)} />
          </div>
          {dispatchAdded && <div className="SuccessMsg">{dispatchAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('dispatch')}</Button><ToolTip text={t('dispatch_warn')} /></div>
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('dispatchSupplies')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchDispatched} value="" onChange={() => {}} />
            <Table>
              <TableHeader><TableRow>
                <TableHead>{t('supply')}</TableHead><TableHead>{t('countity')}</TableHead>
                <TableHead>{t('buyPrice')}</TableHead><TableHead>{t('date')}</TableHead>
                <TableHead>{t('reason')}</TableHead><TableHead>{t('actions')}</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {dispatchData.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.supply}</TableCell><TableCell>{d.countity}</TableCell><TableCell>{d.buy_price}</TableCell>
                    <TableCell>{d.dispatch_date}</TableCell><TableCell>{d.reason}</TableCell>
                    <TableCell><Button className="danger" onClick={() => deleteDispatch(d.id)}>{t('delete')}</Button></TableCell>
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
  .ItemsContainer{width:46vw;height:auto;min-height:42vh;}
  .Row{display:flex;justify-content:center;align-items:center;margin:6px 0;flex-wrap:wrap;}
  .supplyField{position:relative;}
  .dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--bg-elevated);border:1px solid var(--border-hover);border-radius:var(--radius-sm);z-index:1000;max-height:160px;overflow-y:auto;box-shadow:var(--shadow-md);}
  .dropdown-item{padding:0.65em 1em;cursor:pointer;color:var(--text-secondary);font-size:0.875rem;transition:background 100ms;&:hover{background:rgba(99,102,241,0.1);color:var(--text-primary);}}
  .SuccessMsg{text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.4em 1em;margin:0 1em;}
  .PageFooter{margin-top:1.5em;display:flex;justify-content:center;}
  .dataScreen{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90vw;max-height:82vh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5em;overflow-y:auto;z-index:1001;box-shadow:var(--shadow-lg);}
  .dataScreenHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:1em;}
  .dataScreenTitle{font-size:1rem;font-weight:600;color:var(--text-primary);}
  @media(max-width:768px){.ItemsContainer{width:88vw;}.dataScreen{width:96vw;}}
`;

export default DispatchSupplies;
