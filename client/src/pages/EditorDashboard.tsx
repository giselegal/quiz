
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Eye, Edit } from 'lucide-react';

const EditorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor Dashboard</h1>
          <p className="text-gray-600">Gerencie seus projetos de quiz e páginas de resultado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo Projeto</h3>
              <Plus className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">Crie um novo quiz ou página de resultado</p>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editor Visual</h3>
              <Edit className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">Acesse o editor visual avançado</p>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Abrir Editor
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Configurações</h3>
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">Configure suas preferências</p>
            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
