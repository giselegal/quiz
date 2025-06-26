import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import { analyzePixelEvents, getPixelHealthScore, getPixelRecommendations } from '@/utils/pixelAnalysis';

export const PixelHealthDashboard: React.FC = () => {
  const [healthScore, setHealthScore] = useState<number>(0);
  const [validations, setValidations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const updateAnalysis = () => {
    const score = getPixelHealthScore();
    const events = analyzePixelEvents();
    const recs = getPixelRecommendations();
    
    setHealthScore(score);
    setValidations(events);
    setRecommendations(recs);
  };

  useEffect(() => {
    updateAnalysis();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Saúde do Facebook Pixel</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Análise da configuração e eventos de pixel
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getHealthVariant(healthScore)} className="text-sm">
              {healthScore}% Saudável
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={updateAnalysis}
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status dos eventos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status dos Eventos</h4>
          <div className="space-y-1">
            {validations.map((validation, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded text-xs">
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{validation.eventName}</span>
                </div>
                <Badge variant={validation.isValid ? "default" : "destructive"} className="text-[10px]">
                  {validation.isValid ? "OK" : "Erro"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Recomendações de Melhoria
            </h4>
            <div className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <Alert key={index} className="py-2">
                  <AlertDescription className="text-xs">
                    {recommendation}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Resumo de eventos críticos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Eventos Críticos</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 border rounded">
              <div className="font-medium">Quiz Start</div>
              <div className="text-muted-foreground">Início do funil</div>
            </div>
            <div className="p-2 border rounded">
              <div className="font-medium">Lead</div>
              <div className="text-muted-foreground">Captura de email</div>
            </div>
            <div className="p-2 border rounded">
              <div className="font-medium">Purchase</div>
              <div className="text-muted-foreground">Conversão final</div>
            </div>
            <div className="p-2 border rounded">
              <div className="font-medium">ViewContent</div>
              <div className="text-muted-foreground">Visualização de resultado</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixelHealthDashboard;