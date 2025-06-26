
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#FAF9F7]">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Total de Quizzes
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Conversões
                  </h3>
                  <p className="text-3xl font-bold text-green-600">89%</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Visitantes
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">1,234</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Revenue
                  </h3>
                  <p className="text-3xl font-bold text-orange-600">R$ 45.6k</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Atividade Recente
                </h2>
                <p className="text-gray-600">
                  Dashboard principal do sistema. Use a navegação lateral para acessar diferentes seções.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
