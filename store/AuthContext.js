'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (tokenValue, userData) => {
      localStorage.setItem('auth_token', tokenValue);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setToken(tokenValue);
      setUser(userData);
      if (userData.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
