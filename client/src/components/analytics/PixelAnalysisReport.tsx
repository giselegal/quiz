import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, Info, TrendingUp, Target } from 'lucide-react';
import { analyzePixelEvents, getPixelHealthScore, getPixelRecommendations } from '@/utils/pixelAnalysis';

export const PixelAnalysisReport: React.FC = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    setLoading(true);
    
    // Simular análise completa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const healthScore = getPixelHealthScore();
    const validations = analyzePixelEvents();
    const recommendations = getPixelRecommendations();
    
    // Análise de eventos enviados
    const eventLog = JSON.parse(localStorage.getItem('fb_pixel_event_log') || '[]');
    const last24Hours = eventLog.filter((event: any) => {
      const eventTime = new Date(event.timestamp);
      const now = new Date();
      return (now.getTime() - eventTime.getTime()) < 24 * 60 * 60 * 1000;
    });

    const eventTypes = ['QuizStart', 'QuizAnswer', 'QuizComplete', 'ResultView', 'Lead', 'Purchase'];
    const eventCounts = eventTypes.reduce((acc, type) => {
      acc[type] = last24Hours.filter((event: any) => event.type === type).length;
      return acc;
    }, {} as Record<string, number>);

    setAnalysis({
      healthScore,
      validations,
      recommendations,
      eventCounts,
      totalEvents: last24Hours.length,
      pixelId: localStorage.getItem('fb_pixel_id') || 'Não configurado',
      isActive: localStorage.getItem('tracking_enabled') === 'true'
    });
    
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Analisando eventos de pixel...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise Completa do Facebook Pixel
          </CardTitle>
          <CardDescription>
            Relatório detalhado da configuração e performance dos eventos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${analysis.healthScore >= 80 ? 'text-green-600' : analysis.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {analysis.healthScore}%
              </div>
              <div className="text-sm text-muted-foreground">Saúde Geral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.totalEvents}</div>
              <div className="text-sm text-muted-foreground">Eventos (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.validations.filter((v: any) => v.isValid).length}</div>
              <div className="text-sm text-muted-foreground">Configurações OK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Melhorias</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status da Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              {analysis.isActive ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">Tracking Ativo</span>
            </div>
            <Badge variant={analysis.isActive ? "default" : "destructive"}>
              {analysis.isActive ? "Ativado" : "Desativado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Pixel ID</span>
            </div>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {analysis.pixelId.substring(0, 8)}...
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Eventos por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Eventos Registrados (Últimas 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(analysis.eventCounts).map(([eventType, count]) => (
              <div key={eventType} className="p-3 border rounded text-center">
                <div className="text-xl font-bold text-blue-600">{count as number}</div>
                <div className="text-sm text-muted-foreground">{eventType}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validações Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validações de Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.validations.map((validation: any, index: number) => (
            <div key={index} className="p-3 border rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium text-sm">{validation.eventName}</span>
                </div>
                <Badge variant={validation.isValid ? "default" : "destructive"} className="text-xs">
                  {validation.isValid ? "OK" : "Erro"}
                </Badge>
              </div>
              
              {validation.issues.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-red-600 font-medium mb-1">Problemas encontrados:</div>
                  {validation.issues.map((issue: string, i: number) => (
                    <div key={i} className="text-xs text-red-600 ml-4">• {issue}</div>
                  ))}
                </div>
              )}
              
              {validation.recommendations.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-blue-600 font-medium mb-1">Recomendações:</div>
                  {validation.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="text-xs text-blue-600 ml-4">• {rec}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plano de Ação */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Plano de Ação - Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.recommendations.map((recommendation: string, index: number) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {index + 1}. {recommendation}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conclusões */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conclusões e Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Status Geral:</h4>
            {analysis.healthScore >= 80 ? (
              <p className="text-sm text-green-700">
                ✅ Seu Facebook Pixel está bem configurado e funcionando corretamente. 
                Os eventos estão sendo enviados adequadamente para otimização de campanhas.
              </p>
            ) : analysis.healthScore >= 60 ? (
              <p className="text-sm text-yellow-700">
                ⚠️ Seu Facebook Pixel está funcionando, mas há algumas melhorias recomendadas 
                para otimizar o tracking e melhorar a performance das campanhas.
              </p>
            ) : (
              <p className="text-sm text-red-700">
                ❌ Existem problemas críticos na configuração do Facebook Pixel que precisam 
                ser corrigidos para garantir o tracking adequado de conversões.
              </p>
            )}
          </div>

          <Separator />

          <div className="text-center">
            <Button onClick={performAnalysis} variant="outline">
              Executar Nova Análise
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixelAnalysisReport;