import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PixelAnalysisComplete } from '@/components/analytics/PixelAnalysisComplete';
import { RealPixelEventDisplay } from '@/components/analytics/RealPixelEventDisplay';
import { QuizHealthChecker } from '@/components/admin/QuizHealthChecker';
import { QuizTester } from '@/components/admin/QuizTester';

export default function PixelAnalysisPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Análise de Eventos de Pixel</h1>
          <p className="text-muted-foreground">
            Análise completa da configuração e performance dos eventos do Facebook Pixel
          </p>
        </div>

        {/* Análise Completa dos Eventos de Pixel */}
        <PixelAnalysisComplete />
        
        {/* Testador de APIs do Quiz */}
        <QuizTester />
        
        {/* Verificação de Saúde do Quiz */}
        <QuizHealthChecker />
        
        {/* Display de Dados Reais dos Eventos */}
        <RealPixelEventDisplay />
      </div>
    </AdminLayout>
  );
}