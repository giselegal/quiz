
import React, { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ResultHeader from '../quiz-result/ResultHeader';
import PrimaryStyleCard from '../quiz-result/PrimaryStyleCard';
import SecondaryStylesSection from '../quiz-result/SecondaryStylesSection';
import OfferCard from '../quiz-result/sales/OfferCard';
import { EditSectionOverlay } from './EditSectionOverlay';
import { toast } from '@/components/ui/use-toast';

interface EditableComponentProps {
  components: {
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
    config: any;
  };
  onUpdate: (sectionKey: string, data: any) => void;
}

const EditableComponent: React.FC<EditableComponentProps> = ({
  components: { primaryStyle, secondaryStyles, config },
  onUpdate
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Visitante');
  
  useEffect(() => {
    // Carregar nome do usuário do localStorage se disponível
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Log para debugging
    console.log('Config carregada no EditableComponent:', config);
  }, []);
  
  // Quando o usuário clica para editar uma seção
  const handleEditSection = (sectionKey: string) => {
    console.log(`Editando seção: ${sectionKey}`);
    console.log('Dados da seção:', getSectionData(config, sectionKey));
    setActiveSection(sectionKey);
  };
  
  // Salvar alterações da seção
  const handleSaveSection = (data: any) => {
    if (!activeSection) return;
    
    console.log(`Salvando seção: ${activeSection}`);
    console.log('Novos dados:', data);
    
    try {
      onUpdate(activeSection, data);
      toast({
        title: "Alterações salvas",
        description: `Seção ${getSectionTitle(activeSection)} atualizada com sucesso.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
        duration: 5000
      });
    }
    
    setActiveSection(null);
  };
  
  // Inicializar configurações padrão se necessário
  const headerConfig = config?.header?.content || { title: `Olá, ${userName}, seu Estilo Predominante é:` };
  const primaryStyleConfig = config?.mainContent?.content || { description: '' };
  const offerConfig = config?.offer?.hero?.content || { title: "VOCÊ DESCOBRIU SEU ESTILO" };

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="relative max-w-4xl mx-auto p-6">
        <div className={activeSection ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
          {/* Seção do cabeçalho - Editável */}
          <div 
            className="relative py-6 group cursor-pointer"
            onClick={() => handleEditSection('header.content')}
          >
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
              Editar cabeçalho
            </div>
            
            <ResultHeader 
              userName={userName} 
              customTitle={headerConfig.title} 
            />
          </div>
          
          {/* Seção do estilo primário - Editável */}
          <Card className="p-6 bg-white shadow-md border border-[#B89B7A]/20 mb-8 relative group cursor-pointer"
                onClick={() => handleEditSection('mainContent.content')}>
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
              Editar estilo primário
            </div>
            
            <PrimaryStyleCard 
              primaryStyle={primaryStyle} 
              customDescription={primaryStyleConfig.description}
              customImage={primaryStyleConfig.customImage}
            />
            
            <div className="mt-6">
              <SecondaryStylesSection secondaryStyles={secondaryStyles} />
            </div>
          </Card>

          {/* Seção de oferta - Editável */}
          <div 
            className="relative group cursor-pointer mb-8" 
            onClick={() => handleEditSection('offer.hero.content')}
          >
            <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
              Editar oferta
            </div>
            
            <OfferCard 
              primaryStyle={primaryStyle} 
              config={offerConfig} 
            />
          </div>
        </div>
        
        {/* Overlay de edição */}
        {activeSection && (
          <EditSectionOverlay
            section={activeSection}
            data={getSectionData(config, activeSection)}
            onSave={handleSaveSection}
            onCancel={() => setActiveSection(null)}
          />
        )}
      </div>
    </ScrollArea>
  );
};

// Função auxiliar para obter dados de uma seção por caminho
function getSectionData(config: any, path: string): any {
  if (!config) return {};
  
  const parts = path.split('.');
  let current: any = config;
  
  for (const part of parts) {
    if (!current || current[part] === undefined) {
      console.warn("Caminho " + path + " não encontrado no config:", current);
      return {};
    }
    current = current[part];
  }
  
  return current || {};
}

// Função para obter título legível para a seção
function getSectionTitle(section: string): string {
  const sectionMap: Record<string, string> = {
    'header.content': 'Cabeçalho',
    'mainContent.content': 'Estilo Principal',
    'offer.hero.content': 'Oferta Principal',
    'offer.products.content': 'Produtos',
    'offer.benefits.content': 'Benefícios',
    'offer.pricing.content': 'Preço',
    'offer.testimonials.content': 'Depoimentos',
    'offer.guarantee.content': 'Garantia',
  };
  
  return sectionMap[section] || section;
}

export default EditableComponent;
