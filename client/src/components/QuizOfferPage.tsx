// Componente migrado de src/pages_backup/QuizOfferPage.tsx para uso no roteador SPA
"use client";

import React from "react";
import { QuizOfferHero } from "@/components/quiz-offer/QuizOfferHero";
import { QuizOfferCTA } from "@/components/quiz-offer/QuizOfferCTA";
import { useUniversalNavigation } from "../hooks/useUniversalNavigation";
import { useQuizStyles } from "@/hooks/useQuizConfig";

export default function QuizOfferPage() {
  const { navigate } = useUniversalNavigation();
  const { cssVariables } = useQuizStyles();

  return (
    <div className="min-h-screen" style={cssVariables}>
      <QuizOfferHero onStartQuizClick={() => navigate("/")} />
      <QuizOfferCTA />
    </div>
  );
}
