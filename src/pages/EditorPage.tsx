import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultPageVisualEditor } from '@/components/result-editor/ResultPageVisualEditor';
import { TemplateList } from '@/components/editor/templates/TemplateList';
import { Button } from '@/components/ui/button';
// Importar ambos os templates
import { defaultResultTemplate, directOfferTemplate } from '@/config/resultPageTemplates';
import { createOfferSectionConfig } from '@/utils/config/offerDefaults';
import { ResultPageConfig } from '@/types/resultPageConfig'; // Para tipagem explícita

export const EditorPage = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  // Adicionar pageType aos parâmetros da rota
  const { pageType, style } = useParams<{ pageType?: string; style?: string }>();
  
  const styleCategory = (style as "Natural" | "Clássico" | "Contemporâneo" | "Elegante" | "Romântico" | "Sexy" | "Dramático" | "Criativo") || 'Natural';
  
  // Determinar qual template base usar
  let templateToUse: ResultPageConfig = defaultResultTemplate as ResultPageConfig;
  if (pageType === 'direct-offer') {
    templateToUse = directOfferTemplate as ResultPageConfig;
  }
  
  // Construir initialConfig com base no template selecionado
  const initialConfig: ResultPageConfig = {
    styleType: styleCategory,
    // Assumindo que header sempre existe nos templates base e é do tipo correto
    header: {
      ...(templateToUse.header!), // Usar ! para afirmar que header existe e é completo
      style: {
        ...(templateToUse.header!.style),
        borderRadius: '0' // Consistência
      }
    },
    
    // Incluir mainContent apenas se existir no templateToUse
    ...(templateToUse.mainContent && { 
      mainContent: {
        ...templateToUse.mainContent,
      }
    }),
    
    // Incluir offer se existir, senão usar um default
    offer: templateToUse.offer ? {
      ...templateToUse.offer,
    } : createOfferSectionConfig(), 
    
    // Incluir secondaryStyles apenas se existir no templateToUse
    ...(templateToUse.secondaryStyles && {
      secondaryStyles: {
        ...templateToUse.secondaryStyles,
      }
    }),

    globalStyles: {
      primaryColor: '#B89B7A',
      secondaryColor: '#432818',
      textColor: '#432818',
      backgroundColor: '#FAF9F7',
      fontFamily: 'Playfair Display, serif'
    },
    // Manter blocks como um array vazio se não estiver definido no template
    blocks: (templateToUse as any).blocks || [] 
  };
  
  return (
    <div className="h-screen">
      {showTemplates ? (
        <div className="p-8 max-w-4xl mx-auto">
          <Button
            onClick={() => setShowTemplates(false)}
            variant="outline"
            className="mb-4"
          >
            Voltar ao Editor
          </Button>
          <TemplateList onSelectTemplate={() => setShowTemplates(false)} />
        </div>
      ) : (
        <ResultPageVisualEditor 
          selectedStyle={{ // selectedStyle ainda é necessário pelo ResultPageVisualEditor
            category: styleCategory,
            score: 100,
            percentage: 100
          }} 
          onShowTemplates={() => setShowTemplates(true)}
          initialConfig={initialConfig} // Passar a configuração dinâmica
        />
      )}
    </div>
  );
};

export default EditorPage;
