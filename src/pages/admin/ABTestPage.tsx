
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import QuizResultSalesPage from '@/components/templates/QuizResultSalesPage';
import ResultPage from '@/components/pages/ResultPage';

const ABTestPage: React.FC = () => {
  const [activeVersion, setActiveVersion] = useState<'A' | 'B'>('A');
  const navigate = useNavigate();

  // Dados de exemplo para teste com score adicionado
  const mockData = {
    primaryStyle: {
      category: "Natural" as const, // Using as const to ensure it's the correct literal type
      percentage: 75,
      score: 75 // Added score property to fix the TypeScript error
    },
    secondaryStyles: [
      { category: "Clássico" as const, percentage: 15, score: 15 }, // Added as const to ensure it's the correct literal type
      { category: "Contemporâneo" as const, percentage: 10, score: 10 } // Added as const to ensure it's the correct literal type
    ],
    userName: 'Visitante'
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#432818]">Teste A/B - Páginas de Resultado</h1>
        <Button
          onClick={() => navigate('/admin/analytics')}
          variant="outline"
          className="border-[#B89B7A]"
        >
          Voltar para Analytics
        </Button>
      </div>

      <Card className="p-6 mb-6 bg-white shadow-md border border-[#B89B7A]/20">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-[#432818] mb-2">Controles do Teste</h2>
          <p className="text-sm text-[#666]">Alterne entre as versões para comparar as diferentes implementações.</p>
        </div>

        <Tabs value={activeVersion} onValueChange={(value) => setActiveVersion(value as 'A' | 'B')}>
          <TabsList className="mb-4">
            <TabsTrigger value="A" className="data-[state=active]:bg-[#aa6b5d] data-[state=active]:text-white">
              Versão A
            </TabsTrigger>
            <TabsTrigger value="B" className="data-[state=active]:bg-[#aa6b5d] data-[state=active]:text-white">
              Versão B
            </TabsTrigger>
          </TabsList>

          <div className="bg-[#f9f4ef] p-4 rounded-lg mb-4">
            <p className="text-sm font-medium mb-2">
              Versão Atual: {activeVersion === 'A' ? 'Original (A)' : 'Nova (B)'}
            </p>
            <p className="text-xs text-[#666]">
              {activeVersion === 'A' 
                ? 'Versão original com foco em benefícios e social proof'
                : 'Nova versão com design modernizado e foco em transformação'}
            </p>
          </div>
        </Tabs>
      </Card>

      <div className="border-2 border-[#aa6b5d] rounded-lg overflow-hidden">
        {activeVersion === 'A' ? (
          <QuizResultSalesPage
            primaryStyle={mockData.primaryStyle}
            secondaryStyles={mockData.secondaryStyles}
            userName={mockData.userName}
          />
        ) : (
          <ResultPage />
        )}
      </div>
    </div>
  );
};

export default ABTestPage;
