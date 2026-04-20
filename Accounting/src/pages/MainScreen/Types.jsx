import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getTypes, debounce, searchType } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Types() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typesData, setTypesData] = useState([]);
  const [type, setType] = useState('');
  const [typeAdded, setTypeAdded] = useState('');
  const [editType, setEditType] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchTypes = () => getTypes(userData, setTypesData);
  useEffect(() => { fetchTypes(); }, []);
  const handleSearchChange = (event) => { const q = event.target.value; setSearchQuery(q); debounce(() => searchType(userData, q, setTypesData), 300)(); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!type) return alert(t('null_err_types'));
    setLoading(true);
    if (isGuest()) { addMockData('types', { type_name: type }); setTypeAdded(`${type} added successfully`); setType(''); fetchTypes(); setLoading(false); return; }
    try {
      await apiClient.post(`/${userData.user_name}/types`, { user: userData.user_name, types: type });
      setTypeAdded(`${type} added successfully`); setType(''); fetchTypes();
    } catch { alert('Error adding type.'); } finally { setLoading(false); }
  };

  const updateType = async (typeKey) => {
    if (!editTypeValue) return alert(t('null_err_types'));
    if (isGuest()) { updateMockData('types', typeKey, { type_name: editTypeValue }); setEditType(null); fetchTypes(); return; }
    try {
      await apiClient.put(`/${userData.user_name}/types_edit`, { old_type: typeKey, new_type: editTypeValue });
      fetchTypes(); setEditType(null);
    } catch { alert('Error editing type.'); }
  };

  const deleteType = async (typeKey) => {
    if (isGuest()) { deleteMockData('types', typeKey); fetchTypes(); return; }
    try { await apiClient.delete(`/${userData.user_name}/types_edit`, { data: { type: typeKey } }); fetchTypes(); } catch { alert('Error deleting type.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('types')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row"><InputField placeholder={t('type')} type="text" value={type} onChange={(e) => setType(e.target.value)} /></div>
          {typeAdded && <div className="SuccessMsg">{typeAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('addType')}</Button></div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('types')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchTypes} value={searchQuery} onChange={handleSearchChange} />
            <Table>
              <TableHeader><TableRow><TableHead>{t('types')}</TableHead><TableHead>{t('actions')}</TableHead></TableRow></TableHeader>
              <TableBody>
                {typesData.map((t_item, i) => (
                  <TableRow key={i}>
                    <TableCell>{editType === t_item.type_name ? <InputField type="text" value={editTypeValue} onChange={(e) => setEditTypeValue(e.target.value)} /> : t_item.type_name}</TableCell>
                    <TableCell>
                      {editType === t_item.type_name
                        ? <Button className="success" onClick={() => updateType(t_item.type_name)}>{t('save')}</Button>
                        : <Button onClick={() => { setEditType(t_item.type_name); setEditTypeValue(t_item.type_name); }}>{t('edit')}</Button>}
                      <Button className="danger" onClick={() => deleteType(t_item.type_name)}>{t('delete')}</Button>
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
  .ItemsContainer{width:38vw;height:auto;min-height:28vh;}
  .Row{display:flex;justify-content:center;align-items:center;margin:6px 0;}
  .SuccessMsg{text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.4em 1em;margin:0 1em;}
  .LoaderRow{display:flex;justify-content:center;margin:0.5em 0;}
  .PageFooter{margin-top:1.5em;display:flex;justify-content:center;}
  .dataScreen{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:70vw;max-height:82vh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5em;overflow-y:auto;z-index:1001;box-shadow:var(--shadow-lg);}
  .dataScreenHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:1em;}
  .dataScreenTitle{font-size:1rem;font-weight:600;color:var(--text-primary);}
  @media(max-width:768px){.ItemsContainer{width:88vw;}.dataScreen{width:96vw;}}
`;

export default Types;
