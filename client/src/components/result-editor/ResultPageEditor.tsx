import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StyleResult } from '@/types/quiz';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import { toast } from '@/components/ui/use-toast';
import EditorToolbar from './EditorToolbar';
import EditableSection from './EditableSection';
import { Eye, EyeOff, Save, Undo } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import StyleEditor from './StyleEditor';
import GlobalStyleEditor from './GlobalStyleEditor';
import HeaderEditor from './editors/HeaderEditor';
import MainContentEditor from './editors/MainContentEditor';
import OfferHeroEditor from './editors/OfferHeroEditor';
import PricingEditor from './editors/PricingEditor';
import { set, get } from 'lodash';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';

interface ResultPageEditorProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

const ResultPageEditor: React.FC<ResultPageEditorProps> = ({
  primaryStyle,
  secondaryStyles
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingStyles, setEditingStyles] = useState(false);
  const [globalStylesOpen, setGlobalStylesOpen] = useState(false);

  const { 
    resultPageConfig, 
    updateSection, 
    saveConfig,
    resetConfig,
    importConfig,
    loading 
  } = useResultPageConfig(primaryStyle.category);

  const handleSave = async () => {
    try {
      await saveConfig();
      toast({
        title: 'Configurações salvas',
        description: 'As alterações foram salvas com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive'
      });
    }
  };

  const handleReset = () => {
    resetConfig(primaryStyle.category);
    toast({
      title: 'Configurações redefinidas',
      description: 'As configurações foram redefinidas para os valores padrão',
    });
  };

  const handleUpdateConfig = (newConfig: any) => {
    if (newConfig) {
      try {
        importConfig(newConfig);
        toast({
          title: "Configuração atualizada",
          description: "A configuração foi aplicada com sucesso",
        });
      } catch (error) {
        console.error('Error updating config:', error);
        toast({
          title: "Erro ao atualizar configuração",
          description: "Ocorreu um erro ao aplicar a configuração",
          variant: "destructive"
        });
      }
    }
  };

  const toggleSection = (sectionPath: string) => {
    const pathParts = sectionPath.split('.');
    const sectionName = pathParts[pathParts.length - 1];
    
    let currentSection = { ...resultPageConfig };
    pathParts.forEach((part, index) => {
      if (index < pathParts.length - 1) {
        currentSection = currentSection[part];
      }
    });
    
    const section = currentSection[sectionName];
    updateSection(sectionPath, { ...section, visible: !section.visible });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" color="#B89B7A" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <EditorToolbar 
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        isPreviewMode={previewMode}
        onSave={handleSave}
        onReset={handleReset}
        onEditGlobalStyles={() => setGlobalStylesOpen(true)}
        resultPageConfig={resultPageConfig}
        onUpdateConfig={handleUpdateConfig}
      />
      
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className={"transition-all duration-300 " + (previewMode ? '' : 'border-2 border-dashed border-gray-300 p-4 rounded-lg')}>
          {/* Header Section */}
          <EditableSection
            title="Cabeçalho"
            sectionPath="header"
            content={resultPageConfig.header.content}
            style={resultPageConfig.header.style}
            visible={resultPageConfig.header.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('header')}
            onToggleVisibility={() => toggleSection('header')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('header');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Main Content Section */}
          <EditableSection
            title="Estilo Principal"
            sectionPath="mainContent"
            content={resultPageConfig.mainContent.content}
            style={resultPageConfig.mainContent.style}
            visible={resultPageConfig.mainContent.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('mainContent')}
            onToggleVisibility={() => toggleSection('mainContent')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('mainContent');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Secondary Styles Section */}
          <EditableSection
            title="Estilos Secundários"
            sectionPath="secondaryStyles"
            content={resultPageConfig.secondaryStyles.content}
            style={resultPageConfig.secondaryStyles.style}
            visible={resultPageConfig.secondaryStyles.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('secondaryStyles')}
            onToggleVisibility={() => toggleSection('secondaryStyles')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('secondaryStyles');
            }}
            primaryStyle={primaryStyle}
            secondaryStyles={secondaryStyles}
          />
          
          {/* Offer Section */}
          <EditableSection
            title="Oferta Principal"
            sectionPath="offer.hero"
            content={resultPageConfig.offer.hero.content}
            style={resultPageConfig.offer.hero.style}
            visible={resultPageConfig.offer.hero.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.hero')}
            onToggleVisibility={() => toggleSection('offer.hero')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.hero');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Products Section */}
          <EditableSection
            title="Produtos e Bônus"
            sectionPath="offer.products"
            content={resultPageConfig.offer.products.content}
            style={resultPageConfig.offer.products.style}
            visible={resultPageConfig.offer.products.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.products')}
            onToggleVisibility={() => toggleSection('offer.products')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.products');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Benefits Section */}
          <EditableSection
            title="Benefícios"
            sectionPath="offer.benefits"
            content={resultPageConfig.offer.benefits.content}
            style={resultPageConfig.offer.benefits.style}
            visible={resultPageConfig.offer.benefits.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.benefits')}
            onToggleVisibility={() => toggleSection('offer.benefits')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.benefits');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Pricing Section */}
          <EditableSection
            title="Preço e Botão de Compra"
            sectionPath="offer.pricing"
            content={resultPageConfig.offer.pricing.content}
            style={resultPageConfig.offer.pricing.style}
            visible={resultPageConfig.offer.pricing.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.pricing')}
            onToggleVisibility={() => toggleSection('offer.pricing')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.pricing');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Testimonials Section */}
          <EditableSection
            title="Depoimentos"
            sectionPath="offer.testimonials"
            content={resultPageConfig.offer.testimonials.content}
            style={resultPageConfig.offer.testimonials.style}
            visible={resultPageConfig.offer.testimonials.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.testimonials')}
            onToggleVisibility={() => toggleSection('offer.testimonials')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.testimonials');
            }}
            primaryStyle={primaryStyle}
          />
          
          {/* Guarantee Section */}
          <EditableSection
            title="Garantia"
            sectionPath="offer.guarantee"
            content={resultPageConfig.offer.guarantee.content}
            style={resultPageConfig.offer.guarantee.style}
            visible={resultPageConfig.offer.guarantee.visible}
            isPreview={previewMode}
            onEdit={() => setEditingSection('offer.guarantee')}
            onToggleVisibility={() => toggleSection('offer.guarantee')}
            onStyleEdit={() => {
              setEditingStyles(true);
              setEditingSection('offer.guarantee');
            }}
            primaryStyle={primaryStyle}
          />
        </div>
      </div>
      
      {/* Content Editor Sheet */}
      <Sheet open={!!editingSection && !editingStyles} onOpenChange={() => setEditingSection(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              Editar {getEditorTitle(editingSection || '')}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {editingSection && renderContentEditor(
              editingSection, 
              resultPageConfig, 
              updateSection
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Style Editor Sheet */}
      <Sheet open={!!editingSection && editingStyles} onOpenChange={() => {
        setEditingSection(null);
        setEditingStyles(false);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              Editar Estilos: {getEditorTitle(editingSection || '')}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {editingSection && (
              <StyleEditor 
                style={getSectionStyle(editingSection, resultPageConfig)}
                onUpdate={(style) => {
                  updateSection(`${editingSection}.style`, style);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Global Styles Sheet */}
      <Sheet open={globalStylesOpen} onOpenChange={setGlobalStylesOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Estilos Globais</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <GlobalStyleEditor 
              globalStyles={resultPageConfig.globalStyles || {}}
              onUpdate={(styles) => {
                updateSection('globalStyles', styles);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

function getEditorTitle(sectionPath: string): string {
  const map = {
    'header': 'Cabeçalho',
    'mainContent': 'Estilo Principal',
    'secondaryStyles': 'Estilos Secundários',
    'offer.hero': 'Oferta Principal',
    'offer.products': 'Produtos e Bônus',
    'offer.benefits': 'Benefícios',
    'offer.pricing': 'Preço e Botão de Compra',
    'offer.testimonials': 'Depoimentos',
    'offer.guarantee': 'Garantia'
  };
  
  return map[sectionPath] || sectionPath;
}

function getSectionStyle(sectionPath: string, config: any): any {
  const pathParts = sectionPath.split('.');
  let current = { ...config };
  
  pathParts.forEach(part => {
    if (current[part]) {
      current = current[part];
    }
  });
  
  return current.style || {};
}

function renderContentEditor(sectionPath: string, config: any, updateSection: (path: string, content: any) => void) {
  const pathParts = sectionPath.split('.');
  let current = { ...config };
  let currentPath = '';
  
  pathParts.forEach(part => {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    if (current[part]) {
      current = current[part];
    }
  });
  
  switch(sectionPath) {
    case 'header':
      return (
        <HeaderEditor 
          content={current.content}
          onUpdate={(content) => updateSection(`${sectionPath}.content`, content)}
        />
      );
    case 'mainContent':
      return (
        <MainContentEditor 
          content={current.content}
          onUpdate={(content) => updateSection(`${sectionPath}.content`, content)}
        />
      );
    case 'offer.hero':
      return (
        <OfferHeroEditor 
          content={current.content}
          onUpdate={(content) => updateSection(`${sectionPath}.content`, content)}
        />
      );
    case 'offer.pricing':
      return (
        <PricingEditor 
          content={current.content}
          onUpdate={(content) => updateSection(`${sectionPath}.content`, content)}
        />
      );
    default:
      return (
        <div className="space-y-4">
          {Object.entries(current.content).map(([key, value]) => {
            if (typeof value === 'string') {
              return (
                <div key={key} className="space-y-2">
                  <label htmlFor={key} className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {value.length > 100 ? (
                    <textarea
                      id={key}
                      value={value as string}
                      onChange={(e) => updateSection(`${sectionPath}.content.${key}`, e.target.value)}
                      className="w-full min-h-[100px] p-2 border rounded-md"
                    />
                  ) : (
                    <input
                      id={key}
                      type="text"
                      value={value as string}
                      onChange={(e) => updateSection(`${sectionPath}.content.${key}`, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
  }
}

export default ResultPageEditor;
