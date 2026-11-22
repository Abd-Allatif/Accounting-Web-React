import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';

function Login() {
  const { t } = useTranslation();
  const { setAuth, setGuest } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_guest');
  }, []);

  const handleGuestLogin = () => {
    setGuest(() => navigate('/main'));
  };

  const submitData = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    if (!identifier || !password) {
      setError('Identifier and password are required');
      setLoading(false);
      return;
    }
    try {
      const data = await login(identifier, password);
      if (data.access) {
        const userData = {
          user_name: data.user?.user_name || identifier,
          email: data.user?.email || '',
          issatup: data.user?.issatup || false,
          budget: data.user?.budget || 0,
        };
        setAuth(data.access, data.refresh, userData);
        navigate(data.user?.issatup ? '/main' : '/setup-account');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <Card className="w-full max-w-md mx-auto animate-[cardIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dark flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/20">
            A
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">Accountify</span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-1">{t('login')}</h2>
          <p className="text-text-secondary text-sm">Welcome back — sign in to continue</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form className="space-y-4" onSubmit={submitData}>
          <div className="space-y-2">
            <Input
              label={t('emailOrUserName')}
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.toLowerCase())}
              placeholder="Email or username"
              required
            />
            <Input
              label={t('password')}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-end mt-2">
            <button type="button" className="text-xs text-brand-accent hover:text-brand-accent-light underline" onClick={() => navigate('/reset-pass')}>
              {t('forgotPassword')}
            </button>
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            {t('login')}
          </Button>

          <Button type="button" variant="outline" className="w-full mt-3" onClick={() => navigate('/register')}>
            {t('signUp')}
          </Button>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider text-text-muted">
            <span className="bg-bg-card px-2 border border-border">{t('or')}</span>
          </div>
        </div>

        <Button type="button" variant="secondary" className="w-full" onClick={handleGuestLogin} loading={loading}>
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Guest Demo Login
        </Button>
      </Card>
    </div>
  );
}

export default Login;
