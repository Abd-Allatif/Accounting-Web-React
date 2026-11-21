import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exceluploader, Drawer, BackGround, Card, Button, TopBar, Documentation } from '../../components';
import apiClient, { isGuest } from '../../services/apiClient';
import { useTranslation } from 'react-i18next';

function Options() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const downloadFile = async (endpoint, filename, type) => {
    if (isGuest()) return alert('Demo Mode: Downloads not available.');
    try {
      const response = await apiClient.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type }));
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    } catch { alert('Error downloading file.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('options')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <label className="RowLabel">{t('downloadData')}</label>
            <Button onClick={() => downloadFile(`/export-excel/${userData.user_name}/`, 'data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}>{t('excel')}</Button>
            <Button onClick={() => downloadFile(`/export-pdf/${userData.user_name}/`, 'data.pdf', 'application/pdf')}>{t('pdf')}</Button>
          </div>
          <div className="Row">
            <label className="RowLabel">{t('uploadData')}</label>
            {!isGuest() ? <Exceluploader username={userData.user_name} /> : <span className="DemoDisabled">Disabled in Demo</span>}
          </div>
          <div className="Row">
            <label className="RowLabel">{t('Doc')}</label>
            <Button onClick={() => setDocOpen(true)}>{t('openDoc')}</Button>
          </div>
        </Card>
        {docOpen && <Documentation docOpen={docOpen} setDocOpen={setDocOpen} />}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}
  .ItemsContainer{width:40vw;height:auto;min-height:30vh;display:flex;flex-direction:column;gap:1.5em;padding:2em;}
  .Row{display:flex;align-items:center;gap:1em;color:var(--text-primary);}
  .RowLabel{font-weight:600;min-width:120px;color:var(--text-primary);}
  .DemoDisabled{color:var(--text-secondary);font-style:italic;}
  @media(max-width:768px){.ItemsContainer{width:88vw;}}
`;

export default Options;
