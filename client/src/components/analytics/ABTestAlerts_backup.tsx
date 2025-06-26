
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Bell,
  Settings,
  Mail,
  Smartphone,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';
import { getAnalyticsEvents } from '@/utils/analytics';
import { LANDING_PAGE_AB_TEST } from '@/utils/abtest';
import { toast } from '@/components/ui/use-toast';

interface AlertConfig {
  enabled: boolean;
  significanceThreshold: number;
  minimumSampleSize: number;
  emailNotifications: boolean;
  emailAddress: string;
  autoEndTest: boolean;
  maxDuration: number; // dias
}

interface ABTestAlert {
  id: string;
  type: 'significance_reached' | 'sample_size_warning' | 'duration_warning' | 'conversion_anomaly';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  variant?: 'A' | 'B';
  metric?: string;
  value?: number;
}

interface ABTestMetrics {
  variant: 'A' | 'B';
  route: string;
  description: string;
  pixelId: string;
  visitors: number;
  conversionRate: number;
  quizStarts: number;
  quizCompletions: number;
  leads: number;
  sales: number;
  averageSessionTime: number;
  bounceRate: number;
  revenue: number;
}

interface ABTestAlertsProps {
  metrics: { A: ABTestMetrics; B: ABTestMetrics };
  significance: boolean;
  confidenceLevel: number;
  winner: 'A' | 'B' | 'tie' | null;
}

const ABTestAlerts: React.FC<ABTestAlertsProps> = ({ 
  metrics, 
  significance, 
  confidenceLevel, 
  winner 
}) => {
  const [config, setConfig] = useState<AlertConfig>({
    enabled: true,
    significanceThreshold: 95,
    minimumSampleSize: 100,
    emailNotifications: false,
    emailAddress: '',
    autoEndTest: false,
    maxDuration: 30
  });

  const [alerts, setAlerts] = useState<ABTestAlert[]>([]);
  const [testDuration, setTestDuration] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('abtest_alert_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Carregar alertas salvos
    const savedAlerts = localStorage.getItem('abtest_alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts).map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    // Verificar alertas quando métricas mudarem
    if (config.enabled && metrics) {
      checkForAlerts();
    }
  }, [metrics, significance, confidenceLevel, winner, config.enabled]);

  useEffect(() => {
    // Salvar configurações quando alteradas
    localStorage.setItem('abtest_alert_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    // Salvar alertas quando alterados
    localStorage.setItem('abtest_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const checkForAlerts = () => {
    if (!config.enabled || !metrics) return;

    try {
      const now = new Date();
      const newAlerts: ABTestAlert[] = [];

      // 1. Verificar significância estatística
      if (confidenceLevel >= config.significanceThreshold && significance) {
        const existingAlert = alerts.find(a => a.type === 'significance_reached' && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `significance_${Date.now()}`,
            type: 'significance_reached',
            severity: 'high',
            title: '🎯 Significância Estatística Atingida!',
            message: `O teste A/B atingiu ${confidenceLevel.toFixed(1)}% de confiança. A Versão ${winner} está vencendo com uma taxa de conversão de ${winner === 'A' ? metrics.A.conversionRate.toFixed(2) : metrics.B.conversionRate.toFixed(2)}%.`,
            timestamp: now,
            acknowledged: false,
            variant: winner as 'A' | 'B',
            metric: 'conversion_rate',
            value: confidenceLevel
          });
        }
      }

      // 2. Verificar tamanho mínimo da amostra
      const totalSample = metrics.A.visitors + metrics.B.visitors;
      if (totalSample < config.minimumSampleSize && totalSample > 10) {
        const existingAlert = alerts.find(a => a.type === 'sample_size_warning' && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `sample_${Date.now()}`,
            type: 'sample_size_warning',
            severity: 'medium',
            title: '⚠️ Amostra Pequena',
            message: `Tamanho atual da amostra: ${totalSample}. Recomenda-se aguardar pelo menos ${config.minimumSampleSize} visitantes para resultados confiáveis.`,
            timestamp: now,
            acknowledged: false,
            metric: 'sample_size',
            value: totalSample
          });
        }
      }

      // 3. Verificar anomalias de conversão
      const conversionDiff = Math.abs(metrics.A.conversionRate - metrics.B.conversionRate);
      if (conversionDiff > 50 && totalSample > 50) {
        const existingAlert = alerts.find(a => a.type === 'conversion_anomaly' && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `anomaly_${Date.now()}`,
            type: 'conversion_anomaly',
            severity: 'high',
            title: '🚨 Anomalia Detectada',
            message: `Diferença muito grande entre as versões (${conversionDiff.toFixed(1)}%). Verifique se há problemas técnicos.`,
            timestamp: now,
            acknowledged: false,
            metric: 'conversion_rate',
            value: conversionDiff
          });
        }
      }

      // Adicionar novos alertas
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
        
        // Mostrar toast para alertas de alta prioridade
        newAlerts.forEach(alert => {
          if (alert.severity === 'high') {
            toast({
              title: alert.title,
              description: alert.message,
              variant: alert.severity === 'high' ? 'destructive' : 'default'
            });
          }
        });
      }

      setLastCheck(now);
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: ABTestAlert['type']) => {
    switch (type) {
      case 'significance_reached':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sample_size_warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'duration_warning':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'conversion_anomaly':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: ABTestAlert['severity']) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Status e Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sistema de Alertas A/B
            {unacknowledgedAlerts.length > 0 && (
              <Badge variant="destructive">{unacknowledgedAlerts.length} novo(s)</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Monitoramento automático e notificações para o teste A/B
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{config.enabled ? '🟢' : '🔴'}</div>
              <div className="text-sm text-muted-foreground">
                {config.enabled ? 'Ativo' : 'Inativo'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{testDuration}</div>
              <div className="text-sm text-muted-foreground">Dias de Teste</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Alertas Totais</div>
            </div>
          </div>

          {/* Configurações Básicas */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Monitoramento Ativo</Label>
              <Switch 
                id="enabled"
                checked={config.enabled}
                onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="significance">Nível de Confiança (%)</Label>
                <Input
                  id="significance"
                  type="number"
                  min="80"
                  max="99"
                  value={config.significanceThreshold}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    significanceThreshold: parseInt(e.target.value) || 95 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleSize">Tamanho Mínimo da Amostra</Label>
                <Input
                  id="sampleSize"
                  type="number"
                  min="30"
                  value={config.minimumSampleSize}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    minimumSampleSize: parseInt(e.target.value) || 100 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoEnd">Finalizar Teste Automaticamente</Label>
              <Switch 
                id="autoEnd"
                checked={config.autoEndTest}
                onCheckedChange={(autoEndTest) => setConfig(prev => ({ ...prev, autoEndTest }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas Ativos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertas Recentes
            </CardTitle>
            {alerts.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllAlerts}>
                Limpar Todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">Nenhum alerta ativo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <Alert 
                  key={alert.id} 
                  className={`${getSeverityColor(alert.severity)} ${alert.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <AlertTitle className="text-sm font-semibold">
                          {alert.title}
                          {alert.variant && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Versão {alert.variant}
                            </Badge>
                          )}
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-muted-foreground mt-2">
                          {alert.timestamp.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Confirmar
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Última Verificação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Última verificação: {lastCheck.toLocaleString('pt-BR')}</span>
            <Button variant="outline" size="sm" onClick={checkForAlerts}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Verificar Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestAlerts;
