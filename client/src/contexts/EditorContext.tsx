import React, { useReducer, ReactNode } from "react";
import { EditorState, EditorAction } from "@/types/editor";
import { EditorContext } from "./EditorContext";

// Reducer
const editorReducer = (
  state: EditorState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_STEP":
      return {
        ...state,
        steps: [...state.steps, action.payload],
      };

    case "DELETE_STEP":
      return {
        ...state,
        steps: state.steps.filter((step) => step.id !== action.payload),
        currentStepId:
          state.currentStepId === action.payload
            ? state.steps[0]?.id || ""
            : state.currentStepId,
      };

    case "UPDATE_STEP":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.id
            ? { ...step, ...action.payload.updates }
            : step
        ),
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStepId: action.payload,
        selectedElementId: null,
      };

    case "ADD_ELEMENT":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.stepId
            ? { ...step, elements: [...step.elements, action.payload.element] }
            : step
        ),
      };

    case "UPDATE_ELEMENT":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.stepId
            ? {
                ...step,
                elements: step.elements.map((element) =>
                  element.id === action.payload.elementId
                    ? { ...element, ...action.payload.updates }
                    : element
                ),
              }
            : step
        ),
      };

    case "DELETE_ELEMENT":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.stepId
            ? {
                ...step,
                elements: step.elements.filter(
                  (element) => element.id !== action.payload.elementId
                ),
              }
            : step
        ),
        selectedElementId:
          state.selectedElementId === action.payload.elementId
            ? null
            : state.selectedElementId,
      };

    case "REORDER_ELEMENTS":
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.stepId
            ? {
                ...step,
                elements: action.payload.elementIds
                  .map((id) => step.elements.find((el) => el.id === id)!)
                  .filter(Boolean),
              }
            : step
        ),
      };

    case "SELECT_ELEMENT":
      return {
        ...state,
        selectedElementId: action.payload,
      };

    case "SAVE_TO_HISTORY":
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          { ...state },
        ],
        historyIndex: state.historyIndex + 1,
      };

    case "UNDO":
      if (state.historyIndex > 0) {
        return {
          ...state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
};

// Provider
export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState: EditorState = {
    steps: [
      {
        id: "intro",
        name: "Introdução",
        elements: [
          {
            id: "intro-title",
            type: "text",
            content: "Descubra Seu Estilo Único",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "intro-subtitle",
            type: "text",
            content:
              "Responda algumas perguntas e encontre o estilo perfeito para você",
            style: { fontSize: "1.2rem", textAlign: "center" },
            position: { x: 0, y: 80 },
          },
          {
            id: "start-button",
            type: "button",
            content: "Iniciar Quiz",
            style: {
              backgroundColor: "#007bff",
              color: "white",
              padding: "12px 24px",
            },
            position: { x: 0, y: 160 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: false,
          allowReturn: false,
        },
      },
      {
        id: "question-1",
        name: "Pergunta 1: Tipo de Roupa",
        elements: [
          {
            id: "q1-title",
            type: "text",
            content: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-2",
        name: "Pergunta 2: Personalidade",
        elements: [
          {
            id: "q2-title",
            type: "text",
            content: "COMO VOCÊ SE DESCREVERIA?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-3",
        name: "Pergunta 3: Estilo de Roupas",
        elements: [
          {
            id: "q3-title",
            type: "text",
            content: "QUE TIPO DE ROUPAS MAIS TE ATRAI?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-4",
        name: "Pergunta 4: Preferências",
        elements: [
          {
            id: "q4-title",
            type: "text",
            content: "SUAS PREFERÊNCIAS DE ESTILO",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-5",
        name: "Pergunta 5: Estilo Pessoal",
        elements: [
          {
            id: "q5-title",
            type: "text",
            content: "QUAL ESTILO MAIS COMBINA COM VOCÊ?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-6",
        name: "Pergunta 6: Casacos",
        elements: [
          {
            id: "q6-title",
            type: "text",
            content: "QUAL TIPO DE CASACO PREFERE?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-7",
        name: "Pergunta 7: Jaquetas",
        elements: [
          {
            id: "q7-title",
            type: "text",
            content: "QUE TIPO DE JAQUETA MAIS GOSTA?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-8",
        name: "Pergunta 8: Acessórios",
        elements: [
          {
            id: "q8-title",
            type: "text",
            content: "QUAIS ACESSÓRIOS MAIS USA?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-9",
        name: "Pergunta 9: Estilo de Acessórios",
        elements: [
          {
            id: "q9-title",
            type: "text",
            content: "SEU ESTILO DE ACESSÓRIOS",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "question-10",
        name: "Pergunta 10: Preferências Finais",
        elements: [
          {
            id: "q10-title",
            type: "text",
            content: "ÚLTIMAS PREFERÊNCIAS",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
            },
            position: { x: 0, y: 0 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      // Perguntas Estratégicas (3 perguntas especiais)
      {
        id: "strategic-question-1",
        name: "Pergunta Estratégica 1: Desafios",
        elements: [
          {
            id: "sq1-title",
            type: "text",
            content: "QUAL SEU MAIOR DESAFIO COM ROUPAS?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc2626",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "sq1-option-a",
            type: "button",
            content: "Não sei o que combina comigo",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "sq1-option-b",
            type: "button",
            content: "Não tenho tempo para escolher",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 140 },
          },
          {
            id: "sq1-option-c",
            type: "button",
            content: "Não sei onde comprar",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
            },
            position: { x: 0, y: 200 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "strategic-question-2",
        name: "Pergunta Estratégica 2: Orçamento",
        elements: [
          {
            id: "sq2-title",
            type: "text",
            content: "QUANTO VOCÊ INVESTE EM ROUPAS POR MÊS?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc2626",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "sq2-option-a",
            type: "button",
            content: "Até R$ 200",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "sq2-option-b",
            type: "button",
            content: "R$ 200 - R$ 500",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 140 },
          },
          {
            id: "sq2-option-c",
            type: "button",
            content: "Mais de R$ 500",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
            },
            position: { x: 0, y: 200 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      {
        id: "strategic-question-3",
        name: "Pergunta Estratégica 3: Objetivos",
        elements: [
          {
            id: "sq3-title",
            type: "text",
            content: "O QUE VOCÊ MAIS QUER ALCANÇAR?",
            style: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc2626",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "sq3-option-a",
            type: "button",
            content: "Mais confiança no meu visual",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "sq3-option-b",
            type: "button",
            content: "Economizar tempo e dinheiro",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
              marginBottom: "12px",
            },
            position: { x: 0, y: 140 },
          },
          {
            id: "sq3-option-c",
            type: "button",
            content: "Impressionar profissionalmente",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "12px 24px",
            },
            position: { x: 0, y: 200 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: true,
          allowReturn: true,
        },
      },
      // Páginas de Transição
      {
        id: "transition-1",
        name: "Transição 1: Análise",
        elements: [
          {
            id: "transition1-title",
            type: "text",
            content: "Analisando suas respostas...",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#7c3aed",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "transition1-subtitle",
            type: "text",
            content:
              "Estamos criando seu perfil personalizado baseado em suas preferências",
            style: {
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#6b7280",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "transition1-loading",
            type: "text",
            content: "⏳ Processando...",
            style: { fontSize: "1.5rem", textAlign: "center" },
            position: { x: 0, y: 160 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: false,
          allowReturn: false,
        },
      },
      {
        id: "transition-2",
        name: "Transição 2: Preparação",
        elements: [
          {
            id: "transition2-title",
            type: "text",
            content: "Quase pronto!",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#7c3aed",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "transition2-subtitle",
            type: "text",
            content:
              "Preparando seus resultados exclusivos e recomendações personalizadas...",
            style: {
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#6b7280",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "transition2-progress",
            type: "text",
            content: "✨ 95% concluído",
            style: {
              fontSize: "1.3rem",
              textAlign: "center",
              color: "#10b981",
            },
            position: { x: 0, y: 160 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: false,
          allowReturn: false,
        },
      },
      // Resultado (/resultado - ResultPage)
      {
        id: "result-page",
        name: "Resultado (/resultado)",
        elements: [
          {
            id: "result-title",
            type: "text",
            content: "Seu Estilo Pessoal Foi Descoberto!",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#1f2937",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "result-type",
            type: "text",
            content: "Você é do tipo: ELEGANTE CLÁSSICO",
            style: {
              fontSize: "1.8rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#3b82f6",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "result-description",
            type: "text",
            content:
              "Seu estilo combina sofisticação com praticidade. Você prefere peças atemporais que transmitem confiança e elegância.",
            style: {
              fontSize: "1.1rem",
              textAlign: "center",
              color: "#6b7280",
            },
            position: { x: 0, y: 140 },
          },
          {
            id: "result-image",
            type: "image",
            content:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmMWYxIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkVsZWdhbnRlIENsw6Fzc2ljbzwvdGV4dD4KPHN2Zz4=",
            style: { width: "400px", height: "300px", borderRadius: "8px" },
            position: { x: 0, y: 200 },
          },
          {
            id: "result-cta",
            type: "button",
            content: "Ver Recomendações Personalizadas",
            style: {
              backgroundColor: "#10b981",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              fontSize: "1.1rem",
            },
            position: { x: 0, y: 320 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: false,
          allowReturn: false,
        },
      },
      // Oferta (/quiz-descubra-seu-estilo - QuizOfferPage)
      {
        id: "offer-page",
        name: "Oferta (/quiz-descubra-seu-estilo)",
        elements: [
          {
            id: "offer-title",
            type: "text",
            content: "Consultoria de Estilo Personalizada",
            style: {
              fontSize: "2.2rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#1f2937",
            },
            position: { x: 0, y: 0 },
          },
          {
            id: "offer-subtitle",
            type: "text",
            content:
              "Baseado no seu perfil único, criamos um guia completo com:",
            style: {
              fontSize: "1.3rem",
              textAlign: "center",
              color: "#6b7280",
            },
            position: { x: 0, y: 80 },
          },
          {
            id: "offer-benefits",
            type: "text",
            content:
              "✓ Análise completa do seu biotipo\n✓ Guia de cores personalizadas\n✓ Looks prontos para cada ocasião\n✓ Lista de compras inteligente",
            style: {
              fontSize: "1.1rem",
              textAlign: "left",
              color: "#374151",
              lineHeight: "1.8",
            },
            position: { x: 0, y: 140 },
          },
          {
            id: "offer-price-old",
            type: "text",
            content: "De R$ 497",
            style: {
              fontSize: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              textDecoration: "line-through",
            },
            position: { x: 0, y: 260 },
          },
          {
            id: "offer-price-new",
            type: "text",
            content: "Por apenas R$ 197",
            style: {
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc2626",
            },
            position: { x: 0, y: 300 },
          },
          {
            id: "offer-urgency",
            type: "text",
            content: "🔥 Oferta por tempo limitado!",
            style: {
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#dc2626",
              fontWeight: "bold",
            },
            position: { x: 0, y: 360 },
          },
          {
            id: "offer-form-name",
            type: "input",
            content: "Seu nome completo",
            style: {
              width: "100%",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
            },
            position: { x: 0, y: 420 },
          },
          {
            id: "offer-form-email",
            type: "input",
            content: "Seu melhor email",
            style: {
              width: "100%",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
            },
            position: { x: 0, y: 480 },
          },
          {
            id: "offer-cta",
            type: "button",
            content: "QUERO MINHA CONSULTORIA AGORA!",
            style: {
              backgroundColor: "#dc2626",
              color: "white",
              padding: "20px 40px",
              borderRadius: "8px",
              fontSize: "1.3rem",
              fontWeight: "bold",
              width: "100%",
            },
            position: { x: 0, y: 540 },
          },
          {
            id: "offer-guarantee",
            type: "text",
            content: "🔒 Garantia de 30 dias ou seu dinheiro de volta",
            style: { fontSize: "1rem", textAlign: "center", color: "#10b981" },
            position: { x: 0, y: 620 },
          },
        ],
        settings: {
          showLogo: true,
          showProgress: false,
          allowReturn: false,
        },
      },
    ],
    currentStepId: "intro",
    selectedElementId: null,
    history: [],
    historyIndex: -1,
  };

  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};
