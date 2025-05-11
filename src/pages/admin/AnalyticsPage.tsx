
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ProgressTab } from '@/components/analytics/tabs/ProgressTab';
import { UserTab } from '@/components/analytics/tabs/UserTab';
import { ConversionTab } from '@/components/analytics/tabs/ConversionTab';
import { getCachedMetrics, resetMetricsCache } from '../../utils/analyticsHelpers';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metricsData, setMetricsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch metrics data on component mount
  useEffect(() => {
    loadMetrics();
  }, [timeRange]);
  
  const loadMetrics = () => {
    const metrics = getCachedMetrics(timeRange);
    setMetricsData(metrics);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Reset metrics cache returns a boolean
      const success = resetMetricsCache();
      
      if (success) {
        // Reload metrics
        loadMetrics();
      }
    } finally {
      // Ensure refreshing state is reset
      setTimeout(() => setRefreshing(false), 800);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Análise de Dados</h1>
            <p className="text-gray-500 text-sm">
              {metricsData?.lastUpdated && 
                `Última atualização: ${formatDate(metricsData.lastUpdated)}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time range selector */}
            <div className="flex bg-gray-100 rounded-md">
              <Button 
                variant={timeRange === '7d' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('7d')}
                className={timeRange === '7d' ? 'text-white' : 'text-gray-600'}
              >
                7 Dias
              </Button>
              <Button 
                variant={timeRange === '30d' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('30d')}
                className={timeRange === '30d' ? 'text-white' : 'text-gray-600'}
              >
                30 Dias
              </Button>
              <Button 
                variant={timeRange === 'all' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('all')}
                className={timeRange === 'all' ? 'text-white' : 'text-gray-600'}
              >
                Tudo
              </Button>
            </div>
            
            {/* Refresh button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={refreshing}
            >
              <RefreshCw 
                className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} 
              />
              Atualizar
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsData?.metrics?.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usuários que iniciaram o quiz
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsData?.metrics?.activeUsers || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usuários que completaram o quiz
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Taxa de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsData?.metrics?.conversionRate?.toFixed(1) || '0.0'}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Porcentagem de usuários que compraram
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full justify-start border-b pb-0 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Progresso
            </TabsTrigger>
            <TabsTrigger 
              value="conversion" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Conversão
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Content */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            <p>Overview content here</p>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6 space-y-8">
            <UserTab timeRange={timeRange} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6 space-y-8">
            <ProgressTab timeRange={timeRange} />
          </TabsContent>
          
          <TabsContent value="conversion" className="mt-6 space-y-8">
            <ConversionTab timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
