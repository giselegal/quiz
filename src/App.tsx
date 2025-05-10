import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { captureUTMParameters } from './utils/analytics';
import { loadFacebookPixel } from './utils/facebookPixel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CriticalCSSLoader from './components/CriticalCSSLoader';
import { initialCriticalCSS, heroCriticalCSS } from './utils/critical-css';

// Componente de loading para Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto" />
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

// Lazy loading das páginas principais para melhorar performance
const HomePage = lazy(() => import('./pages/HomePage'));
const QuizPage = lazy(() => import('./components/QuizPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const ResultPagePrototype = lazy(() => import('./pages/ResultPagePrototype'));
const QuizOfferPage = lazy(() => import('./pages/QuizOfferPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EditorPage = lazy(() => import('./pages/admin/EditorPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const EditorNotFoundPage = lazy(() => import('./pages/EditorNotFoundPage'));
const EnhancedResultPageEditor = lazy(() => import('./pages/EnhancedResultPageEditorPage'));
const ABTestPage = lazy(() => import('./pages/admin/ABTestPage'));
const ABTestManagerPage = lazy(() => import('./pages/ABTestManagerPage'));

// Avalia se o dispositivo tem performance limitada
const isLowPerformanceDevice = () => {
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  // Se o dispositivo tem menos de 4GB de RAM ou não tem informação disponível, verificar CPU cores
  const cpuCores = navigator.hardwareConcurrency;
  if (cpuCores && cpuCores < 4) return true;
  
  return false;
};

const App = () => {
  const lowPerformance = isLowPerformanceDevice();

  // Inicializar analytics na montagem do componente
  useEffect(() => {
    try {
      // Inicializar Facebook Pixel
      loadFacebookPixel();
      
      // Capturar UTM parameters para analytics de marketing
      captureUTMParameters();
      
      console.log(`App initialized with performance optimization${lowPerformance ? ' (low-performance mode)' : ''}`);
    } catch (error) {
      console.error('Erro ao inicializar analytics:', error);
    }
  }, [lowPerformance]);

  // Reinicializar Facebook Pixel em mudanças de rota
  useEffect(() => {    
    // Função para lidar com mudanças de rota
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
        console.log('PageView tracked on route change');
      }
    };
    
    // Adicionar listener para mudanças de rota
    window.addEventListener('popstate', handleRouteChange);
    
    // Limpar o listener
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider>
      <QuizProvider>
        <TooltipProvider>
          <Router>
            {/* Injetar CSS crítico para melhorar o First Contentful Paint */}
            <CriticalCSSLoader cssContent={initialCriticalCSS} id="initial-critical" removeOnLoad={true} />
            <CriticalCSSLoader cssContent={heroCriticalCSS} id="hero-critical" removeOnLoad={true} />
            
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/resultado" element={<ResultPage />} />
                <Route path="/prototipo" element={<ResultPagePrototype />} />
                {/* Nova página de oferta com quiz embutido */}
                <Route path="/quiz-descubra-seu-estilo" element={<QuizOfferPage />} />
                {/* Editor visual aprimorado para página de resultados */}
                <Route path="/resultado/editor" element={<EnhancedResultPageEditor />} />
                {/* Redirecionar página de edição de resultados para o editor unificado com a aba de resultados ativa */}
                <Route path="/resultado/editar" element={<Navigate to="/admin/editor?tab=result" replace />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Manter apenas uma rota principal para o editor unificado */}
                <Route path="/admin/editor" element={<EditorPage />} />
                <Route path="/admin/editor/error" element={<EditorNotFoundPage />} />
                {/* Redirecionar o antigo quiz-builder para o editor unificado com a aba de quiz ativa */}
                <Route path="/admin/quiz-builder" element={<Navigate to="/admin/editor?tab=quiz" replace />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/ab-test" element={<ABTestPage />} />
                <Route path="/admin/ab-test-manager" element={<ABTestManagerPage />} />
                {/* Adicionando acesso ao protótipo no painel admin */}
                <Route path="/admin/prototipo" element={<ResultPagePrototype />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;
