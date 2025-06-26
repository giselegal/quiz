
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  userName: string;
  email?: string;
  role?: string;
}

interface AuthData {
  user: User | null;
  token?: string;
}

interface AuthContextType {
  authData: AuthData | null;
  user: User | null;
  login: (name: string, email?: string) => void;
  logout: () => void;
  checkAuth: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário demo para desenvolvimento
const DEMO_USER: User = {
  userName: 'Demo User',
  email: 'demo@example.com',
  role: 'admin'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Verificar se existe usuário salvo
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedName) {
      const userData: User = { userName: savedName };
      if (savedEmail) userData.email = savedEmail;
      if (savedRole) userData.role = savedRole;
      
      setAuthData({ user: userData });
    } else {
      // Se não há usuário salvo, ativar modo demo
      setAuthData({ user: DEMO_USER });
      setIsDemoMode(true);
    }
  }, []);

  const login = (name: string, email?: string) => {
    const userData: User = { userName: name };
    
    if (email) {
      userData.email = email;
      localStorage.setItem('userEmail', email);
    }
    
    const savedRole = localStorage.getItem('userRole') || 'admin';
    userData.role = savedRole;
    
    setAuthData({ user: userData });
    setIsDemoMode(false);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', savedRole);
  };

  const logout = () => {
    setAuthData({ user: DEMO_USER });
    setIsDemoMode(true);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  const checkAuth = () => {
    // Manter estado atual
  };

  return (
    <AuthContext.Provider value={{ 
      authData, 
      user: authData?.user || null,
      login, 
      logout, 
      checkAuth,
      isDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
