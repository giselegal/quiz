
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserProgressData } from '@/utils/analyticsHelpers';

interface ProgressTabProps {
  timeRange: '7d' | '30d' | 'all';
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ timeRange }) => {
  // Get user progress data - this should always be an array
  const progressData = getUserProgressData();
  
  // Statistics
  const statsData = useMemo(() => {
    if (!progressData || progressData.length === 0) {
      return {
        completionRate: 0,
        averageTimePerQuestion: 0,
        dropOffPoints: [],
        totalUsers: 0
      };
    }
    
    // Assuming progressData is array of objects with questionId, uniqueUsers, etc.
    // Calculate completion rate
    const firstQuestion = progressData[0];
    const lastQuestion = progressData[progressData.length - 1];
    const completionRate = lastQuestion && firstQuestion 
      ? Math.round((lastQuestion.uniqueUsers / firstQuestion.uniqueUsers) * 100) 
      : 0;
      
    // Calculate drop-off rates between questions
    const dropOffPoints = progressData.map((item, index, array) => {
      if (index === 0) return 0;
      const prevQuestion = array[index - 1];
      return prevQuestion 
        ? Math.round(((prevQuestion.uniqueUsers - item.uniqueUsers) / prevQuestion.uniqueUsers) * 100)
        : 0;
    });
    
    return {
      completionRate,
      averageTimePerQuestion: 43, // This would be calculated from actual timing data
      dropOffPoints,
      totalUsers: firstQuestion?.uniqueUsers || 0
    };
  }, [progressData]);

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.completionRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Usuários que completaram o quiz inteiro
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tempo Médio por Pergunta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.averageTimePerQuestion}s
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tempo para responder cada questão
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Maior Taxa de Abandono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...statsData.dropOffPoints)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Entre as questões com mais desistências
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.totalUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Usuários que iniciaram o quiz
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* User Retention Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Retenção de Usuários por Pergunta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="questionId" 
                  label={{ 
                    value: 'Número da Pergunta', 
                    position: 'insideBottom', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  label={{ 
                    value: 'Usuários', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip formatter={(value) => [`${value} usuários`, 'Quantidade']} />
                <Legend />
                <Bar name="Usuários Únicos" dataKey="uniqueUsers" fill="#8884d8" />
                <Bar name="Respostas Totais" dataKey="totalAnswers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* User Retention Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Retenção e Abandono por Pergunta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData.map((item, index) => ({
                  ...item,
                  dropOffFromPrevious: index > 0 
                    ? Math.round(((progressData[index-1].uniqueUsers - item.uniqueUsers) / progressData[0].uniqueUsers) * 100)
                    : 0
                }))}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="questionId" 
                  label={{ 
                    value: 'Número da Pergunta', 
                    position: 'insideBottom', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  label={{ 
                    value: 'Porcentagem (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                <Legend />
                <Bar name="Retenção desde Início (%)" dataKey="retentionFromStart" fill="#82ca9d" />
                <Bar name="Taxa de Abandono (%)" dataKey="dropoffRate" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTab;
