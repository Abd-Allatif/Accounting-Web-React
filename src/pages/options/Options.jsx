import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import apiClient, { isGuest } from '../../services/apiClient';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

function Options() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const username = userData?.user_name || 'guest';

  const downloadFile = async (endpoint, filename, type) => {
    if (isGuest()) {
      setError('Demo Mode: Downloads not available.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiClient.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setSuccess(`Downloaded ${filename}`);
    } catch {
      setError('Error downloading file.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isGuest()) {
      setError('Demo Mode: Uploads not available.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.post(`/upload-excel/${username}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      e.target.value = '';
      setSuccess('Excel file uploaded successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('options')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[480px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('dataManagement')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-primary">{t('downloadExcel')}</span>
              <Button variant="outline" size="sm" onClick={() => downloadFile(`/export-excel/${username}/`, 'data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')} loading={loading}>
                {t('download')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary">{t('downloadPdf')}</span>
              <Button variant="outline" size="sm" onClick={() => downloadFile(`/export-pdf/${username}/`, 'data.pdf', 'application/pdf')} loading={loading}>
                {t('download')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary">{t('uploadExcel')}</span>
              <input type="file" accept=".xlsx,.xls,.csv" className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-primary hover:file:bg-brand-accent-light" onChange={handleExcelUpload} disabled={isGuest()} />
            </div>
          </div>
        </Card>

        <Card className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('accountSettings')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-primary">{t('username')}:</span>
              <span className="text-text-muted">{username || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary">{t('guestMode')}:</span>
              <span className={`text-text-muted font-medium ${isGuest() ? 'text-brand-accent' : 'text-brand-accent-light'}`}>
                {isGuest() ? t('enabled') : t('disabled')}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_data');
                localStorage.removeItem('is_guest');
                window.location.href = '/';
              }
            }}>
              {t('logout')}
            </Button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Options;
