import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizEditorState, QUIZ_CATEGORIES, QuizCategory } from '@/types/quizEditor';
import { QuizQuestion } from '@/types/quiz';
import { QuizTemplate } from '@/types/quizTemplate';
import QuizCategoryTab from './QuizCategoryTab';
import QuestionEditor from './QuestionEditor';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateId } from '@/utils/idGenerator';

interface QuizEditorProps {
  initialTemplate?: QuizTemplate;
  onQuestionsUpdate?: (questions: QuizQuestion[]) => void;
  isPreviewing?: boolean;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ 
  initialTemplate, 
  onQuestionsUpdate, 
  isPreviewing = false 
}) => {
  const [activeTab, setActiveTab] = useState<QuizCategory>('clothingQuestions');
  const [editorState, setEditorState] = useState<QuizEditorState>({
    questions: [],
    editingQuestionId: null,
    selectedCategory: null
  });

  // Inicializar com as perguntas do template, se fornecido
  useEffect(() => {
    if (initialTemplate?.questions) {
      setEditorState(prevState => ({
        ...prevState,
        questions: initialTemplate.questions,
        editingQuestionId: null
      }));
    }
  }, [initialTemplate]);

  // Carregar perguntas quando a categoria muda
  useEffect(() => {
    if (initialTemplate) {
      // Filtrar as perguntas pela categoria ativa
      setEditorState(prevState => ({
        ...prevState,
        questions: initialTemplate.questions.filter(q => 
          q.id.includes(activeTab) || activeTab === 'clothingQuestions'
        ),
        editingQuestionId: null
      }));
    }
  }, [activeTab, initialTemplate]);

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      title: 'Nova Pergunta',
      type: 'text',
      multiSelect: 3,
      options: []
    };
    
    setEditorState(prevState => ({
      ...prevState,
      questions: [...prevState.questions, newQuestion],
      editingQuestionId: newQuestion.id
    }));
  };

  const handleEditQuestion = (questionId: string) => {
    setEditorState(prevState => ({
      ...prevState,
      editingQuestionId: questionId
    }));
  };

  const handleSaveQuestion = (updatedQuestion: QuizQuestion) => {
    const updatedQuestions = editorState.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    
    setEditorState(prevState => ({
      ...prevState,
      questions: updatedQuestions,
      editingQuestionId: null
    }));
    
    // Atualizar todas as perguntas do template
    if (initialTemplate && onQuestionsUpdate) {
      const allQuestions = [...initialTemplate.questions];
      const questionIndex = allQuestions.findIndex(q => q.id === updatedQuestion.id);
      
      if (questionIndex >= 0) {
        allQuestions[questionIndex] = updatedQuestion;
      } else {
        allQuestions.push(updatedQuestion);
      }
      
      onQuestionsUpdate(allQuestions);
    }
    
    toast({
      title: 'Pergunta salva com sucesso',
      description: 'As alterações foram salvas.',
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = editorState.questions.filter(q => q.id !== questionId);
    
    setEditorState(prevState => ({
      ...prevState,
      questions: updatedQuestions,
      editingQuestionId: null
    }));
    
    // Atualizar todas as perguntas do template
    if (initialTemplate && onQuestionsUpdate) {
      const allQuestions = initialTemplate.questions.filter(q => q.id !== questionId);
      onQuestionsUpdate(allQuestions);
    }
    
    toast({
      title: 'Pergunta removida',
      description: 'A pergunta foi removida com sucesso.',
    });
  };

  const currentQuestion = editorState.editingQuestionId 
    ? editorState.questions.find(q => q.id === editorState.editingQuestionId)
    : null;

  const isEditingQuestion = !!currentQuestion;

  // Modo de visualização
  if (isPreviewing) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-[#432818]">Prévia do Quiz</h2>
          
          <div className="space-y-8">
            {editorState.questions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-4">
                  {index + 1}. {question.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map(option => (
                    <div 
                      key={option.id} 
                      className="border p-4 rounded-lg hover:bg-[#FAF9F7] cursor-pointer transition-colors"
                    >
                      {option.imageUrl && (
                        <div className="mb-3 rounded overflow-hidden h-32 flex items-center justify-center bg-gray-100">
                          <img 
                            src={option.imageUrl} 
                            alt={option.text} 
                            className="object-cover h-full w-full" 
                          />
                        </div>
                      )}
                      <p>{option.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left side - Category selection and question list */}
      <div className="w-1/3 border-r overflow-auto p-4">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as QuizCategory)}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="styleQuestions">Estilo</TabsTrigger>
            <TabsTrigger value="strategicQuestions">Estratégicas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="styleQuestions" className="space-y-4">
            {QUIZ_CATEGORIES.filter(cat => !cat.isStrategic).map(category => (
              <QuizCategoryTab 
                key={category.id}
                category={category}
                isActive={activeTab === category.id}
                onClick={() => setActiveTab(category.id)}
                questions={
                  category.id === activeTab 
                    ? editorState.questions 
                    : initialTemplate?.questions.filter(
                        q => q.id.includes(category.id)
                      ) || []
                }
                onEditQuestion={handleEditQuestion}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="strategicQuestions" className="space-y-4">
            {QUIZ_CATEGORIES.filter(cat => cat.isStrategic).map(category => (
              <QuizCategoryTab 
                key={category.id}
                category={category}
                isActive={activeTab === category.id}
                onClick={() => setActiveTab(category.id)}
                questions={
                  category.id === activeTab 
                    ? editorState.questions 
                    : initialTemplate?.questions.filter(
                        q => q.id.includes(category.id)
                      ) || []
                }
                onEditQuestion={handleEditQuestion}
              />
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button 
            onClick={handleAddQuestion} 
            className="w-full bg-[#B89B7A] hover:bg-[#A38A69]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pergunta
          </Button>
        </div>
      </div>
      
      {/* Right side - Question editor */}
      <div className="flex-1 overflow-auto p-4">
        {isEditingQuestion ? (
          <QuestionEditor 
            question={currentQuestion}
            onSave={handleSaveQuestion}
            onCancel={() => setEditorState(prev => ({...prev, editingQuestionId: null}))}
            onDelete={() => currentQuestion && handleDeleteQuestion(currentQuestion.id)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p className="text-lg mb-4">Selecione uma pergunta para editar ou crie uma nova.</p>
            <Button 
              variant="outline" 
              onClick={handleAddQuestion}
              className="border-[#B89B7A] text-[#B89B7A]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Pergunta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEditor;
