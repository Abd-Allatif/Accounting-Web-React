import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../services/authService';
import { isValidEmail, isValidPassword } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

function ResetPassword() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendNewPassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !resetCode || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, digit, and special character');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(username, email, resetCode, newPassword);
      setSuccess('Password reset successfully. You can now login with your new password.');
      setUsername('');
      setEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while resetting your password.');
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
          <h2 className="text-2xl font-bold text-text-primary mb-1">{t('resetPassword')}</h2>
          <p className="text-text-secondary text-sm">Enter your details and reset code to set a new password</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form className="space-y-4" onSubmit={sendNewPassword}>
          <div className="space-y-2">
            <Input
              label={t('userName')}
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Username"
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
              label={t('resetPasswordCode')}
              type="text"
              autoComplete="off"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="Reset code"
              required
            />
            <Input
              label={t('newPassword')}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {t('reset')}
          </Button>

          <Button type="button" variant="outline" className="w-full mt-3" onClick={() => window.location.href = '/'}>
            {t('back')}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ResetPassword;
