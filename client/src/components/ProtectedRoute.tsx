
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authData, isDemoMode } = useAuth();

  // Permitir acesso se há dados de auth OU se está em modo demo
  if (!authData && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
