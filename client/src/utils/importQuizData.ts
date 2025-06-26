import { QuizQuestion } from "@/types/quiz";
import { EditorState, EditorStep, EditorElement } from "@/types/editor";
import { clothingQuestions } from "@/data/questions/clothingQuestions";
import { saveQuizConfig } from "@/utils/quizStorage";

/**
 * Converte dados do quiz real para o formato do editor
 */
export const importQuizDataToEditor = (): EditorState => {
  const steps: EditorStep[] = [];

  // 1. Página de Introdução
  steps.push({
    id: "intro",
    name: "Introdução",
    elements: [
      {
        id: "intro-logo",
        type: "image",
        content: {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_70,w_120,h_50,c_fit/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          alt: "Logo da Marca",
        },
        style: {
          width: "120px",
          height: "50px",
          margin: "0 auto 2rem auto",
          display: "block",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "intro-title",
        type: "heading",
        content: { text: "Descubra Seu Estilo Único", level: 1 },
        style: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#1a1a1a",
          marginBottom: "1rem",
        },
        position: { x: 0, y: 80 },
      },
      {
        id: "intro-subtitle",
        type: "text",
        content: {
          text: "Responda algumas perguntas e encontre o estilo perfeito para você",
        },
        style: {
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#666",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 140 },
      },
      {
        id: "intro-image",
        type: "image",
        content: {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up",
          alt: "Imagem de introdução",
        },
        style: {
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          margin: "0 auto 2rem auto",
          display: "block",
          borderRadius: "12px",
        },
        position: { x: 0, y: 200 },
      },
      {
        id: "intro-input",
        type: "input",
        content: {
          label: "Seu nome",
          placeholder: "Digite seu nome...",
          type: "text",
          required: true,
          name: "userName",
        },
        style: {
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto 2rem auto",
          display: "block",
        },
        position: { x: 0, y: 300 },
      },
      {
        id: "start-button",
        type: "button",
        content: { text: "Iniciar Quiz", action: "next" },
        style: {
          backgroundColor: "#007bff",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          border: "none",
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        },
        position: { x: 0, y: 380 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: false,
      allowReturn: false,
    },
  });

  // 2. Perguntas do Quiz (convertendo as perguntas reais)
  clothingQuestions.forEach((question, index) => {
    const elements: EditorElement[] = [];

    // Título da pergunta
    elements.push({
      id: `q${index + 1}-title`,
      type: "heading",
      content: { text: question.title, level: 2 },
      style: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "2rem",
        color: "#1a1a1a",
      },
      position: { x: 0, y: 0 },
    });

    // Opções da pergunta
    question.options.forEach((option, optionIndex) => {
      // Imagem da opção (se houver)
      if (option.imageUrl) {
        elements.push({
          id: `q${index + 1}-option-${optionIndex + 1}-image`,
          type: "image",
          content: {
            src: option.imageUrl,
            alt: `Opção ${optionIndex + 1}`,
          },
          style: {
            width: "200px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            margin: "0.5rem",
          },
          position: {
            x: (optionIndex % 3) * 220,
            y: 80 + Math.floor(optionIndex / 3) * 200,
          },
        });
      }

      // Texto da opção
      elements.push({
        id: `q${index + 1}-option-${optionIndex + 1}-text`,
        type: "text",
        content: { text: option.text },
        style: {
          fontSize: "0.9rem",
          textAlign: "center",
          padding: "0.5rem",
          maxWidth: "200px",
        },
        position: {
          x: (optionIndex % 3) * 220,
          y: 240 + Math.floor(optionIndex / 3) * 200,
        },
      });
    });

    // Botão de continuar
    elements.push({
      id: `q${index + 1}-continue`,
      type: "button",
      content: { text: "Continuar", action: "next" },
      style: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        margin: "2rem auto 0 auto",
        display: "block",
      },
      position: { x: 0, y: 400 },
    });

    steps.push({
      id: `question-${index + 1}`,
      name: `Pergunta ${index + 1}: ${question.title.substring(0, 30)}...`,
      elements,
      settings: {
        showLogo: true,
        showProgress: true,
        allowReturn: true,
        questionData: {
          id: question.id,
          type: question.type,
          multiSelect: question.multiSelect,
          options: question.options,
        },
      },
    });
  });

  // 3. Páginas de Transição
  steps.push({
    id: "transition-1",
    name: "Transição 1",
    elements: [
      {
        id: "transition-1-title",
        type: "heading",
        content: { text: "Analisando suas respostas...", level: 2 },
        style: {
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "transition-1-text",
        type: "text",
        content: {
          text: "Estamos processando suas preferências para encontrar seu estilo único.",
        },
        style: {
          fontSize: "1.1rem",
          textAlign: "center",
          color: "#666",
        },
        position: { x: 0, y: 80 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: true,
      allowReturn: false,
      autoAdvance: true,
      autoAdvanceDelay: 3000,
    },
  });

  steps.push({
    id: "transition-2",
    name: "Transição 2",
    elements: [
      {
        id: "transition-2-title",
        type: "heading",
        content: { text: "Quase pronto!", level: 2 },
        style: {
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "transition-2-text",
        type: "text",
        content: { text: "Preparando seu perfil de estilo personalizado..." },
        style: {
          fontSize: "1.1rem",
          textAlign: "center",
          color: "#666",
        },
        position: { x: 0, y: 80 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: true,
      allowReturn: false,
      autoAdvance: true,
      autoAdvanceDelay: 2000,
    },
  });

  // 4. Página de Resultado
  steps.push({
    id: "result",
    name: "Resultado",
    elements: [
      {
        id: "result-title",
        type: "heading",
        content: { text: "Seu Estilo Único foi Descoberto!", level: 1 },
        style: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#1a1a1a",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "result-description",
        type: "text",
        content: {
          text: "Baseado em suas respostas, identificamos o estilo que mais combina com sua personalidade.",
        },
        style: {
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#666",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 80 },
      },
      {
        id: "result-style-name",
        type: "heading",
        content: { text: "Estilo [RESULTADO]", level: 2 },
        style: {
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#007bff",
          marginBottom: "1rem",
        },
        position: { x: 0, y: 140 },
      },
      {
        id: "result-image",
        type: "image",
        content: {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmMWYxIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPlJlc3VsdGFkbyBkbyBFc3RpbG88L3RleHQ+Cjwvc3ZnPg==",
          alt: "Resultado do estilo",
        },
        style: {
          width: "400px",
          height: "300px",
          objectFit: "cover",
          borderRadius: "12px",
          margin: "0 auto 2rem auto",
          display: "block",
        },
        position: { x: 0, y: 200 },
      },
      {
        id: "result-cta",
        type: "button",
        content: { text: "Ver Oferta Especial", action: "next" },
        style: {
          backgroundColor: "#28a745",
          color: "white",
          padding: "15px 30px",
          borderRadius: "6px",
          border: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        },
        position: { x: 0, y: 520 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: false,
      allowReturn: false,
    },
  });

  // 5. Página de Oferta
  steps.push({
    id: "offer",
    name: "Oferta Especial",
    elements: [
      {
        id: "offer-title",
        type: "heading",
        content: { text: "Oferta Especial Para Você!", level: 1 },
        style: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#dc3545",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "offer-subtitle",
        type: "text",
        content: {
          text: "Transforme seu guarda-roupa com peças selecionadas especialmente para seu estilo.",
        },
        style: {
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#666",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 80 },
      },
      {
        id: "offer-price",
        type: "text",
        content: { text: "De R$ 297,00 por apenas R$ 97,00" },
        style: {
          fontSize: "1.8rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#28a745",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 140 },
      },
      {
        id: "offer-cta",
        type: "button",
        content: { text: "Quero Aproveitar Esta Oferta!", action: "purchase" },
        style: {
          backgroundColor: "#dc3545",
          color: "white",
          padding: "20px 40px",
          borderRadius: "6px",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
          animation: "pulse 2s infinite",
        },
        position: { x: 0, y: 220 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: false,
      allowReturn: false,
    },
  });

  return {
    steps,
    currentStepId: "intro",
    selectedElementId: null,
    draggedElementId: null,
    history: [],
    settings: {
      theme: "light",
      showGrid: true,
      snapToGrid: true,
      gridSize: 10,
    },
  };
};

/**
 * Importa dados do quiz real e salva no editor
 */
export const importRealQuizData = async (): Promise<void> => {
  const editorState = importQuizDataToEditor();
  saveQuizConfig(editorState);
};
