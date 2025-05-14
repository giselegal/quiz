
import React, { useState, useEffect } from 'react';
import { defineLovable } from "../../../lovable";

export default defineLovable({
  name: "QuizLogic",
  displayName: "Lógica do Quiz",
  description: "Componente para gerenciar a lógica e fluxo do quiz de estilo",
  category: "Quiz",
  
  defaultProps: {
    questions: [
      {
        id: "question1",
        title: "Quais looks você se identifica mais?",
        subtitle: "Selecione até 3 opções que representam seu estilo",
        type: "both",
        multiSelect: 3,
        options: [
          {
            id: "q1-option1",
            text: "Estilo Natural",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
            styleCategory: "Natural"
          },
          {
            id: "q1-option2",
            text: "Estilo Clássico",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
            styleCategory: "Clássico"
          },
          {
            id: "q1-option3",
            text: "Estilo Contemporâneo",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
            styleCategory: "Contemporâneo"
          },
          {
            id: "q1-option4",
            text: "Estilo Elegante",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
            styleCategory: "Elegante"
          }
        ]
      },
      {
        id: "question2",
        title: "O que mais importa para você ao escolher uma roupa?",
        subtitle: "Selecione até 3 opções",
        type: "text",
        multiSelect: 3,
        options: [
          {
            id: "q2-option1",
            text: "Conforto acima de tudo",
            styleCategory: "Natural"
          },
          {
            id: "q2-option2",
            text: "Qualidade e acabamento",
            styleCategory: "Clássico"
          },
          {
            id: "q2-option3",
            text: "Tendências atuais",
            styleCategory: "Contemporâneo"
          },
          {
            id: "q2-option4",
            text: "Sofisticação e elegância",
            styleCategory: "Elegante"
          }
        ]
      },
    ],
    startingQuestion: 0,
    backgroundColor: "#FAF9F7",
    textColor: "#432818",
    accentColor: "#B89B7A",
    useLocalStorage: true
  },
  
  propsSchema: {
    questions: {
      type: "array",
      displayName: "Perguntas",
      description: "Lista de perguntas do quiz",
      itemType: {
        type: "object",
        properties: {
          id: { 
            type: "string",
            displayName: "ID",
            description: "Identificador único da pergunta"
          },
          title: { 
            type: "string",
            displayName: "Título",
            description: "Título principal da pergunta"
          },
          subtitle: { 
            type: "string",
            displayName: "Subtítulo",
            description: "Texto explicativo da pergunta"
          },
          type: { 
            type: "string",
            displayName: "Tipo",
            description: "Tipo de exibição das opções",
            options: [
              { label: "Apenas Texto", value: "text" },
              { label: "Apenas Imagem", value: "image" },
              { label: "Texto e Imagem", value: "both" }
            ]
          },
          multiSelect: { 
            type: "number",
            displayName: "Máximo de Seleções",
            description: "Quantas opções o usuário pode selecionar"
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
                  description: "URL da imagem para opções visuais"
                },
                styleCategory: { 
                  type: "string",
                  displayName: "Categoria de Estilo",
                  description: "Categoria de estilo relacionada à opção"
                }
              }
            }
          }
        }
      }
    },
    startingQuestion: {
      type: "number",
      displayName: "Pergunta Inicial",
      description: "Índice da pergunta inicial (começando em 0)"
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
    useLocalStorage: {
      type: "boolean",
      displayName: "Usar LocalStorage",
      description: "Salvar respostas no localStorage do navegador"
    }
  },
  
  render: ({ 
    questions, 
    startingQuestion,
    backgroundColor,
    textColor,
    accentColor,
    useLocalStorage
  }) => {
    // Estado para controlar a pergunta atual
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(startingQuestion);
    
    // Estado para armazenar as respostas
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    
    // Estado para controlar se o quiz foi completado
    const [quizCompleted, setQuizCompleted] = useState(false);
    
    // Estado para armazenar o resultado do quiz
    const [quizResult, setQuizResult] = useState<any>(null);
    
    // Recuperar respostas e estado do quiz do localStorage, se disponível
    useEffect(() => {
      if (useLocalStorage) {
        const savedAnswers = localStorage.getItem('quizAnswers');
        const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
        const savedQuizCompleted = localStorage.getItem('quizCompleted');
        const savedQuizResult = localStorage.getItem('quizResult');
        
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
        
        if (savedQuestionIndex) {
          setCurrentQuestionIndex(parseInt(savedQuestionIndex, 10));
        }
        
        if (savedQuizCompleted === 'true') {
          setQuizCompleted(true);
        }
        
        if (savedQuizResult) {
          setQuizResult(JSON.parse(savedQuizResult));
        }
      }
    }, [useLocalStorage]);
    
    // Valores calculados
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = currentQuestion ? answers[currentQuestion.id] || [] : [];
    const canProceed = currentQuestion ? currentAnswers.length > 0 && currentAnswers.length <= currentQuestion.multiSelect : false;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const totalQuestions = questions.length;
    
    // Função para lidar com respostas
    const handleAnswer = (questionId: string, selectedOptions: string[]) => {
      const newAnswers = {
        ...answers,
        [questionId]: selectedOptions
      };
      
      setAnswers(newAnswers);
      
      // Salvar no localStorage se necessário
      if (useLocalStorage) {
        localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
      }
    };
    
    // Função para ir para a próxima pergunta
    const handleNext = () => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        
        if (useLocalStorage) {
          localStorage.setItem('currentQuestionIndex', nextIndex.toString());
        }
      } else {
        // Calcular e salvar resultados
        const results = calculateResults();
        setQuizCompleted(true);
        setQuizResult(results);
        
        if (useLocalStorage) {
          localStorage.setItem('quizCompleted', 'true');
          localStorage.setItem('quizResult', JSON.stringify(results));
        }
      }
    };
    
    // Função para ir para a pergunta anterior
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        
        if (useLocalStorage) {
          localStorage.setItem('currentQuestionIndex', prevIndex.toString());
        }
      }
    };
    
    // Função para resetar o quiz
    const resetQuiz = () => {
      setCurrentQuestionIndex(startingQuestion);
      setAnswers({});
      setQuizCompleted(false);
      setQuizResult(null);
      
      if (useLocalStorage) {
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('quizCompleted');
        localStorage.removeItem('quizResult');
      }
    };
    
    // Função para calcular os resultados
    const calculateResults = () => {
      const styleCounter: Record<string, number> = {
        'Natural': 0,
        'Clássico': 0,
        'Contemporâneo': 0,
        'Elegante': 0,
        'Romântico': 0,
        'Sexy': 0,
        'Dramático': 0,
        'Criativo': 0
      };
      
      let totalSelections = 0;
      
      // Contar pontos para cada estilo
      Object.entries(answers).forEach(([questionId, optionIds]) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;
        
        optionIds.forEach(optionId => {
          const option = question.options.find(o => o.id === optionId);
          if (option && option.styleCategory) {
            styleCounter[option.styleCategory]++;
            totalSelections++;
          }
        });
      });
      
      // Converter contagens em resultados
      const styleResults = Object.entries(styleCounter)
        .map(([category, score]) => ({
          category,
          score,
          percentage: totalSelections > 0 ? Math.round((score / totalSelections) * 100) : 0
        }))
        .sort((a, b) => b.score - a.score);
      
      const primaryStyle = styleResults[0];
      const secondaryStyles = styleResults.slice(1, 3); // Pegar os 2 próximos estilos mais altos
      
      return {
        primaryStyle,
        secondaryStyles,
        totalSelections
      };
    };
    
    // Renderização condicional baseada no estado do quiz
    if (quizCompleted && quizResult) {
      // Renderizar resultados
      return (
        <div 
          className="min-h-screen py-12"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-playfair text-center mb-8">
              Seu Resultado do Quiz
            </h1>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-medium mb-4">
                Seu estilo predominante é: {quizResult.primaryStyle.category}
              </h2>
              
              <div className="h-4 bg-gray-200 rounded-full w-full mb-6">
                <div
                  className="h-4 rounded-full"
                  style={{ 
                    width: `${quizResult.primaryStyle.percentage}%`,
                    backgroundColor: accentColor
                  }}
                ></div>
              </div>
              
              <p className="mb-6">
                Você tem {quizResult.primaryStyle.percentage}% de compatibilidade com o estilo {quizResult.primaryStyle.category}.
              </p>
              
              <h3 className="text-xl font-medium mb-4">
                Seus estilos secundários:
              </h3>
              
              <div className="space-y-4">
                {quizResult.secondaryStyles.slice(0, 2).map((style: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span>{style.category}</span>
                      <span>{style.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${style.percentage}%`,
                          backgroundColor: accentColor
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 rounded-md"
                  style={{ backgroundColor: accentColor, color: 'white' }}
                >
                  Refazer o Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Renderizar pergunta atual
    if (currentQuestion) {
      const { title, subtitle, options, multiSelect, type } = currentQuestion;
      
      return (
        <div 
          className="min-h-screen py-12"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-6">
              <p className="text-sm mb-2">
                Pergunta {currentQuestionIndex + 1} de {totalQuestions}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    backgroundColor: accentColor
                  }}
                ></div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-playfair mb-3">{title}</h2>
              <p className="text-md opacity-80 mb-2">{subtitle}</p>
              <p className="text-sm">
                Selecione até {multiSelect} {multiSelect === 1 ? 'opção' : 'opções'}
              </p>
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8`}>
              {options.map(option => (
                <div 
                  key={option.id} 
                  onClick={() => {
                    const isSelected = currentAnswers.includes(option.id);
                    let newSelectedOptions: string[];
                    
                    if (isSelected) {
                      // Remover opção se já selecionada
                      newSelectedOptions = currentAnswers.filter(id => id !== option.id);
                    } else {
                      // Adicionar opção, respeitando o limite de multiSelect
                      if (currentAnswers.length >= multiSelect) {
                        newSelectedOptions = [...currentAnswers.slice(1), option.id];
                      } else {
                        newSelectedOptions = [...currentAnswers, option.id];
                      }
                    }
                    
                    handleAnswer(currentQuestion.id, newSelectedOptions);
                  }}
                  className={`
                    cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${currentAnswers.includes(option.id) 
                      ? `border-[${accentColor}] shadow-lg` 
                      : 'border-transparent hover:border-gray-300'}
                  `}
                >
                  {(type === 'both' || type === 'image') && option.imageUrl && (
                    <div className="w-full">
                      <img 
                        src={option.imageUrl} 
                        alt={option.text} 
                        className="w-full object-cover h-48"
                      />
                    </div>
                  )}
                  
                  {(type === 'both' || type === 'text') && (
                    <div className="p-4 text-center">
                      <p className="font-medium">{option.text}</p>
                      
                      {currentAnswers.includes(option.id) && (
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
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 ${
                  currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Anterior
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-6 py-2 rounded-md text-white ${
                  !canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: accentColor }}
              >
                {isLastQuestion ? 'Ver Resultado' : 'Próxima'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Oops! Não foi possível carregar o quiz.</h2>
          <button 
            onClick={resetQuiz}
            className="px-6 py-2 rounded-md text-white"
            style={{ backgroundColor: accentColor }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
});
