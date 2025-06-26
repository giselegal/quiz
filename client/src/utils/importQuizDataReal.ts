import { QuizQuestion } from "@/types/quiz";
import { EditorState, EditorStep, EditorElement } from "@/types/editor";
import { clothingQuestions } from "@/data/questions/clothingQuestions";
import { strategicQuestions } from "@/data/strategicQuestions";
import { saveQuizConfig } from "@/utils/quizStorage";

/**
 * Converte dados do quiz real para o formato do editor
 * Baseado na análise completa dos componentes: QuizIntro, QuizContent, QuizTransition
 */
export const importQuizDataToEditor = (): EditorState => {
  const steps: EditorStep[] = [];

  // ===== 1. PÁGINA DE INTRODUÇÃO (QuizIntro) =====
  steps.push({
    id: "intro",
    name: "Introdução - QuizIntro",
    elements: [
      {
        id: "intro-logo",
        type: "image",
        content: {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_70,w_120,h_50,c_fit/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          alt: "Logo Gisele Galvão",
        },
        style: {
          width: "120px",
          height: "50px",
          objectFit: "contain",
          aspectRatio: "120 / 50",
          margin: "0 auto",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "intro-divider",
        type: "spacer",
        content: { height: 3 },
        style: {
          width: "300px",
          maxWidth: "90%",
          height: "3px",
          backgroundColor: "#B89B7A",
          borderRadius: "999px",
          margin: "6px auto 0",
        },
        position: { x: 0, y: 60 },
      },
      {
        id: "intro-main-title",
        type: "heading",
        content: {
          text: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
          level: 1,
        },
        style: {
          fontFamily: '"Playfair Display", serif',
          fontSize: "2rem",
          fontWeight: "400",
          textAlign: "center",
          color: "#432818",
          lineHeight: "1.2",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 90 },
      },
      {
        id: "intro-image",
        type: "image",
        content: {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_85,w_300,c_limit/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
          alt: "Descubra seu estilo predominante e transforme seu guarda-roupa",
        },
        style: {
          width: "300px",
          height: "204px",
          aspectRatio: "1.47",
          objectFit: "contain",
          borderRadius: "8px",
          margin: "0 auto",
          backgroundColor: "#F8F5F0",
        },
        position: { x: 0, y: 200 },
      },
      {
        id: "intro-description",
        type: "text",
        content: {
          text: "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        },
        style: {
          fontSize: "1rem",
          textAlign: "center",
          color: "#666",
          lineHeight: "1.6",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 420 },
      },
      {
        id: "intro-name-label",
        type: "text",
        content: { text: "NOME *" },
        style: {
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "#432818",
          marginBottom: "6px",
        },
        position: { x: 0, y: 500 },
      },
      {
        id: "intro-name-input",
        type: "input",
        content: {
          label: "Nome",
          placeholder: "Digite seu nome",
          type: "text",
          required: true,
          name: "userName",
        },
        style: {
          width: "100%",
          padding: "10px",
          backgroundColor: "#FEFEFE",
          borderRadius: "6px",
          border: "2px solid #B89B7A",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        },
        position: { x: 0, y: 530 },
      },
      {
        id: "intro-submit-button",
        type: "button",
        content: {
          text: "Quero Descobrir meu Estilo Agora!",
          action: "start-quiz",
        },
        style: {
          width: "100%",
          padding: "12px 16px",
          backgroundColor: "#B89B7A",
          color: "white",
          borderRadius: "6px",
          border: "none",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
        },
        position: { x: 0, y: 600 },
      },
      {
        id: "intro-privacy-notice",
        type: "text",
        content: {
          text: "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
        },
        style: {
          fontSize: "0.75rem",
          textAlign: "center",
          color: "#999",
          marginTop: "8px",
        },
        position: { x: 0, y: 680 },
      },
    ],
    settings: {
      showLogo: false, // Logo já está como elemento
      showProgress: false,
      allowReturn: false,
      backgroundColor: "#FAF9F7",
    },
  });

  // ===== 2. PERGUNTAS NORMAIS (clothingQuestions) =====
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
        color: "#432818",
        marginBottom: "2rem",
        textTransform: "uppercase",
      },
      position: { x: 0, y: 0 },
    });

    // Opções em grid
    question.options.forEach((option, optionIndex) => {
      const col = optionIndex % 3;
      const row = Math.floor(optionIndex / 3);

      // Container da opção
      elements.push({
        id: `q${index + 1}-option-${optionIndex + 1}-container`,
        type: "div",
        content: { className: "quiz-option-container" },
        style: {
          width: "200px",
          padding: "8px",
          border: "2px solid transparent",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textAlign: "center",
        },
        position: { x: col * 220, y: 80 + row * 280 },
      });

      // Imagem da opção
      if (option.imageUrl) {
        elements.push({
          id: `q${index + 1}-option-${optionIndex + 1}-image`,
          type: "image",
          content: {
            src: option.imageUrl,
            alt: `Opção ${optionIndex + 1}`,
          },
          style: {
            width: "180px",
            height: "140px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "8px",
          },
          position: { x: col * 220 + 10, y: 90 + row * 280 },
        });

        // Texto da opção
        elements.push({
          id: `q${index + 1}-option-${optionIndex + 1}-text`,
          type: "text",
          content: { text: option.text },
          style: {
            fontSize: "0.875rem",
            textAlign: "center",
            color: "#432818",
            lineHeight: "1.4",
            padding: "8px",
            maxWidth: "180px",
          },
          position: { x: col * 220 + 10, y: 240 + row * 280 },
        });
      }
    });

    // Instruções
    elements.push({
      id: `q${index + 1}-instructions`,
      type: "text",
      content: { text: "Escolha 3 opções que mais combinam com você" },
      style: {
        fontSize: "0.875rem",
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
        marginTop: "2rem",
      },
      position: { x: 0, y: 60 },
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
          multiSelect: question.multiSelect || 3,
          options: question.options,
        },
      },
    });
  });

  // ===== 3. TRANSIÇÃO PARA PERGUNTAS ESTRATÉGICAS =====
  steps.push({
    id: "transition-strategic",
    name: "Transição - Perguntas Estratégicas",
    elements: [
      {
        id: "transition-title",
        type: "heading",
        content: { text: "Enquanto calculamos o seu resultado...", level: 2 },
        style: {
          fontSize: "2rem",
          fontFamily: '"Playfair Display", serif',
          color: "#432818",
          textAlign: "center",
          marginBottom: "2rem",
          fontWeight: "600",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "transition-description-1",
        type: "text",
        content: {
          text: "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.",
        },
        style: {
          fontSize: "1rem",
          color: "#1A1818",
          opacity: "0.8",
          lineHeight: "1.6",
          marginBottom: "1rem",
        },
        position: { x: 0, y: 80 },
      },
      {
        id: "transition-description-2",
        type: "text",
        content: {
          text: "A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.",
        },
        style: {
          fontSize: "1rem",
          color: "#1A1818",
          opacity: "0.8",
          lineHeight: "1.6",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 140 },
      },
      {
        id: "transition-highlight",
        type: "text",
        content: {
          text: "Responda com sinceridade. Isso é só entre você e a sua nova versão.",
        },
        style: {
          fontSize: "1rem",
          color: "#432818",
          fontStyle: "italic",
          textAlign: "center",
          fontWeight: "500",
          backgroundColor: "rgba(184, 155, 122, 0.1)",
          padding: "1.5rem",
          borderRadius: "8px",
        },
        position: { x: 0, y: 220 },
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

  // ===== 4. PERGUNTAS ESTRATÉGICAS =====
  strategicQuestions.forEach((question, index) => {
    const elements: EditorElement[] = [];

    // Título da pergunta estratégica
    elements.push({
      id: `strategic-${index + 1}-title`,
      type: "heading",
      content: { text: question.title, level: 2 },
      style: {
        fontSize: "1.5rem",
        fontWeight: "600",
        textAlign: "center",
        color: "#432818",
        marginBottom: "2rem",
        lineHeight: "1.3",
      },
      position: { x: 0, y: 0 },
    });

    // Imagem da pergunta (se houver)
    if (question.imageUrl) {
      elements.push({
        id: `strategic-${index + 1}-image`,
        type: "image",
        content: {
          src: question.imageUrl,
          alt: `Pergunta estratégica ${index + 1}`,
        },
        style: {
          width: "300px",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          margin: "0 auto 2rem auto",
          display: "block",
        },
        position: { x: 0, y: 80 },
      });
    }

    // Opções verticais (perguntas estratégicas são de seleção única)
    question.options.forEach((option, optionIndex) => {
      elements.push({
        id: `strategic-${index + 1}-option-${optionIndex + 1}`,
        type: "button",
        content: {
          text: option.text,
          action: "select-option",
          value: option.id,
        },
        style: {
          width: "100%",
          maxWidth: "500px",
          padding: "16px 20px",
          margin: "8px auto",
          backgroundColor: "white",
          border: "2px solid #B89B7A",
          borderRadius: "8px",
          color: "#432818",
          fontSize: "1rem",
          textAlign: "left",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "block",
        },
        position: { x: 0, y: 300 + optionIndex * 80 },
      });
    });

    steps.push({
      id: `strategic-${index + 1}`,
      name: `Estratégica ${index + 1}: ${question.title.substring(0, 30)}...`,
      elements,
      settings: {
        showLogo: true,
        showProgress: true,
        allowReturn: true,
        questionData: {
          id: question.id,
          type: question.type,
          multiSelect: 1, // Perguntas estratégicas são sempre seleção única
          options: question.options,
        },
      },
    });
  });

  // ===== 5. TRANSIÇÃO FINAL =====
  steps.push({
    id: "final-transition",
    name: "Transição Final",
    elements: [
      {
        id: "final-transition-title",
        type: "heading",
        content: { text: "Analisando suas respostas...", level: 2 },
        style: {
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#432818",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "final-transition-text",
        type: "text",
        content: {
          text: "Em instantes você descobrirá seu estilo predominante!",
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
        id: "final-transition-spinner",
        type: "div",
        content: { className: "loading-spinner" },
        style: {
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #B89B7A",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto",
        },
        position: { x: 0, y: 140 },
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

  // ===== 6. PÁGINA DE RESULTADO =====
  steps.push({
    id: "result",
    name: "Resultado",
    elements: [
      {
        id: "result-title",
        type: "heading",
        content: { text: "Seu Estilo foi Descoberto!", level: 1 },
        style: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#432818",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "result-style-name",
        type: "heading",
        content: { text: "[RESULTADO DINÂMICO]", level: 2 },
        style: {
          fontSize: "2rem",
          fontWeight: "600",
          textAlign: "center",
          color: "#B89B7A",
          marginBottom: "2rem",
        },
        position: { x: 0, y: 80 },
      },
      {
        id: "result-description",
        type: "text",
        content: {
          text: "Baseado em suas respostas, este é o estilo que mais combina com sua personalidade e estilo de vida.",
        },
        style: {
          fontSize: "1.1rem",
          textAlign: "center",
          color: "#666",
          lineHeight: "1.6",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
        },
        position: { x: 0, y: 160 },
      },
      {
        id: "result-cta",
        type: "button",
        content: { text: "Ver Oferta Especial", action: "go-to-offer" },
        style: {
          backgroundColor: "#28a745",
          color: "white",
          padding: "16px 32px",
          borderRadius: "8px",
          border: "none",
          fontSize: "1.2rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        },
        position: { x: 0, y: 280 },
      },
    ],
    settings: {
      showLogo: true,
      showProgress: false,
      allowReturn: false,
    },
  });

  // ===== 7. PÁGINA DE OFERTA =====
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
          color: "#dc3545",
          marginBottom: "2rem",
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
          lineHeight: "1.6",
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
        position: { x: 0, y: 160 },
      },
      {
        id: "offer-cta",
        type: "button",
        content: { text: "Quero Aproveitar Esta Oferta!", action: "purchase" },
        style: {
          backgroundColor: "#dc3545",
          color: "white",
          padding: "20px 40px",
          borderRadius: "8px",
          border: "none",
          fontSize: "1.3rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
          animation: "pulse 2s infinite",
        },
        position: { x: 0, y: 240 },
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
      showGrid: false,
      snapToGrid: true,
      gridSize: 10,
      backgroundColor: "#FAF9F7",
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
