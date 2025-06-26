
import { useState, useEffect } from 'react';

/**
 * Hook para carregar dados de transformação com base no estilo
 * @param style Nome do estilo para buscar transformações
 * @returns Objeto com dados da transformação e estado de carregamento
 */
export const useTransformation = (style?: string) => {
  const [transformation, setTransformation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!style) {
      setIsLoading(false);
      return;
    }

    // Simular carregamento de dados
    setIsLoading(true);

    // Mock de dados para demonstração
    setTimeout(() => {
      try {
        // Mock de dados de transformação
        const mockTransformations = [
          {
            id: '1',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1631714345/samples/people/kitchen-bar.jpg',
            caption: 'Transformação 1'
          },
          {
            id: '2',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1631714345/samples/people/smiling-man.jpg',
            caption: 'Transformação 2'
          }
        ];
        
        setTransformation(mockTransformations);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar transformações');
        setIsLoading(false);
      }
    }, 800);
  }, [style]);

  return { transformation, isLoading, error };
};

export default useTransformation;
