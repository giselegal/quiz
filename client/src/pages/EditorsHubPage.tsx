
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EditorNavigation } from '@/components/editors/EditorNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Target, 
  TrendingUp,
  Users,
  Settings,
  FileText
} from 'lucide-react';
import { ROUTES } from '@/utils/routes';

const EditorsHubPage: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const workflows = [
    {
      title: 'Editor Unificado',
      description: 'Criar quiz + página de resultado + página de vendas',
      icon: Rocket,
      path: ROUTES.UNIFIED_EDITOR,
      color: 'bg-blue-600'
    }
  ];

  return (
    <div className="editors-hub-page min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hub de Editores
              </h1>
              <p className="text-gray-600 mt-2">
                Editor unificado para o projeto
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isDemoMode && (
                <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Modo Demo
                </span>
              )}
              
              {user && (
                <span className="text-sm text-gray-600">
                  Usuário: <strong>{user.userName}</strong>
                </span>
              )}
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Voltar ao Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Workflows Principais */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Editor Disponível
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;
              
              return (
                <Card
                  key={workflow.path}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(workflow.path)}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${workflow.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workflow.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {workflow.description}
                  </p>
                  
                  <Button className="w-full">
                    Começar
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Navegação Detalhada */}
        <EditorNavigation />

        {/* Estatísticas Rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="text-sm text-gray-600">Editor Ativo</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Acesso Direto</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">SPA</div>
                <div className="text-sm text-gray-600">Arquitetura</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorsHubPage;
