import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componente placeholder para a grade de métricas
const EnhancedEditorMetricsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-medium">Edições totais</h3>
      <p className="text-2xl font-bold">238</p>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-medium">Tempo médio de edição</h3>
      <p className="text-2xl font-bold">12m 30s</p>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-medium">Taxa de conclusão</h3>
      <p className="text-2xl font-bold">87%</p>
    </div>
  </div>
);

// Componente placeholder para o cabeçalho do dashboard
const EnhancedEditorDashboardHeader = ({ title, description }) => (
  <div className="mb-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-500">{description}</p>
  </div>
);

// Componentes placeholder para as abas
const UsageTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Estatísticas de Uso</CardTitle>
      <CardDescription>Análise de como os usuários estão utilizando o editor</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Conteúdo detalhado das estatísticas de uso será implementado aqui.</p>
    </CardContent>
  </Card>
);

const CompletionTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Taxas de Conclusão</CardTitle>
      <CardDescription>Análise de conclusão de quizzes pelos usuários</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Conteúdo detalhado das taxas de conclusão será implementado aqui.</p>
    </CardContent>
  </Card>
);

const PerformanceTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Desempenho</CardTitle>
      <CardDescription>Métricas de desempenho do editor</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Conteúdo detalhado das métricas de desempenho será implementado aqui.</p>
    </CardContent>
  </Card>
);

export function EnhancedEditorDashboard() {
  return (
    <div className="space-y-4">
      <EnhancedEditorDashboardHeader
        title="Dashboard do Editor Avançado"
        description="Monitore e analise o uso do editor avançado"
      />

      <Card>
        <CardHeader>
          <CardTitle>Métricas do Editor Avançado</CardTitle>
          <CardDescription>
            Métricas-chave para uso e desempenho do editor avançado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedEditorMetricsGrid />
        </CardContent>
      </Card>

      <Tabs defaultValue="usage">
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Uso</TabsTrigger>
          <TabsTrigger value="completion">Conclusão</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <UsageTab />
        </TabsContent>
        
        <TabsContent value="completion">
          <CompletionTab />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}