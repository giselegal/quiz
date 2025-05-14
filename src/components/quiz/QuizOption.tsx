import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { QuizOption as QuizOptionType } from '@/types/quiz';
import { highlightStrategicWords } from '@/utils/textHighlight';
import { QuizOptionImage } from './QuizOptionImage';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuizOptionProps {
  option: QuizOptionType;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  type: 'text' | 'image' | 'both';
  questionId?: string;
  isDisabled?: boolean;
  isStrategicOption?: boolean; // Nova prop
}

const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  isSelected,
  onSelect,
  type,
  questionId,
  isDisabled = false,
  isStrategicOption = false // Padrão para false
}) => {
  const isMobile = useIsMobile();
  const is3DQuestion = option.imageUrl?.includes('sapatos') || option.imageUrl?.includes('calca');
  // Usar ref para evitar re-renderizações desnecessárias
  const optionRef = useRef<HTMLDivElement>(null);
  
  // Usar useEffect para lidar com mudanças de isSelected sem causar flash
  useEffect(() => {
    if (optionRef.current) {
      if (isSelected) {
        // Para opções de texto - manter borda amarela
        if (type === 'text') {
          optionRef.current.style.borderColor = '#b29670';
          optionRef.current.style.boxShadow = isStrategicOption 
            ? '0 6px 12px rgba(178, 150, 112, 0.35)' // Sombra mais pronunciada para estratégicas
            : '0 4px 8px rgba(178, 150, 112, 0.25)';
        } 
        // Para opções de imagem - sem borda, apenas sombra
        else {
          optionRef.current.style.borderColor = 'transparent';
          optionRef.current.style.boxShadow = isStrategicOption 
            ? '0 15px 30px rgba(0, 0, 0, 0.25)' // Sombra mais pronunciada para estratégicas
            : '0 12px 24px rgba(0, 0, 0, 0.2)';
        }
      } else {
        if (type === 'text') {
          optionRef.current.style.borderColor = '#B89B7A';
          optionRef.current.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        } else {
          optionRef.current.style.borderColor = 'transparent';
          optionRef.current.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
      }
    }
  }, [isSelected, type, isStrategicOption]);
  
  // Manipulador de clique customizado com debounce
  const handleClick = () => {
    if (!isDisabled) {
      // Aplicar mudança visual imediatamente para feedback instantâneo
      if (optionRef.current) {
        if (type === 'text') {
          optionRef.current.style.borderColor = isSelected ? '#B89B7A' : '#b29670';
        }
        // Aplicar sombra correspondente ao estado
        optionRef.current.style.boxShadow = isSelected 
          ? '0 2px 4px rgba(0, 0, 0, 0.05)' 
          : (isStrategicOption 
              ? (type === 'text' ? '0 6px 12px rgba(178, 150, 112, 0.35)' : '0 15px 30px rgba(0, 0, 0, 0.25)') 
              : (type === 'text' ? '0 4px 8px rgba(178, 150, 112, 0.25)' : '0 12px 24px rgba(0, 0, 0, 0.2)'));
      }
      // Chamar onSelect com um pequeno atraso para evitar flash
      setTimeout(() => {
        onSelect(option.id);
      }, 10);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative h-full",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      {/* Conteúdo principal com ref para manipulação direta do DOM */}
      <div 
        ref={optionRef}
        className={cn(
          "relative h-full flex flex-col rounded-lg overflow-hidden",
          "cursor-pointer", 
          
          // Para opções de texto - manter borda
          type === 'text' && "p-4 border",
          
          // Para opções de imagem - SEM borda na coluna
          type !== 'text' && "border-0",
          
          // Fundo sólido sem transparência e adicionando sombra padrão
          "bg-[#FEFEFE] shadow-sm hover:shadow-md transition-all duration-300"
        )}
      >
        {type !== 'text' && option.imageUrl && (
          <QuizOptionImage
            imageUrl={option.imageUrl}
            altText={option.text}
            styleCategory={option.styleCategory}
            isSelected={isSelected}
            is3DQuestion={is3DQuestion}
            questionId={questionId || ''}
          />
        )}
        
        <p className={cn(
          type !== 'text' 
            ? cn(
                "leading-tight font-medium py-1 px-2 mt-auto text-[#432818] relative", 
                isMobile ? "text-[0.7rem]" : "text-[0.7rem] sm:text-sm"
              )
            : cn(
                "leading-relaxed text-[#432818]",
                isMobile ? "text-[0.75rem]" : "text-sm sm:text-base"
              )
        )}>
          {highlightStrategicWords(option.text)}
        </p>
        
        {/* Indicador de seleção */}
        <div 
          className={cn(
            "absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#b29670] rounded-full flex items-center justify-center z-10",
            isSelected ? "block" : "hidden"
          )}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-2 w-2 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export { QuizOption };
