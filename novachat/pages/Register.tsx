import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { mockDb } from '../services/mockDb';
import { User } from '../types';
import { MessageSquare } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User, token: string) => void;
  onNavigateLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await mockDb.register(username, email, password, gender);
      onRegister(response.user, response.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-offset-1 transition-all duration-200 outline-none bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};