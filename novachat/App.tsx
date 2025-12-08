import React, { useState, useEffect } from 'react';
import { AuthState, User } from './types';
import { mockDb } from './services/mockDb';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChatPage } from './pages/ChatPage';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [currentRoute, setCurrentRoute] = useState<'login' | 'register' | 'chat'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Check for persisted session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem('nova_session_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            token: 'restored-token',
          });
          setCurrentRoute('chat');
        } catch (e) {
          console.error("Failed to restore session", e);
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = (user: User, token: string) => {
    setAuthState({ user, isAuthenticated: true, token });
    localStorage.setItem('nova_session_user', JSON.stringify(user));
    setCurrentRoute('chat');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('nova_session_user');
    setCurrentRoute('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {currentRoute === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onNavigateRegister={() => setCurrentRoute('register')} 
        />
      )}
      {currentRoute === 'register' && (
        <Register 
          onRegister={handleLogin} 
          onNavigateLogin={() => setCurrentRoute('login')} 
        />
      )}
      {currentRoute === 'chat' && authState.user && (
        <ChatPage 
          currentUser={authState.user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
