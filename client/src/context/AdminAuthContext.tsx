import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';

interface AdminUser {
  email: string;
  authenticated: boolean;
  loginTime: Date;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'consultoria@giselegalvao.com.br',
  passwordHash: '$2b$10$aQdAk3NDJMhNUTuKAXaYk.4Q/I/.klvK2vB0ytfItGNPYLn/035Ka'
};

const isSessionValid = (loginTime: Date): boolean => {
  const now = new Date();
  const sessionDuration = 24 * 60 * 60 * 1000;
  return (now.getTime() - loginTime.getTime()) < sessionDuration;
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedSession = sessionStorage.getItem('adminSession');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          const loginTime = new Date(session.loginTime);
          
          if (session.email === ADMIN_CREDENTIALS.email && isSessionValid(loginTime)) {
            setAdminUser({
              email: session.email,
              authenticated: true,
              loginTime: loginTime
            });
          } else {
            sessionStorage.removeItem('adminSession');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão admin:', error);
        sessionStorage.removeItem('adminSession');
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (email !== ADMIN_CREDENTIALS.email) {
        setIsLoading(false);
        return false;
      }

      const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
      
      if (isPasswordValid) {
        const loginTime = new Date();
        const user: AdminUser = {
          email: email,
          authenticated: true,
          loginTime: loginTime
        };

        setAdminUser(user);
        
        sessionStorage.setItem('adminSession', JSON.stringify({
          email: email,
          loginTime: loginTime.toISOString()
        }));

        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login admin:', error);
      setIsLoading(false);
      return false;
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('adminSession');
  };

  const isAdminAuthenticated = adminUser?.authenticated === true && 
    adminUser.loginTime && 
    isSessionValid(adminUser.loginTime);

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      isAdminAuthenticated, 
      adminLogin, 
      adminLogout, 
      isLoading 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
