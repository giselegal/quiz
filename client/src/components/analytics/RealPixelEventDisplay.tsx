import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getRealPixelEvents, getRealEventStatistics, validateRealPixelData } from '@/utils/realPixelData';
import { simulateRealPixelEvents, generateSamplePurchaseEvent, clearAllPixelData } from '@/utils/pixelDataTester';

export const RealPixelEventDisplay: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    
    // Get real events from localStorage/API
    const realEvents = getRealPixelEvents();
    const realStats = getRealEventStatistics();
    const dataValidation = validateRealPixelData();
    
    setEvents(realEvents);
    setStats(realStats);
    setValidation(dataValidation);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Carregando dados reais dos eventos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status dos Dados de Pixel
          </CardTitle>
          <CardDescription>
            Validação de dados reais vs simulados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validation?.isReal ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Dados Reais Detectados</div>
                <div className="text-sm text-green-700">
                  {stats?.total_events || 0} eventos válidos encontrados nos últimos 7 dias
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Dados Simulados ou Ausentes</div>
                <div className="text-sm text-red-700">
                  {validation?.issues?.length > 0 ? (
                    <ul className="mt-2 list-disc list-inside">
                      {validation.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    'Nenhum evento real foi encontrado'
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Reais */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Eventos Reais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.total_events}</div>
                <div className="text-sm text-muted-foreground">Total (7d)</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-green-600">{stats.events_last_24h}</div>
                <div className="text-sm text-muted-foreground">Últimas 24h</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-purple-600">{stats.success_rate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Taxa Sucesso</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.events_by_type).length}</div>
                <div className="text-sm text-muted-foreground">Tipos Evento</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funil de Conversão Real */}
      {stats?.conversion_funnel && (
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão (Dados Reais)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.conversion_funnel).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium capitalize">{stage.replace('_', ' ')}</span>
                  <Badge variant={count > 0 ? "default" : "secondary"}>
                    {count} eventos
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eventos por Tipo */}
      {stats?.events_by_type && Object.keys(stats.events_by_type).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.events_by_type).map(([eventType, count]) => (
                <div key={eventType} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">{eventType}</span>
                  <Badge variant="outline">{count} eventos</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Eventos Recentes */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>
              Últimos {Math.min(10, events.length)} eventos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.slice(-10).reverse().map((event, index) => (
                <div key={index} className="p-3 border rounded text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{event.type}</span>
                    <Badge variant={event.success ? "default" : "destructive"} className="text-xs">
                      {event.success ? "Sucesso" : "Falha"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString('pt-BR')}
                  </div>
                  {event.data && Object.keys(event.data).length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Pixel: {event.pixel_id.substring(0, 8)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Caso não tenha eventos */}
      {events.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Nenhum evento registrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Execute ações no quiz para gerar eventos reais de pixel
            </p>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-2">
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Dados
        </Button>
        <Button onClick={simulateRealPixelEvents} variant="secondary" size="sm">
          Simular Jornada Completa
        </Button>
        <Button onClick={generateSamplePurchaseEvent} variant="secondary" size="sm">
          Simular Compra
        </Button>
        <Button onClick={clearAllPixelData} variant="destructive" size="sm">
          Limpar Dados
        </Button>
      </div>
    </div>
  );
};

export default RealPixelEventDisplay;