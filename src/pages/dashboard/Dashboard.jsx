import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import apiClient, { isGuest } from '../../services/apiClient';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { FundCard } from '../../components/layout/FundCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellsFund, setSellsFund] = useState(0);
  const [permanentFund, setPermanentFund] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState('');

  const username = user?.user_name || 'guest';

  const fetchFunds = async () => {
    if (isGuest()) {
      setSellsFund(1000);
      setPermanentFund(5000);
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.get(`/${username}/money-funds/`);
      setSellsFund(res.data.sells_fund || 0);
      setPermanentFund(res.data.permanant_fund || 0);
    } catch (err) {
      setError('Failed to load funds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [username]);

  const quickStats = [
    { label: t('sellsFund'), value: formatCurrency(sellsFund), variant: 'sells' },
    { label: t('permaFund'), value: formatCurrency(permanentFund), variant: 'perma' },
    { label: 'Total', value: formatCurrency(sellsFund + permanentFund), variant: 'default' },
  ];

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('dashboard')}
        onMenuClick={() => setSidebarOpen(true)}
        showLogout
      />
      <div className="flex">
        <main className="flex-1 ml-0 md:ml-80 pt-4 pb-8 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size="lg" />
              <p className="mt-3 text-text-secondary">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {error && <Alert variant="error">{error}</Alert>}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {quickStats.map((stat, i) => (
                  <Card key={i} className="p-5">
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{t('recentActivity')}</h3>
                    <Button variant="ghost" size="sm">{t('viewAll')}</Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('type')}</TableHead>
                          <TableHead>{t('date')}</TableHead>
                          <TableHead>{t('amount')}</TableHead>
                          <TableHead>{t('status')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-text-muted py-4">
                              No recent activity
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentActivity.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.type}</TableCell>
                              <TableCell>{formatDate(item.date)}</TableCell>
                              <TableCell>{formatCurrency(item.amount)}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                                  {item.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">{t('quickActions')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="primary" className="w-full" onClick={() => navigate('/main/supplies')}>
                      {t('addSupply')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/main/customers')}>
                      {t('addCustomer')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/main/sell-customers')}>
                      {t('recordSell')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/main/payments')}>
                      {t('recordPayment')}
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
