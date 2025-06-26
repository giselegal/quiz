import React, { useState } from 'react';
import CreativeAnalyticsDashboardNew from '@/components/analytics/CreativeAnalyticsDashboardNew';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  Settings, 
  TestTube, 
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

const CreativeAnalyticsPageNew = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  // Cores da identidade visual da marca
  const brandColors = {
    primary: '#B89B7A',
    secondary: '#432818',
    accent: '#aa6b5d',
    background: '#FFFBF7',
    success: '#22c55e',
    text: {
      dark: '#432818',
      medium: '#6B4F43',
      light: '#8B7355'
    }
  };

  const handleGenerateTestData = () => {
    // Dados de teste otimizados para os 6 criativos numerados
    const testData = [];
    const creativos = ['criativo-1', 'criativo-2', 'criativo-3', 'criativo-4', 'criativo-5', 'criativo-6'];
    const now = Date.now();
    
    creativos.forEach((criativo, index) => {
      // Simular performance variada para cada criativo
      const baseViews = 1000 + (index * 200);
      const conversionRate = 0.5 + (index * 0.3); // De 0.5% a 2%
      
      // PageViews
      for (let i = 0; i < baseViews; i++) {
        testData.push({
          event_name: 'PageView',
          timestamp: now - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
          date: new Date(now - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          utm_content: criativo,
          utm_source: 'facebook',
          utm_campaign: 'teste_ab_6_criativos',
          utm_medium: 'cpc'
        });
      }
      
      // Leads baseados na taxa de conversão
      const leads = Math.floor(baseViews * (conversionRate / 100));
      for (let i = 0; i < leads; i++) {
        testData.push({
          event_name: 'Lead',
          timestamp: now - (Math.random() * 7 * 24 * 60 * 60 * 1000),
          date: new Date(now - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          utm_content: criativo,
          utm_source: 'facebook',
          utm_campaign: 'teste_ab_6_criativos',
          email: `teste_${criativo}_${i}@email.com`
        });
      }
      
      // Purchases (30% dos leads)
      const purchases = Math.floor(leads * 0.3);
      for (let i = 0; i < purchases; i++) {
        testData.push({
          event_name: 'Purchase',
          timestamp: now - (Math.random() * 7 * 24 * 60 * 60 * 1000),
          date: new Date(now - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          utm_content: criativo,
          utm_source: 'facebook',
          utm_campaign: 'teste_ab_6_criativos',
          value: 39.90,
          currency: 'BRL'
        });
      }
    });

    // Salvar dados de teste
    localStorage.setItem('all_tracked_events', JSON.stringify(testData));
    
    // Feedback visual
    const button = document.querySelector('[data-test-button]') as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Dados Gerados!';
      button.style.backgroundColor = brandColors.success;
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        window.location.reload();
      }, 2000);
    }
  };

  const handleExportData = () => {
    const events = JSON.parse(localStorage.getItem('all_tracked_events') || '[]');
    const csvContent = [
      'Data,Evento,Criativo,Fonte,Campanha,Email,Valor',
      ...events.map((event: any) => [
        new Date(event.timestamp).toLocaleDateString('pt-BR'),
        event.event_name,
        event.utm_content || '',
        event.utm_source || '',
        event.utm_campaign || '',
        event.email || '',
        event.value || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('all_tracked_events');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brandColors.background }}>
      {/* Header com informações e controles */}
      <div className="border-b border-gray-100" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" 
                  style={{ 
                    color: brandColors.text.dark,
                    fontFamily: 'Playfair Display, serif'
                  }}>
                Analytics de Criativos
              </h1>
              <p className="text-lg" style={{ color: brandColors.text.medium }}>
                Dashboard intuitivo para análise de performance dos 6 criativos do teste A/B
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstructions(!showInstructions)}
                className="border-gray-200 hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {showInstructions ? 'Ocultar' : 'Ver'} Instruções
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="border-gray-200 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              
              <Button
                data-test-button
                size="sm"
                onClick={handleGenerateTestData}
                className="text-white"
                style={{ backgroundColor: brandColors.primary }}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Gerar Dados Teste
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
              >
                <Settings className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções (se visível) */}
      {showInstructions && (
        <div className="border-b border-gray-100" style={{ backgroundColor: 'white' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Card className="border-0 shadow-sm" style={{ backgroundColor: brandColors.background }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ color: brandColors.text.dark }}>
                  <Lightbulb size={20} style={{ color: brandColors.primary }} />
                  <span>Como Usar o Dashboard de Criativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: brandColors.text.dark }}>
                      🎯 Configuração UTM para Teste A/B
                    </h4>
                    <div className="space-y-2 text-sm" style={{ color: brandColors.text.medium }}>
                      <p><strong>utm_campaign:</strong> teste_ab_6_criativos</p>
                      <p><strong>utm_content:</strong> criativo-1, criativo-2, ..., criativo-6</p>
                      <p><strong>utm_source:</strong> facebook</p>
                      <p><strong>utm_medium:</strong> cpc</p>
                    </div>
                    
                    <h4 className="font-semibold mt-4 mb-3" style={{ color: brandColors.text.dark }}>
                      📊 Métricas Monitoradas
                    </h4>
                    <ul className="space-y-1 text-sm" style={{ color: brandColors.text.medium }}>
                      <li>• <strong>Visualizações:</strong> Total de cliques nos anúncios</li>
                      <li>• <strong>Taxa de Conversão:</strong> % de leads gerados</li>
                      <li>• <strong>Receita:</strong> Valor total de vendas</li>
                      <li>• <strong>CPL:</strong> Custo estimado por lead</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: brandColors.text.dark }}>
                      🚀 Como Otimizar suas Campanhas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Badge className="bg-green-50 text-green-700 mt-1">Excelente</Badge>
                        <div className="text-sm" style={{ color: brandColors.text.medium }}>
                          <strong>Taxa ≥ 2%:</strong> Aumentar budget e criar variações
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Badge className="bg-yellow-50 text-yellow-700 mt-1">Bom</Badge>
                        <div className="text-sm" style={{ color: brandColors.text.medium }}>
                          <strong>Taxa 1-2%:</strong> Manter investimento e testar melhorias
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Badge className="bg-red-50 text-red-700 mt-1">Baixo</Badge>
                        <div className="text-sm" style={{ color: brandColors.text.medium }}>
                          <strong>Taxa &lt; 0.5%:</strong> Pausar e substituir criativo
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${brandColors.primary}10` }}>
                      <p className="text-sm font-medium" style={{ color: brandColors.text.dark }}>
                        💡 Dica: Use os insights automáticos no final da página para tomar decisões rápidas!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Dashboard Principal */}
      <CreativeAnalyticsDashboardNew />
      
      {/* Footer com informações adicionais */}
      <div className="border-t border-gray-100 mt-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm" style={{ backgroundColor: brandColors.background }}>
              <CardContent className="p-4 text-center">
                <Target size={24} className="mx-auto mb-2" style={{ color: brandColors.primary }} />
                <h4 className="font-semibold mb-1" style={{ color: brandColors.text.dark }}>
                  Teste A/B Configurado
                </h4>
                <p className="text-sm" style={{ color: brandColors.text.medium }}>
                  6 criativos numerados sendo testados simultaneamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm" style={{ backgroundColor: brandColors.background }}>
              <CardContent className="p-4 text-center">
                <TrendingUp size={24} className="mx-auto mb-2" style={{ color: brandColors.success }} />
                <h4 className="font-semibold mb-1" style={{ color: brandColors.text.dark }}>
                  Otimização Automática
                </h4>
                <p className="text-sm" style={{ color: brandColors.text.medium }}>
                  Insights e recomendações baseados em performance
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm" style={{ backgroundColor: brandColors.background }}>
              <CardContent className="p-4 text-center">
                <RefreshCw size={24} className="mx-auto mb-2" style={{ color: brandColors.accent }} />
                <h4 className="font-semibold mb-1" style={{ color: brandColors.text.dark }}>
                  Atualização em Tempo Real
                </h4>
                <p className="text-sm" style={{ color: brandColors.text.medium }}>
                  Dados atualizados automaticamente a cada 30 segundos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeAnalyticsPageNew;
