
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResultHeaderBlockContent } from '@/types/resultPageBlocks';

interface ResultHeaderBlockProps {
  content: ResultHeaderBlockContent;
  onClick: () => void;
}

export const ResultHeaderBlock: React.FC<ResultHeaderBlockProps> = ({
  content,
  onClick
}) => {
  return (
    <div
      className="border-2 border-dashed border-transparent hover:border-[#B89B7A] rounded-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-[#fff7f3] border rounded-2xl">
        <div className="text-center mb-8">
          {content.userName && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-[#FAF9F7]">
                <span className="text-lg font-bold text-[#B89B7A]">
                  Parabéns, {content.userName}!
                </span>
              </div>
            </div>
          )}
          
          <h1 className="text-2xl lg:text-4xl font-playfair mb-6 text-[#432818]">
            Descobrimos Seu Estilo Predominante:
            <br />
            <span className="text-3xl lg:text-5xl font-bold text-[#B89B7A] mt-1 block">
              {content.primaryStyle?.category || 'Seu Estilo'}
            </span>
          </h1>

          <div className="max-w-lg mx-auto mb-6">
            <div className="flex items-center justify-between text-sm font-medium mb-1">
              <span>Compatibilidade</span>
              <span className="text-lg font-bold text-[#B89B7A]">
                {content.primaryStyle?.percentage || 85}%
              </span>
            </div>
            <Progress
              value={content.primaryStyle?.percentage || 85}
              className="h-2 rounded-full"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="rounded-xl p-4 bg-white/60 border">
              <p className="text-base text-[#432818] mb-4">
                <strong className="text-[#B89B7A]">Agora você tem clareza total</strong>{" "}
                sobre quem você é e como expressar sua personalidade através do seu estilo!
              </p>
              
              <div className="bg-white/80 rounded-lg p-3 border">
                <p className="text-sm text-[#432818]">
                  <strong className="text-[#B89B7A]">
                    Seu estilo {content.primaryStyle?.category || 'personalizado'}
                  </strong>{" "}
                  revela uma mulher autêntica e confiante.
                </p>
              </div>
            </div>

            {content.showSecondaryStyles && (
              <div className="rounded-xl p-4 bg-white/60 border">
                <h3 className="text-lg font-semibold mb-3 text-[#B89B7A]">
                  Estilos que Também Influenciam Você
                </h3>
                <div className="space-y-2">
                  {content.secondaryStyles?.map((style, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{style.category}</span>
                      <span className="font-medium">{style.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#B89B7A]/20 to-[#8F7A6A]/20 rounded-2xl flex items-center justify-center">
              <span className="text-[#8F7A6A]">Imagem do Estilo</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-playfair font-bold mb-6 text-[#B89B7A]">
            Seu Guia de Estilo Personalizado
          </h3>
          <div className="aspect-[16/9] bg-gradient-to-br from-[#B89B7A]/20 to-[#8F7A6A]/20 rounded-xl flex items-center justify-center max-w-2xl mx-auto">
            <span className="text-[#8F7A6A]">Guia de Estilo Preview</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
