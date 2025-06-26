
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnifiedEditorState } from '@/types/unifiedEditor';

interface TypeformEditorProps {
  editorState: UnifiedEditorState;
  onStateChange: (newState: UnifiedEditorState) => void;
  isPreviewing: boolean;
}

const TypeformEditor: React.FC<TypeformEditorProps> = ({
  editorState,
  onStateChange,
  isPreviewing
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = editorState.quizEditorState.components || [];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    // Safely access questions and options with proper type checking
    const newQuestions = [...questions];
    if (!newQuestions[currentQuestionIndex]) return;

    const currentQuestion = newQuestions[currentQuestionIndex];
    // Check if data.options property exists instead of direct options
    if (!currentQuestion?.data?.options) return;

    const selectedOption = currentQuestion.data.options.find((option: any) => option.id === optionId);
    if (selectedOption) {
      selectedOption.isSelected = !selectedOption.isSelected;
      onStateChange({
        ...editorState,
        quizEditorState: {
          ...editorState.quizEditorState,
          components: newQuestions
        }
      });
    }
  };

  const handleSaveChanges = () => {
    console.log('Salvando alterações...', editorState);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const handleLiveEdit = (changes: any) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === currentQuestionIndex) {
        return {
          ...question,
          ...changes
        };
      }
      return question;
    });
    onStateChange({
      ...editorState,
      quizEditorState: {
        ...editorState.quizEditorState,
        components: updatedQuestions
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <AnimatePresence initial={false} custom={currentQuestionIndex}>
          <motion.div
            key={currentQuestionIndex}
            custom={currentQuestionIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full max-w-2xl mx-auto text-center"
          >
            {questions[currentQuestionIndex] && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {questions[currentQuestionIndex]?.data?.title || "Question Title"}
                </h2>
                <div className="grid gap-4">
                  {questions[currentQuestionIndex]?.data?.options?.map((option: any, index: number) => (
                    <Button
                      key={option.id || `option-${index}`}
                      variant="outline"
                      className={cn(
                        "w-full p-6 text-left hover:bg-indigo-50 hover:border-indigo-300 transition-all",
                        "flex items-center justify-between group"
                      )}
                      onClick={() => {
                        if (questions[currentQuestionIndex]?.data?.options) {
                          const newOptions = [...questions[currentQuestionIndex].data.options];
                          if (newOptions[index]) {
                            newOptions[index] = { ...option, isSelected: !option.isSelected };
                            handleLiveEdit({ data: { ...questions[currentQuestionIndex].data, options: newOptions } });
                          }
                        }
                      }}
                    >
                      <span className="text-lg">{option.text}</span>
                      <ChevronDown className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 text-center text-sm text-gray-500">
        {currentQuestionIndex + 1} de {questions.length}
      </div>
    </div>
  );
};

export default TypeformEditor;
