import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { normalQuestions, strategicQuestions } from '@/data/quizQuestions';

interface QuizDataSyncProps {
  currentFunnel: any;
  onFunnelUpdate: (newFunnel: any) => void;
}

export default function QuizDataSync({ currentFunnel, onFunnelUpdate }: QuizDataSyncProps) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'outdated' | 'syncing'>('outdated');
  const [differences, setDifferences] = useState<string[]>([]);

  useEffect(() => {
    checkSyncStatus();
  }, [currentFunnel]);

  const checkSyncStatus = () => {
    const realQuizTotal = normalQuestions.length + strategicQuestions.length;
    const editorTotal = currentFunnel.pages?.length || 0;
    
    const diffs: string[] = [];
    
    if (editorTotal !== realQuizTotal + 3) {
      diffs.push(`Total de páginas: Editor tem ${editorTotal}, Quiz real precisa de ${realQuizTotal + 3}`);
    }
    
    const normalQuestionsInEditor = currentFunnel.pages?.filter((page: any) => 
      page.type === 'question' && !page.title.includes('Estratégica')
    ) || [];
    
    if (normalQuestionsInEditor.length !== normalQuestions.length) {
      diffs.push(`Questões normais: Editor tem ${normalQuestionsInEditor.length}, precisa de ${normalQuestions.length}`);
    }
    
    const strategicQuestionsInEditor = currentFunnel.pages?.filter((page: any) => 
      page.type === 'strategic' || page.title.includes('Estratégica')
    ) || [];
    
    if (strategicQuestionsInEditor.length !== strategicQuestions.length) {
      diffs.push(`Questões estratégicas: Editor tem ${strategicQuestionsInEditor.length}, precisa de ${strategicQuestions.length}`);
    }
    
    setDifferences(diffs);
    setSyncStatus(diffs.length === 0 ? 'synced' : 'outdated');
  };

  const syncWithRealQuiz = () => {
    setSyncStatus('syncing');
    
    const syncedPages = [];
    
    // 1. Página de introdução
    syncedPages.push({
      id: 'page-intro',
      title: 'Introdução do Quiz',
      type: 'intro',
      progress: 0,
      showHeader: true,
      showProgress: false,
      components: [
        {
          id: 'logo-intro',
          type: 'image',
          data: {
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            alt: 'Logo Gisele Galvão'
          }
        },
        {
          id: 'title-intro',
          type: 'heading',
          data: { text: 'DESCUBRA SEU ESTILO PESSOAL' }
        },
        {
          id: 'subtitle-intro',
          type: 'text',
          data: { text: 'Responda algumas perguntas e descubra qual estilo combina mais com você!' }
        },
        {
          id: 'input-name',
          type: 'input',
          data: { label: 'SEU NOME', placeholder: 'Digite seu primeiro nome', required: true }
        },
        {
          id: 'button-start',
          type: 'button',
          data: { buttonText: 'COMEÇAR TESTE', actionType: 'goToNextStep' }
        }
      ]
    });
    
    // 2. Questões normais (1-10)
    normalQuestions.forEach((question, index) => {
      syncedPages.push({
        id: `page-q${index + 1}`,
        title: `Questão ${index + 1} - ${question.title.slice(0, 30)}...`,
        type: 'question',
        progress: Math.round(((index + 1) / (normalQuestions.length + strategicQuestions.length)) * 100),
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: `title-q${index + 1}`,
            type: 'heading',
            data: { text: question.title }
          },
          ...(question.imageUrl ? [{
            id: `image-q${index + 1}`,
            type: 'image',
            data: { src: question.imageUrl, alt: `Imagem questão ${index + 1}` }
          }] : []),
          {
            id: `options-q${index + 1}`,
            type: 'options',
            data: {
              questionText: question.title,
              selectionType: 'multiple',
              maxSelections: question.multiSelect || 3,
              minSelections: question.multiSelect || 3,
              choices: question.options.map(option => ({
                text: option.text,
                value: option.id,
                image: option.imageUrl,
                scoreValue: option.points || 1,
                styleCategory: option.styleCategory
              }))
            }
          },
          {
            id: `button-next-q${index + 1}`,
            type: 'button',
            data: { buttonText: 'PRÓXIMA', actionType: 'goToNextStep' }
          }
        ]
      });
    });
    
    // 3. Página de transição
    syncedPages.push({
      id: 'page-transition',
      title: 'Transição',
      type: 'transition',
      progress: 65,
      showHeader: true,
      showProgress: true,
      components: [
        {
          id: 'title-transition',
          type: 'heading',
          data: { text: 'Agora vamos conhecer um pouco mais sobre você!' }
        },
        {
          id: 'text-transition',
          type: 'text',
          data: { text: 'Essas informações nos ajudarão a personalizar ainda mais seu resultado.' }
        },
        {
          id: 'button-continue',
          type: 'button',
          data: { buttonText: 'CONTINUAR', actionType: 'goToNextStep' }
        }
      ]
    });
    
    // 4. Questões estratégicas
    strategicQuestions.forEach((question, index) => {
      syncedPages.push({
        id: `page-sq${index + 1}`,
        title: `Estratégica ${index + 1} - ${question.title.slice(0, 30)}...`,
        type: 'strategic',
        progress: 70 + (index * 5),
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: `title-sq${index + 1}`,
            type: 'heading',
            data: { text: question.title }
          },
          {
            id: `options-sq${index + 1}`,
            type: 'options',
            data: {
              questionText: question.title,
              selectionType: 'single',
              maxSelections: 1,
              minSelections: 1,
              choices: question.options.map(option => ({
                text: option.text,
                value: option.id,
                scoreValue: 0
              }))
            }
          },
          {
            id: `button-next-sq${index + 1}`,
            type: 'button',
            data: { buttonText: index === strategicQuestions.length - 1 ? 'VER RESULTADO' : 'PRÓXIMA', actionType: 'goToNextStep' }
          }
        ]
      });
    });
    
    // 5. Página de resultado
    syncedPages.push({
      id: 'page-result-sync',
      title: 'Resultado',
      type: 'result',
      progress: 100,
      showHeader: false,
      showProgress: false,
      components: [
        {
          id: 'result-content',
          type: 'customComponent',
          data: {
            componentName: 'ResultPage.tsx',
            resultType: 'styleAnalysis'
          }
        }
      ]
    });
    
    const syncedFunnel = {
      ...currentFunnel,
      name: 'Quiz de Estilo Pessoal - Sincronizado',
      pages: syncedPages
    };
    
    onFunnelUpdate(syncedFunnel);
    
    setTimeout(() => {
      setSyncStatus('synced');
      setDifferences([]);
    }, 1000);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Quiz Real
          </CardTitle>
          <Badge 
            variant={syncStatus === 'synced' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {syncStatus === 'synced' ? 'OK' : 
             syncStatus === 'syncing' ? '...' : 
             'Diferente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {syncStatus === 'synced' ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Sincronizado</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Diferenças:</p>
                <ul className="space-y-1 text-xs">
                  {differences.map((diff, index) => (
                    <li key={index} className="text-gray-600">• {diff}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={syncWithRealQuiz}
              disabled={syncStatus === 'syncing'}
              size="sm"
              className="w-full"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Sincronizar
            </Button>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          <p>Real: {normalQuestions.length} questões + {strategicQuestions.length} estratégicas</p>
          <p>Editor: {currentFunnel.pages?.length || 0} páginas</p>
        </div>
      </CardContent>
    </Card>
  );
}