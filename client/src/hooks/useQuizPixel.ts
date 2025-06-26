/**
 * Hook personalizado para gerenciar eventos de pixel específicos do quiz
 * Focado na página B do teste A/B (quiz-descubra-seu-estilo)
 */
import { useEffect, useCallback } from "react";
import {
  trackFunnelEvent,
  getCurrentFunnelConfig,
} from "../services/pixelManager";
import { trackPixelEvent } from "../utils/facebookPixel";

export const useQuizPixel = () => {
  const funnelConfig = getCurrentFunnelConfig();
  const isQuizPage = funnelConfig.funnelName === "quiz_embutido";

  // Eventos específicos para a página B do teste A/B
  const trackQuizStart = useCallback(() => {
    if (isQuizPage) {
      trackFunnelEvent("QuizStarted", {
        quiz_type: "descubra_seu_estilo",
        page_variant: "B",
        funnel_stage: "quiz_inicio",
      });

      trackPixelEvent("InitiateCheckout", {
        content_name: "Quiz Descubra Seu Estilo",
        content_category: "Quiz",
        value: 0,
        currency: "BRL",
      });
    }
  }, [isQuizPage]);

  const trackQuizProgress = useCallback(
    (questionNumber: number, totalQuestions: number) => {
      if (isQuizPage) {
        const progress = Math.round((questionNumber / totalQuestions) * 100);

        trackFunnelEvent("QuizProgress", {
          quiz_type: "descubra_seu_estilo",
          page_variant: "B",
          question_number: questionNumber,
          total_questions: totalQuestions,
          progress_percentage: progress,
          funnel_stage: "quiz_progresso",
        });

        // Evento de progresso aos 25%, 50%, 75%
        if (progress === 25 || progress === 50 || progress === 75) {
          trackPixelEvent("AddToCart", {
            content_name: `Quiz Progress ${progress}%`,
            content_category: "Quiz",
            value: (progress / 100) * 47, // Valor proporcional ao produto
            currency: "BRL",
          });
        }
      }
    },
    [isQuizPage]
  );

  const trackQuizComplete = useCallback(
    (result: string) => {
      if (isQuizPage) {
        trackFunnelEvent("QuizCompleted", {
          quiz_type: "descubra_seu_estilo",
          page_variant: "B",
          quiz_result: result,
          funnel_stage: "quiz_resultado",
        });

        trackPixelEvent("CompleteRegistration", {
          content_name: "Quiz Completo - Descubra Seu Estilo",
          content_category: "Quiz",
          value: 47,
          currency: "BRL",
          status: "completed",
        });
      }
    },
    [isQuizPage]
  );

  const trackCTAClick = useCallback(
    (ctaPosition: string) => {
      if (isQuizPage) {
        trackFunnelEvent("CTAClicked", {
          quiz_type: "descubra_seu_estilo",
          page_variant: "B",
          cta_position: ctaPosition,
          funnel_stage: "cta_click",
        });

        trackPixelEvent("Purchase", {
          content_name: "Manual de Estilo Contemporâneo",
          content_category: "Digital Product",
          value: 47,
          currency: "BRL",
          content_ids: ["manual-estilo-contemporaneo"],
          num_items: 1,
        });
      }
    },
    [isQuizPage]
  );

  const trackPageView = useCallback(() => {
    if (isQuizPage) {
      trackFunnelEvent("PageViewed", {
        quiz_type: "descubra_seu_estilo",
        page_variant: "B",
        funnel_stage: "page_view",
      });

      trackPixelEvent("ViewContent", {
        content_name: "Quiz Descubra Seu Estilo - Página B",
        content_category: "Quiz Landing Page",
        content_type: "product",
        value: 47,
        currency: "BRL",
      });
    }
  }, [isQuizPage]);

  const trackScroll = useCallback(
    (percentage: number) => {
      if (
        isQuizPage &&
        (percentage === 25 ||
          percentage === 50 ||
          percentage === 75 ||
          percentage === 90)
      ) {
        trackFunnelEvent("ScrollProgress", {
          quiz_type: "descubra_seu_estilo",
          page_variant: "B",
          scroll_percentage: percentage,
          funnel_stage: "scroll_tracking",
        });
      }
    },
    [isQuizPage]
  );

  // Inicialização automática do tracking de página
  useEffect(() => {
    if (isQuizPage) {
      trackPageView();
    }
  }, [isQuizPage, trackPageView]);

  return {
    trackQuizStart,
    trackQuizProgress,
    trackQuizComplete,
    trackCTAClick,
    trackPageView,
    trackScroll,
    isQuizPage,
  };
};
