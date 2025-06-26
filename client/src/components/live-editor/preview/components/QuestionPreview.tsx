import React from "react";
import { Card } from "@/components/ui/card";
import { EditorStage, EditorComponent } from "@/hooks/useLiveEditor";
import { QuizContent } from "@/components/QuizContent";

interface QuestionPreviewProps {
  stage: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (
    componentId: string,
    updates: Partial<EditorComponent>
  ) => void;
  isPreviewMode: boolean;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode,
}) => {
  // Mock data para preview
  const mockQuestion = {
    id: "q1",
    title: "Como você definia o seu jeito de Ser?",
    type: "image" as const,
    options: [
      {
        id: "opt1",
        text: "Poucos detalhes, básico e prático.",
        styleCategory: "Natural",
        imageUrl: "https://example.com/image1.jpg",
      },
      {
        id: "opt2",
        text: "Bem discretos e sutis, clean e clássico.",
        styleCategory: "Clássico",
        imageUrl: "https://example.com/image2.jpg",
      },
    ],
    multiSelect: 3,
    imageUrl: "https://example.com/question.jpg",
  };

  if (isPreviewMode) {
    return (
      <div className="h-full bg-[#FAF9F7]">
        <QuizContent
          user={{ userName: "Preview User" }}
          currentQuestionIndex={0}
          totalQuestions={10}
          showingStrategicQuestions={false}
          currentStrategicQuestionIndex={0}
          currentQuestion={mockQuestion}
          currentAnswers={[]}
          handleAnswerSubmit={() => {}}
          handleNextClick={() => {}}
          handlePrevious={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FAF9F7] relative">
      {/* Background da questão atual */}
      <div className="absolute inset-0 opacity-50">
        <QuizContent
          user={{ userName: "Preview User" }}
          currentQuestionIndex={0}
          totalQuestions={10}
          showingStrategicQuestions={false}
          currentStrategicQuestionIndex={0}
          currentQuestion={mockQuestion}
          currentAnswers={[]}
          handleAnswerSubmit={() => {}}
          handleNextClick={() => {}}
          handlePrevious={() => {}}
        />
      </div>

      {/* Overlay editável */}
      <div className="absolute inset-0 z-10">
        {stage.components.map((component) => (
          <div
            key={component.id}
            className={`absolute border-2 transition-all cursor-pointer ${
              selectedComponentId === component.id
                ? "border-[#B89B7A] bg-[#B89B7A]/10"
                : "border-transparent hover:border-[#B89B7A]/50"
            }`}
            style={{
              left: component.position.x,
              top: component.position.y,
              width: component.size.width,
              height: component.size.height,
            }}
            onClick={() => onSelectComponent(component.id)}
          >
            <div
              className="w-full h-full rounded p-2 flex items-center justify-center"
              style={{ backgroundColor: "rgba(254, 254, 254, 0.8)" }}
            >
              <span className="text-sm font-medium text-[#432818]">
                {component.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
