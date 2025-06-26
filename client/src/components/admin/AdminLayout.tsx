import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout básico para componentes administrativos que não usam o novo AdminDashboard
 * Este componente será gradualmente descontinuado conforme migramos tudo para o novo dashboard
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7]">
      <header className="bg-white border-b px-6 py-3 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-[#432818]">
            Voltar ao Dashboard
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-[#8F7A6A]">
                Olá, <span className="font-medium">{user.userName}</span>
              </div>
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                {user.userName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t p-3 text-center text-sm text-[#8F7A6A]">
        <div className="container mx-auto">
          Admin © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
