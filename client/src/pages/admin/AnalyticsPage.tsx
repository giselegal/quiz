import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Target, Download } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#432818]">Analytics & Métricas</h1>
          <p className="text-[#8F7A6A] mt-2">Análise detalhada do desempenho dos seus quizzes</p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              Total de Respostas
            </CardTitle>
            <Users className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">2,847</div>
            <p className="text-xs text-green-600">
              +18.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">24.3%</div>
            <p className="text-xs text-green-600">
              +2.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              ROAS Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">4.2x</div>
            <p className="text-xs text-green-600">
              +0.3x vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              Receita Total
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">R$ 18.742</div>
            <p className="text-xs text-green-600">
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Visitantes Únicos</span>
              <span className="text-sm font-bold">11,234</span>
            </div>
            <Progress value={100} className="h-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Iniciaram o Quiz</span>
              <span className="text-sm font-bold">4,892 (43.5%)</span>
            </div>
            <Progress value={43.5} className="h-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Concluíram o Quiz</span>
              <span className="text-sm font-bold">2,847 (58.2%)</span>
            </div>
            <Progress value={25.3} className="h-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Visualizaram Resultado</span>
              <span className="text-sm font-bold">2,654 (93.2%)</span>
            </div>
            <Progress value={23.6} className="h-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Converteram</span>
              <span className="text-sm font-bold">692 (26.1%)</span>
            </div>
            <Progress value={6.2} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Performance por Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Performance por Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold text-[#432818]">Quiz: Descubra Seu Estilo</h4>
                <p className="text-sm text-[#8F7A6A]">1,247 respostas • 312 conversões</p>
              </div>
              <Badge className="bg-green-100 text-green-800">25.0% CVR</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold text-[#432818]">Quiz: Qual Produto é Ideal?</h4>
                <p className="text-sm text-[#8F7A6A]">892 respostas • 201 conversões</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">22.5% CVR</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold text-[#432818]">Quiz: Personalidade de Compra</h4>
                <p className="text-sm text-[#8F7A6A]">708 respostas • 179 conversões</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">25.3% CVR</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Tráfego */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#432818]">Fontes de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Facebook Ads</span>
                <span className="text-sm font-bold">45.2%</span>
              </div>
              <Progress value={45.2} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Google Ads</span>
                <span className="text-sm font-bold">28.7%</span>
              </div>
              <Progress value={28.7} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Instagram</span>
                <span className="text-sm font-bold">15.3%</span>
              </div>
              <Progress value={15.3} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Direto</span>
                <span className="text-sm font-bold">10.8%</span>
              </div>
              <Progress value={10.8} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-[#432818]">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mobile</span>
                <span className="text-sm font-bold">68.4%</span>
              </div>
              <Progress value={68.4} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Desktop</span>
                <span className="text-sm font-bold">24.1%</span>
              </div>
              <Progress value={24.1} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Tablet</span>
                <span className="text-sm font-bold">7.5%</span>
              </div>
              <Progress value={7.5} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
