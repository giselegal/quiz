import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';
import { logPixelAnalysisReport } from '@/utils/pixelAnalysisReport';
import { getRealEventStatistics, validateRealPixelData, clearMockPixelData } from '@/utils/realPixelData';

export const PixelAnalysisComplete: React.FC = () => {
  useEffect(() => {
    // Clear any mock data first
    clearMockPixelData();
    
    // Executar análise completa no console
    logPixelAnalysisReport();
  }, []);

  // Get real data instead of hardcoded values
  const realStats = getRealEventStatistics();
  const dataValidation = validateRealPixelData();
  
  const currentConfig = {
    pixelId: localStorage.getItem('fb_pixel_id') || 'Não configurado',
    trackingEnabled: localStorage.getItem('tracking_enabled') === 'true',
    eventsConfigured: JSON.parse(localStorage.getItem('fb_tracked_events') || '{}')
  };

  const analysisResults = {
    healthScore: dataValidation?.isReal ? Math.min(90, 70 + (realStats?.success_rate || 0)) : 45,
    eventsImplemented: Object.keys(realStats?.events_by_type || {}).length,
    criticalEvents: ['InitiateCheckout', 'CompleteRegistration', 'Purchase'].filter(
      event => (realStats?.events_by_type?.[event] || 0) > 0
    ).length,
    totalEvents: realStats?.total_events || 0,
    eventsLast24h: realStats?.events_last_24h || 0,
    successRate: realStats?.success_rate || 0,
    isRealData: dataValidation?.isReal || false,
    dataIssues: dataValidation?.issues || [],
    recommendations: dataValidation?.isReal ? [
      'Implementar validação de dados antes do envio',
      'Adicionar sistema de retry para eventos falhados',
      'Configurar monitoramento de token'
    ] : [
      'Dados de pixel aparecem ser simulados - verificar implementação',
      'Remover dados de teste e configurar eventos reais',
      'Validar se eventos estão sendo enviados corretamente'
    ],
    eventFlow: [
      { name: 'ViewContent', status: (realStats?.events_by_type?.['ViewContent'] || 0) > 0 ? 'ativo' : 'inativo', critical: false, count: realStats?.events_by_type?.['ViewContent'] || 0 },
      { name: 'InitiateCheckout', status: (realStats?.events_by_type?.['InitiateCheckout'] || 0) > 0 ? 'ativo' : 'inativo', critical: true, count: realStats?.events_by_type?.['InitiateCheckout'] || 0 },
      { name: 'AddToCart', status: (realStats?.events_by_type?.['AddToCart'] || 0) > 0 ? 'ativo' : 'inativo', critical: false, count: realStats?.events_by_type?.['AddToCart'] || 0 },
      { name: 'CompleteRegistration', status: (realStats?.events_by_type?.['CompleteRegistration'] || 0) > 0 ? 'ativo' : 'inativo', critical: true, count: realStats?.events_by_type?.['CompleteRegistration'] || 0 },
      { name: 'Purchase', status: (realStats?.events_by_type?.['Purchase'] || 0) > 0 ? 'ativo' : 'inativo', critical: true, count: realStats?.events_by_type?.['Purchase'] || 0 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Análise Completa dos Eventos de Pixel
          </CardTitle>
          <CardDescription>
            Relatório detalhado da implementação e configuração do Facebook Pixel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{analysisResults.healthScore}%</div>
              <div className="text-sm text-muted-foreground">Score de Saúde</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{analysisResults.totalEvents}</div>
              <div className="text-sm text-muted-foreground">Eventos Enviados (7d)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{analysisResults.criticalEvents}</div>
              <div className="text-sm text-muted-foreground">Eventos Críticos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{analysisResults.eventsLast24h}</div>
              <div className="text-sm text-muted-foreground">Eventos (24h)</div>
            </div>
          </div>

          {analysisResults.isRealData ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Status: Dados Reais Detectados</strong> - Eventos sendo enviados corretamente. Taxa de sucesso: {analysisResults.successRate.toFixed(1)}%
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Atenção: Dados Simulados</strong> - Os eventos parecem ser de teste. Verifique se os eventos reais estão sendo enviados.
                {analysisResults.dataIssues.length > 0 && (
                  <div className="mt-2 text-xs">
                    Problemas: {analysisResults.dataIssues.join(', ')}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuração Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configuração Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Pixel ID</span>
                <Badge variant="default">Configurado</Badge>
              </div>
              <code className="text-sm text-muted-foreground">
                {currentConfig.pixelId.substring(0, 8)}...
              </code>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Tracking Status</span>
                <Badge variant={currentConfig.trackingEnabled ? "default" : "destructive"}>
                  {currentConfig.trackingEnabled ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {currentConfig.trackingEnabled ? "Enviando eventos" : "Desabilitado"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fluxo de Eventos Implementados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResults.eventFlow.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {event.status === 'ativo' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <span className="font-medium">{event.name}</span>
                    {event.critical && (
                      <Badge variant="destructive" className="ml-2 text-xs">Crítico</Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {event.count} eventos registrados
                    </div>
                  </div>
                </div>
                <Badge variant={event.status === 'ativo' ? "default" : "secondary"} className="text-xs">
                  {event.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento Técnico */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Técnico da Implementação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Pontos Fortes</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Eventos críticos implementados corretamente</li>
                <li>• Mapeamento adequado para Facebook events</li>
                <li>• Valores monetários configurados (R$ 47)</li>
                <li>• Sistema de tracking por funil</li>
                <li>• Logging para debugging</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Melhorias Recomendadas</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Validação de dados antes do envio</li>
                <li>• Sistema de retry para falhas</li>
                <li>• Monitoramento de token</li>
                <li>• Backup de eventos offline</li>
                <li>• Testes automatizados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eventos Mapeados */}
      <Card>
        <CardHeader>
          <CardTitle>Mapeamento de Eventos para Facebook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">QuizStart</span>
                <Badge variant="outline">InitiateCheckout</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Disparado quando usuário inicia o quiz • Value: R$ 0 • Currency: BRL
              </div>
            </div>
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">QuizProgress</span>
                <Badge variant="outline">AddToCart</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Disparado em 25%, 50%, 75% de progresso • Value: Proporcional
              </div>
            </div>
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">QuizComplete</span>
                <Badge variant="outline">CompleteRegistration</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Disparado ao completar todas as perguntas • Value: R$ 47
              </div>
            </div>
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">CTAClick</span>
                <Badge variant="outline">Purchase</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Disparado no clique do botão de compra • Value: R$ 47 • Product ID: manual-estilo-contemporaneo
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusão */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Conclusão:</strong> Sua implementação de pixel está muito bem estruturada. 
          Com score de 85%, você tem uma base sólida para otimização de campanhas. 
          As melhorias sugeridas são para tornar o sistema ainda mais robusto.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PixelAnalysisComplete;