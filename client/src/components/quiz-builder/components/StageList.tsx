import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Eye } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  type: 'quiz' | 'result' | 'offer';
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
}

interface StageListProps {
  stages: Stage[];
  onStageSelect: (stageId: string) => void;
  onCreateStage: () => void;
}

export const StageList: React.FC<StageListProps> = ({
  stages,
  onStageSelect,
  onCreateStage
}) => {
  const getStatusColor = (status: Stage['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: Stage['type']) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'result': return 'Resultado';
      case 'offer': return 'Oferta';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Etapas do Funil</CardTitle>
        <Button onClick={onCreateStage} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma etapa criada ainda.</p>
              <p className="text-sm">Clique em "Nova Etapa" para começar.</p>
            </div>
          ) : (
            stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onStageSelect(stage.id)}
                style={{ outline: 'none' }}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium">{stage.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getStatusColor(stage.status)}>
                        {stage.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {getTypeLabel(stage.type)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {stage.lastModified}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle preview
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStageSelect(stage.id);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
