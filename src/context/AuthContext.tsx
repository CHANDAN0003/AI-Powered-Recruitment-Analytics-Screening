import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { email: string; name?: string; role?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (token: string, user?: User, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; } catch(e){ return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) localStorage.setItem('authToken', token); else localStorage.removeItem('authToken');
  }, [token]);

  const login = (t: string, u?: User, remember = false) => {
    setToken(t);
    if (u) setUser(u);
    if (remember && u) localStorage.setItem('currentUser', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
