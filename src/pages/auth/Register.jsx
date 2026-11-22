import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register } from '../../services/authService';
import { generateResetCode, isValidEmail, isValidPassword } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetCode, setShowResetCode] = useState(false);
  const [resetCode, setResetCode] = useState('');

  const submitData = async (event) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, digit, and special character');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const code = generateResetCode(10);

    try {
      await register(username, email, password, code);
      setResetCode(code);
      setShowResetCode(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const returnLoginPage = () => {
    setResetCode('');
    setShowResetCode(false);
    navigate('/');
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
          <h2 className="text-2xl font-bold text-text-primary mb-1">{t('signUp')}</h2>
          <p className="text-text-secondary text-sm">Create your account to get started</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {showResetCode && resetCode && (
          <Alert variant="warning" title={t('dontLoseIt')}>
            <p>Your reset code is: <strong className="font-mono text-brand-amber">{resetCode}</strong></p>
            <p className="mt-2 text-xs text-text-secondary">{t('resetcode')}</p>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={submitData}>
          <div className="space-y-2">
            <Input
              label={t('userName')}
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Choose a username"
              required
            />
            <Input
              label={t('email')}
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="you@example.com"
              required
            />
            <Input
              label={t('password')}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              label={t('confirmPassword')}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            {t('signUp')}
          </Button>

          <Button type="button" variant="outline" className="w-full mt-3" onClick={returnLoginPage}>
            {t('back')}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Register;
