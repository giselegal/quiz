import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LANDING_PAGE_AB_TEST, getABTestRedirectUrl } from "../utils/abtest";

interface ABTestRedirectProps {
  children?: React.ReactNode;
}

/**
 * Componente que gerencia o redirecionamento baseado no teste A/B
 * Redireciona automaticamente apenas da rota raiz, mas permite acesso direto ao quiz
 */
const ABTestRedirect: React.FC<ABTestRedirectProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const urlParams = new URLSearchParams(location.search);

    // Verifica se há parâmetro para forçar exibição do quiz
    const forceQuiz =
      urlParams.get("quiz") === "true" ||
      urlParams.get("force-quiz") === "true";
    const skipAbTest = urlParams.get("skip-ab") === "true";

    // Só faz redirecionamento da rota raiz para evitar loops
    if (currentPath === "/" && !forceQuiz && !skipAbTest) {
      const redirectUrl = getABTestRedirectUrl(LANDING_PAGE_AB_TEST);

      console.log(
        `🔄 A/B Test: Redirecionando de ${currentPath} para ${redirectUrl}`
      );

      // Preserva query parameters na URL
      const searchParams = location.search;
      navigate(redirectUrl + searchParams, { replace: true });
    } else if (forceQuiz || skipAbTest) {
      console.log(
        `🎯 Acesso direto ao quiz solicitado - parâmetro: ${
          forceQuiz ? "quiz=true" : "skip-ab=true"
        }`
      );
    }
  }, [location, navigate]);

  return <>{children}</>;
};

export default ABTestRedirect;
