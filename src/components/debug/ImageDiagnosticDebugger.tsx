
import React, { useState, useEffect } from 'react';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

// Definir tipos para parâmetros de otimização de imagem
type ImageOptimizationParams = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  crop?: 'fill' | 'fit' | 'limit';
};

interface ImageDiagnosticProps {
  src: string;
  showControls?: boolean;
}

/**
 * Componente de diagnóstico para testar e debugar otimizações de imagem
 */
export const ImageDiagnosticDebugger: React.FC<ImageDiagnosticProps> = ({ 
  src, 
  showControls = true 
}) => {
  const [originalImage, setOriginalImage] = useState<string>(src);
  const [optimizedImage, setOptimizedImage] = useState<string>('');
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Carregar a imagem otimizada no mount inicial
  useEffect(() => {
    if (src) {
      setOriginalImage(src);
      
      try {
        // Usando parâmetros bem definidos que correspondem ao tipo esperado
        const params: ImageOptimizationParams = {
          quality: 95,
          format: 'auto', 
        };
        
        const optimized = optimizeCloudinaryUrl(src, params);
        setOptimizedImage(optimized);
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error);
        setErrorMessage("Falha ao otimizar a imagem. Verifique o console para detalhes.");
      }
    }
  }, [src]);
  
  // Medir o tempo de carregamento da imagem original
  const handleOriginalLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Calcular o tamanho aproximado da imagem
    const img = event.target as HTMLImageElement;
    const bytesPerPixel = 4; // RGBA
    const approximateSize = img.naturalWidth * img.naturalHeight * bytesPerPixel / 1024; // KB
    setOriginalSize(approximateSize);
  };
  
  // Medir o tempo de carregamento da imagem otimizada
  const handleOptimizedLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const endTime = performance.now();
    setLoadTime(endTime);
    
    // Calcular o tamanho aproximado da imagem otimizada
    const img = event.target as HTMLImageElement;
    const bytesPerPixel = 4; // RGBA
    const approximateSize = img.naturalWidth * img.naturalHeight * bytesPerPixel / 1024; // KB
    setOptimizedSize(approximateSize);
  };
  
  // Lidar com erros de carregamento
  const handleError = () => {
    setErrorMessage("Falha ao carregar a imagem. Verifique a URL e sua conexão.");
  };
  
  // Testar otimização específica
  const testOptimization = (params: ImageOptimizationParams) => {
    try {
      // Reset states
      setLoadTime(null);
      setOptimizedSize(null);
      setErrorMessage(null);
      
      // Registrar tempo de início
      const startTime = performance.now();
      console.log('Iniciando otimização:', startTime);
      
      // Otimizar com parâmetros específicos
      const optimized = optimizeCloudinaryUrl(originalImage, params);
      setOptimizedImage(optimized);
      
    } catch (error) {
      console.error("Erro ao testar otimização:", error);
      setErrorMessage("Falha ao testar otimização. Verifique o console para detalhes.");
    }
  };
  
  // Testes rápidos para diferentes otimizações
  const runLowQualityTest = () => testOptimization({ quality: 30, format: 'webp' });
  const runHighQualityTest = () => testOptimization({ quality: 90, format: 'auto' });
  const runWebPTest = () => testOptimization({ quality: 75, format: 'webp' });
  
  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm my-4">
      <h3 className="text-lg font-semibold mb-2">Diagnóstico de Imagem</h3>
      
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-2 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Imagem Original */}
        <div>
          <p className="font-medium mb-2">Original</p>
          <div className="border rounded overflow-hidden bg-gray-50">
            {originalImage && (
              <img 
                src={originalImage} 
                alt="Imagem Original" 
                className="w-full h-auto"
                onLoad={handleOriginalLoad}
                onError={handleError}
              />
            )}
          </div>
          {originalSize && (
            <p className="text-xs mt-1 text-gray-500">
              Tamanho aproximado: {originalSize.toFixed(2)} KB
            </p>
          )}
        </div>
        
        {/* Imagem Otimizada */}
        <div>
          <p className="font-medium mb-2">Otimizada</p>
          <div className="border rounded overflow-hidden bg-gray-50">
            {optimizedImage && (
              <img 
                src={optimizedImage} 
                alt="Imagem Otimizada" 
                className="w-full h-auto"
                onLoad={handleOptimizedLoad}
                onError={handleError}
              />
            )}
          </div>
          {optimizedSize && (
            <p className="text-xs mt-1 text-gray-500">
              Tamanho aproximado: {optimizedSize.toFixed(2)} KB
              {originalSize && ` (${((optimizedSize / originalSize) * 100).toFixed(1)}% do original)`}
            </p>
          )}
          {loadTime && (
            <p className="text-xs text-gray-500">
              Tempo de carregamento: {loadTime.toFixed(2)} ms
            </p>
          )}
        </div>
      </div>
      
      {showControls && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={runLowQualityTest}
            className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Testar Baixa Qualidade
          </button>
          <button
            onClick={runHighQualityTest}
            className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Testar Alta Qualidade
          </button>
          <button
            onClick={runWebPTest}
            className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Testar WebP
          </button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>URL Original: {originalImage}</p>
        <p>URL Otimizada: {optimizedImage}</p>
      </div>
    </div>
  );
};

export default ImageDiagnosticDebugger;
