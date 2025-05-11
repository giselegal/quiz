
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ABTestVariant from '../../components/admin/ABTestVariant';
import ABTestResults from '../../components/admin/ABTestResults';

// Define the type for primary and secondary styles
interface StyleData {
  category: string;
  percentage: number;
  score: number;
  imageUrl?: string; // Optional image URL
}

// Define props for ABTestVariant component
interface ABTestVariantProps {
  primaryStyle: StyleData;
  secondaryStyles: StyleData[];
  userName: string;
}

const ABTestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('variant-a');
  
  // Sample data for A/B test variants
  const variantAData = {
    primaryStyle: {
      category: 'Natural',
      percentage: 65,
      score: 32
    },
    secondaryStyles: [
      {
        category: 'Clássico',
        percentage: 20,
        score: 10
      },
      {
        category: 'Contemporâneo',
        percentage: 15,
        score: 8
      }
    ],
    userName: 'Ana Silva'
  } as ABTestVariantProps;
  
  const variantBData = {
    primaryStyle: {
      category: 'Natural',
      percentage: 58,
      score: 29
    },
    secondaryStyles: [
      {
        category: 'Romântico',
        percentage: 25,
        score: 12
      },
      {
        category: 'Contemporâneo',
        percentage: 17,
        score: 9
      }
    ],
    userName: 'Ana Silva'
  } as ABTestVariantProps;
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teste A/B de Resultados</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Configurar Testes</Button>
          </div>
        </div>
        
        {/* A/B Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Controles do Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Status do Teste</div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Ativo (50% de tráfego)</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Duração</div>
                <div>10 dias (Iniciado em 01/05/2023)</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Conversões Totais</div>
                <div>156 / 2.450 visitas (6.4%)</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="text-sm font-medium mb-1">Variante A</div>
                <div>Layout Original - 78 conversões (6.2%)</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Variante B</div>
                <div>Layout Novo - 78 conversões (6.5%)</div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="destructive" size="sm">Parar Teste</Button>
              <Button variant="outline" size="sm">Definir como Vencedor</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Variant Previews */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="variant-a">Variante A (Original)</TabsTrigger>
            <TabsTrigger value="variant-b">Variante B (Novo)</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="variant-a" className="border rounded-md p-4">
            <ABTestVariant 
              primaryStyle={variantAData.primaryStyle}
              secondaryStyles={variantAData.secondaryStyles}
              userName={variantAData.userName}
            />
          </TabsContent>
          
          <TabsContent value="variant-b" className="border rounded-md p-4">
            <ABTestVariant 
              primaryStyle={variantBData.primaryStyle}
              secondaryStyles={variantBData.secondaryStyles}
              userName={variantBData.userName}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ABTestResults />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ABTestPage;
