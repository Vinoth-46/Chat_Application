import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { mockDb } from '../services/mockDb';
import { User } from '../types';
import { MessageSquare } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
  onNavigateRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate real backend API call with password check
      const response = await mockDb.login(email, password);
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3 text-primary-600">
            <MessageSquare size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to NovaChat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="alice@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </button>
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
                Demo Accounts (Pass: password123):<br/>
                alice@example.com<br/>
                bob@example.com
            </p>
        </div>
      </div>
    </div>
  );
};