import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { performQuizHealthCheck, logQuizHealthCheck } from '@/utils/quizHealthCheck';
import { runCompleteQuizTest } from '@/utils/quizTestRunner';

export const QuizHealthChecker: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const healthStatus = await performQuizHealthCheck();
      setHealth(healthStatus);
      logQuizHealthCheck();
    } catch (error) {
      console.error('Error running health check:', error);
    } finally {
      setLoading(false);
    }
  };

  const runUserJourneyTest = async () => {
    setTesting(true);
    
    try {
      const testResults = await runCompleteQuizTest();
      console.log('Teste completo finalizado:', testResults);
    } catch (error) {
      console.error('Erro durante o teste:', error);
    } finally {
      setTesting(false);
      runHealthCheck(); // Refresh health status
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading && !health) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Executando análise completa do quiz...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {health && getStatusIcon(health.overall)}
            Análise Completa do Quiz
          </CardTitle>
          <CardDescription>
            Verificação de funcionamento de todos os componentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {health && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getStatusColor(health.overall)}`}>
                  {health.score}%
                </div>
                <div className="text-sm text-muted-foreground">Score Geral</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {health.issues.length}
                </div>
                <div className="text-sm text-muted-foreground">Problemas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.values(health.components).filter((c: any) => c.status === 'healthy').length}
                </div>
                <div className="text-sm text-muted-foreground">Componentes OK</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={runHealthCheck} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Verificar Novamente
            </Button>
            <Button onClick={runUserJourneyTest} disabled={testing} variant="secondary">
              <Play className={`h-4 w-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
              Testar Jornada Completa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Componentes */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle>Status dos Componentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(health.components).map(([component, status]: [string, any]) => (
                <div key={component} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.status)}
                    <span className="font-medium capitalize">{component}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={status.status === 'healthy' ? 'default' : status.status === 'warning' ? 'secondary' : 'destructive'}>
                      {status.message}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jornada do Usuário */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle>Jornada do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(health.userJourney).map(([step, working]: [string, any]) => (
                <div key={step} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {working ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm capitalize">{step.replace('_', ' ')}</span>
                  </div>
                  <Badge variant={working ? 'default' : 'destructive'} className="text-xs">
                    {working ? 'Funcionando' : 'Não testado'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problemas e Recomendações */}
      {health && health.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Problemas Encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {health.issues.map((issue: string, index: number) => (
                <Alert key={index} className="border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{issue}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {health && health.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {health.recommendations.map((rec: string, index: number) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm text-blue-800">{index + 1}. {rec}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizHealthChecker;