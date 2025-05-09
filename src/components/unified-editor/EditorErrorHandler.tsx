import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EditorErrorHandlerProps {
  children: React.ReactNode;
}

const EditorErrorHandler: React.FC<EditorErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular verificação de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Adicionar listener para erros não capturados
    const handleError = (event: ErrorEvent) => {
      console.error('Erro capturado pelo EditorErrorHandler:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleRetry = () => {
    // Recarregar a página atual
    window.location.reload();
  };

  const handleGoBack = () => {
    // Voltar para o dashboard
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" color="#B89B7A" />
          <p className="text-[#8F7A6A]">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-2xl font-medium text-[#432818] mb-4">Erro ao carregar o editor</h2>
          <p className="text-[#8F7A6A] mb-6">
            Ocorreu um problema ao carregar o editor. Isso pode ser devido a um problema temporário ou uma incompatibilidade.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-amber-800 mb-2">Sugestões:</h3>
            <ul className="list-disc pl-5 text-amber-700 space-y-1 text-sm">
              <li>Verifique sua conexão com a internet</li>
              <li>Limpe o cache do navegador e tente novamente</li>
              <li>Tente usar outro navegador</li>
              <li>Se o problema persistir, entre em contato com o suporte</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-[#B89B7A] hover:bg-[#9F836A] text-white" 
              onClick={handleRetry}
            >
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              className="border-[#B89B7A] text-[#B89B7A]"
              onClick={handleGoBack}
            >
              Voltar ao painel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver erro, renderizar os filhos normalmente
  return <>{children}</>;
};

export default EditorErrorHandler;