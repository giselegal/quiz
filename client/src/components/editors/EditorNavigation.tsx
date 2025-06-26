
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Palette,
  Zap,
  Edit,
  Monitor
} from 'lucide-react';
import { ROUTES } from '@/utils/routes';

interface EditorRoute {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const editorRoutes: EditorRoute[] = [
  {
    path: ROUTES.UNIFIED_EDITOR,
    label: 'Editor Unificado',
    icon: Layers,
    description: 'Editor completo com Quiz + Resultado + Vendas'
  }
];

export const EditorNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="editor-navigation bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Editores Disponíveis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {editorRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;
            
            return (
              <Button
                key={route.path}
                variant={isActive ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => navigate(route.path)}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{route.label}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {route.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditorNavigation;
