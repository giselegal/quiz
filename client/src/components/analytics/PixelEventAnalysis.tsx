import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, RefreshCcw, Activity, TrendingUp } from 'lucide-react';

interface PixelAnalysisResult {
  isConfigured: boolean;
  pixelId: string;
  eventsEnabled: string[];
  eventsDisabled: string[];
  issues: string[];
  recommendations: string[];
  healthScore: number;
}

export const PixelEventAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<PixelAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzePixelConfiguration = () => {
    setLoading(true);
    
    try {
      const pixelId = localStorage.getItem('fb_pixel_id') || '';
      const trackingEnabled = localStorage.getItem('tracking_enabled') === 'true';
      const trackedEvents = JSON.parse(localStorage.getItem('fb_tracked_events') || '{}');
      
      const eventNames = {
        quiz_start: 'Início do Quiz',
        quiz_answer: 'Respostas do Quiz',
        quiz_complete: 'Conclusão do Quiz',
        result_view: 'Visualização de Resultado',
        lead_generated: 'Captura de Lead',
        sale: 'Vendas',
        button_click: 'Cliques em Botões'
      };

      const eventsEnabled = Object.entries(trackedEvents)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => eventNames[key as keyof typeof eventNames] || key);

      const eventsDisabled = Object.entries(eventNames)
        .filter(([key, _]) => !trackedEvents[key])
        .map(([_, name]) => name);

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Verificar configuração básica
      if (!pixelId) {
        issues.push('ID do Facebook Pixel não configurado');
        recommendations.push('Configure o ID do Facebook Pixel nas configurações de analytics');
      }

      if (!trackingEnabled) {
        issues.push('Tracking do Facebook Pixel está desabilitado');
        recommendations.push('Habilite o tracking nas configurações de analytics');
      }

      // Verificar eventos críticos
      const criticalEvents = ['quiz_start', 'quiz_complete', 'lead_generated', 'sale'];
      const missingCriticalEvents = criticalEvents.filter(event => !trackedEvents[event]);
      
      if (missingCriticalEvents.length > 0) {
        issues.push(`Eventos críticos desabilitados: ${missingCriticalEvents.length}`);
        recommendations.push('Habilite todos os eventos críticos para melhor tracking de conversões');
      }

      // Verificar se o pixel está carregado
      if (typeof window !== 'undefined' && !window.fbq) {
        issues.push('Facebook Pixel não carregado no navegador');
        recommendations.push('Verifique se o script do Facebook Pixel está sendo carregado corretamente');
      }

      // Calcular score de saúde
      let healthScore = 100;
      if (!pixelId) healthScore -= 30;
      if (!trackingEnabled) healthScore -= 20;
      if (missingCriticalEvents.length > 0) healthScore -= (missingCriticalEvents.length * 10);
      if (typeof window !== 'undefined' && !window.fbq) healthScore -= 20;

      const result: PixelAnalysisResult = {
        isConfigured: pixelId !== '' && trackingEnabled,
        pixelId,
        eventsEnabled,
        eventsDisabled,
        issues,
        recommendations,
        healthScore: Math.max(0, healthScore)
      };

      setAnalysis(result);
    } catch (error) {
      console.error('Erro ao analisar configuração do pixel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzePixelConfiguration();
  }, []);

  if (loading) {
    return (
      <Card className="border-border/40 shadow-sm">
        <CardContent className="py-8 text-center">
          <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Analisando configuração do pixel...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-border/40 shadow-sm">
        <CardContent className="py-8 text-center">
          <XCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
          <p className="text-sm text-muted-foreground">Erro ao analisar configuração</p>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-4">
      {/* Score de saúde */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Análise de Eventos de Pixel</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Avaliação da configuração do Facebook Pixel
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getHealthVariant(analysis.healthScore)} className="text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                {analysis.healthScore}% Saudável
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={analyzePixelConfiguration}
              >
                <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                Reanalisar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status da configuração */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Status da Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              {analysis.pixelId ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Pixel ID Configurado</span>
            </div>
            <Badge variant={analysis.pixelId ? "default" : "destructive"} className="text-xs">
              {analysis.pixelId ? `ID: ${analysis.pixelId.slice(-6)}` : "Não configurado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              {analysis.isConfigured ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Tracking Habilitado</span>
            </div>
            <Badge variant={analysis.isConfigured ? "default" : "destructive"} className="text-xs">
              {analysis.isConfigured ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              {typeof window !== 'undefined' && window.fbq ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Script Carregado</span>
            </div>
            <Badge variant={typeof window !== 'undefined' && window.fbq ? "default" : "destructive"} className="text-xs">
              {typeof window !== 'undefined' && window.fbq ? "Carregado" : "Não carregado"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Eventos habilitados */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Eventos Habilitados ({analysis.eventsEnabled.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.eventsEnabled.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {analysis.eventsEnabled.map((event, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {event}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum evento habilitado</p>
          )}
        </CardContent>
      </Card>

      {/* Eventos desabilitados */}
      {analysis.eventsDisabled.length > 0 && (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eventos Desabilitados ({analysis.eventsDisabled.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {analysis.eventsDisabled.map((event, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problemas encontrados */}
      {analysis.issues.length > 0 && (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Problemas Encontrados ({analysis.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <Alert key={index} className="py-2">
                <AlertDescription className="text-xs">
                  {issue}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      {analysis.recommendations.length > 0 && (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recomendações de Melhoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                {recommendation}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PixelEventAnalysis;