import React, { useState } from 'react';
import { defineLovable } from "../../../lovable";

export default defineLovable({
  name: "QuizQuestion",
  displayName: "Pergunta do Quiz",
  description: "Bloco para pergunta do quiz com opções personalizáveis",
  category: "Quiz",
  
  defaultProps: {
    question: {
      title: "Quais looks você se identifica mais?",
      subtitle: "Selecione até 3 opções que representam seu estilo"
    },
    layout: {
      numColumns: 2,
      displayType: "both", // text, image, both
      imageSize: "medium" // small, medium, large
    },
    options: [
      {
        id: "option1",
        text: "Estilo Natural",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
        category: "Natural"
      },
      {
        id: "option2",
        text: "Estilo Clássico",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
        category: "Clássico"
      },
      {
        id: "option3",
        text: "Estilo Contemporâneo",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
        category: "Contemporâneo"
      },
      {
        id: "option4",
        text: "Estilo Elegante",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
        category: "Elegante"
      },
    ],
    maxSelections: 3,
    backgroundColor: "#FAF9F7",
    textColor: "#432818",
    accentColor: "#B89B7A",
    autoAdvance: false,
    questionNumber: 1,
    totalQuestions: 10,
    navigation: {
      showPrevButton: true,
      showNextButton: true,
      prevButtonText: "Anterior",
      nextButtonText: "Próxima"
    }
  },
  
  propsSchema: {
    question: {
      type: "object",
      displayName: "Pergunta",
      description: "Conteúdo da pergunta",
      properties: {
        title: {
          type: "string",
          displayName: "Título da Pergunta",
          description: "Texto principal da pergunta"
        },
        subtitle: {
          type: "string",
          displayName: "Subtítulo",
          description: "Texto explicativo ou instruções"
        }
      }
    },
    layout: {
      type: "object",
      displayName: "Layout",
      description: "Configurações de layout",
      properties: {
        numColumns: {
          type: "number",
          displayName: "Número de Colunas",
          description: "Quantas opções mostrar por linha",
          min: 1,
          max: 4
        },
        displayType: {
          type: "string",
          displayName: "Tipo de Exibição",
          description: "Como exibir as opções",
          options: [
            { label: "Apenas Texto", value: "text" },
            { label: "Apenas Imagem", value: "image" },
            { label: "Texto e Imagem", value: "both" }
          ]
        },
        imageSize: {
          type: "string",
          displayName: "Tamanho da Imagem",
          description: "Tamanho das imagens das opções",
          options: [
            { label: "Pequeno", value: "small" },
            { label: "Médio", value: "medium" },
            { label: "Grande", value: "large" }
          ]
        }
      }
    },
    options: {
      type: "array",
      displayName: "Opções",
      description: "Lista de opções para a pergunta",
      itemType: {
        type: "object",
        properties: {
          id: { 
            type: "string", 
            displayName: "ID", 
            description: "Identificador único da opção" 
          },
          text: { 
            type: "string", 
            displayName: "Texto", 
            description: "Texto da opção" 
          },
          imageUrl: { 
            type: "string", 
            displayName: "URL da Imagem", 
            description: "URL da imagem para a opção" 
          },
          category: { 
            type: "string", 
            displayName: "Categoria", 
            description: "Categoria de estilo relacionada" 
          }
        }
      }
    },
    maxSelections: {
      type: "number",
      displayName: "Máximo de Seleções",
      description: "Quantas opções o usuário pode selecionar",
      min: 1,
      max: 8
    },
    backgroundColor: {
      type: "color",
      displayName: "Cor de Fundo",
      description: "Cor de fundo da seção"
    },
    textColor: {
      type: "color",
      displayName: "Cor do Texto",
      description: "Cor principal para os textos"
    },
    accentColor: {
      type: "color",
      displayName: "Cor de Destaque",
      description: "Cor para elementos destacados"
    },
    autoAdvance: {
      type: "boolean",
      displayName: "Avançar Automaticamente",
      description: "Avançar para a próxima pergunta automaticamente após seleção"
    },
    questionNumber: {
      type: "number",
      displayName: "Número da Questão",
      description: "Número atual da questão"
    },
    totalQuestions: {
      type: "number",
      displayName: "Total de Questões",
      description: "Número total de questões no quiz"
    },
    navigation: {
      type: "object",
      displayName: "Navegação",
      description: "Configurações dos botões de navegação",
      properties: {
        showPrevButton: {
          type: "boolean",
          displayName: "Mostrar Botão Anterior",
          description: "Exibir botão para voltar à pergunta anterior"
        },
        showNextButton: {
          type: "boolean",
          displayName: "Mostrar Botão Próxima",
          description: "Exibir botão para avançar à próxima pergunta"
        },
        prevButtonText: {
          type: "string",
          displayName: "Texto do Botão Anterior",
          description: "Texto para o botão de pergunta anterior"
        },
        nextButtonText: {
          type: "string",
          displayName: "Texto do Botão Próxima",
          description: "Texto para o botão de próxima pergunta"
        }
      }
    }
  },
  
  render: ({ 
    question, 
    layout, 
    options, 
    maxSelections, 
    backgroundColor, 
    textColor, 
    accentColor, 
    autoAdvance,
    questionNumber,
    totalQuestions,
    navigation
  }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    
    const handleOptionClick = (optionId: string) => {
      setSelectedOptions(prev => {
        // If already selected, remove it
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        
        // If max selections reached, remove first and add new
        if (prev.length >= maxSelections) {
          return [...prev.slice(1), optionId];
        }
        
        // Otherwise add it
        return [...prev, optionId];
      });
    };
    
    const getImageSizeClass = () => {
      switch (layout.imageSize) {
        case "small": return "h-32";
        case "large": return "h-64";
        case "medium":
        default: return "h-48";
      }
    };
    
    const getGridClass = () => {
      switch (layout.numColumns) {
        case 1: return "grid-cols-1";
        case 3: return "grid-cols-1 sm:grid-cols-3";
        case 4: return "grid-cols-2 sm:grid-cols-4";
        case 2:
        default: return "grid-cols-1 sm:grid-cols-2";
      }
    };
    
    return (
      <div className="min-h-screen py-12 w-full" style={{ backgroundColor, color: textColor }}>
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair mb-3">{question.title}</h2>
            <p className="text-md opacity-80 mb-2">{question.subtitle}</p>
            <div className="text-sm opacity-70">
              Pergunta {questionNumber} de {totalQuestions}
            </div>
          </div>
          
          <div className={`grid ${getGridClass()} gap-4 mb-8`}>
            {options.map(option => (
              <div 
                key={option.id} 
                onClick={() => handleOptionClick(option.id)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                  bg-white
                  ${selectedOptions.includes(option.id) 
                    ? `border-[${accentColor}] shadow-lg transform scale-[1.01]` 
                    : 'border-transparent shadow-sm hover:border-gray-300 hover:shadow-md hover:scale-[1.005]'}
                `}
              >
                {(layout.displayType === 'both' || layout.displayType === 'image') && (
                  <div className="w-full">
                    <img 
                      src={option.imageUrl} 
                      alt={option.text} 
                      className={`w-full object-cover ${getImageSizeClass()}`}
                    />
                  </div>
                )}
                
                {(layout.displayType === 'both' || layout.displayType === 'text') && (
                  <div className="p-4 text-center">
                    <p className="font-medium">{option.text}</p>
                    
                    {selectedOptions.includes(option.id) && (
                      <div 
                        className="mt-2 text-sm px-3 py-1 rounded-full inline-block"
                        style={{ backgroundColor: accentColor, color: '#fff' }}
                      >
                        Selecionado
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            {navigation.showPrevButton && (
              <button 
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 shadow-sm"
              >
                {navigation.prevButtonText}
              </button>
            )}
            
            <div className="flex-grow"></div>
            
            {navigation.showNextButton && (
              <button 
                className="px-6 py-2 rounded-md text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
                disabled={selectedOptions.length === 0}
              >
                {navigation.nextButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
});
