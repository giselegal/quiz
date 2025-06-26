import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, Trash2, Copy, Monitor, Smartphone, Tablet, 
  ChevronUp, ChevronDown, Type, Image as ImageIcon, 
  MousePointer, Layout, GripVertical, Eye, Plus,
  ArrowLeft, ArrowRight, Play, Download, Video,
  Star, DollarSign, Clock, Shield, Gift, HelpCircle,
  Users, Settings, Globe, BarChart3, Target, Link,
  Zap, Palette, Code, Database, Layers, Maximize,
  RefreshCw, CheckCircle, AlertCircle
} from "lucide-react";
import { 
  QUIZ_TEMPLATES as REAL_QUIZ_TEMPLATES,
  generateRealQuestionTemplates,
  generateStrategicQuestionTemplates 
} from "@/data/realQuizTemplates";
import "@/styles/enhanced-editor.css";

// Interfaces aprimoradas
interface QuizConfig {
  domain: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  pixel: {
    facebookPixelId: string;
    googleAnalyticsId: string;
  };
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
  };
  scoring: {
    normalQuestionPoints: number;
    strategicQuestionPoints: number;
    autoAdvanceNormal: boolean;
    autoAdvanceStrategic: boolean;
    normalSelectionLimit: number;
    strategicSelectionLimit: number;
  };
  results: {
    showUserName: boolean;
    showPrimaryStyle: boolean;
    showSecondaryStyles: boolean;
    showPercentages: boolean;
    showStyleImages: boolean;
    showStyleGuides: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    fontSize: number;
  };
}

type ComponentType = 
  | "logo" | "progress" | "title" | "subtitle" | "text" | "image" 
  | "input" | "options" | "button" | "spacer" | "video" | "testimonial"
  | "price" | "countdown" | "guarantee" | "bonus" | "faq" | "social-proof";

interface SimpleComponent {
  id: string;
  type: ComponentType;
  data: Record<string, any>;
  style?: Record<string, any>;
}

interface SimplePage {
  id: string;
  title: string;
  type: "intro" | "question" | "loading" | "result" | "offer" | "transition" | "sales" | "checkout" | "upsell" | "thankyou" | "webinar" | "launch";
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: SimpleComponent[];
}

interface QuizFunnel {
  id: string;
  name: string;
  pages: SimplePage[];
}

// Componente principal melhorado
const EnhancedAdvancedEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [activeConfigSection, setActiveConfigSection] = useState<string>("general");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showPreview, setShowPreview] = useState(false);

  // Estado das configurações
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    domain: "https://giselegalvao.com.br",
    seo: {
      title: "Quiz: Descubra Seu Estilo Pessoal Único",
      description: "Descubra seu estilo pessoal único com nosso quiz personalizado. Transforme seu visual e ganhe confiança com dicas exclusivas de moda.",
      keywords: "quiz estilo, moda feminina, consultoria de imagem, estilo pessoal, transformação visual",
    },
    pixel: {
      facebookPixelId: "1311550759901086",
      googleAnalyticsId: "G-XXXXXXXXXX",
    },
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "quiz_style_2025",
      content: "criativo-1",
      term: "estilo_elegante",
    },
    scoring: {
      normalQuestionPoints: 1,
      strategicQuestionPoints: 0,
      autoAdvanceNormal: true,
      autoAdvanceStrategic: false,
      normalSelectionLimit: 3,
      strategicSelectionLimit: 2,
    },
    results: {
      showUserName: true,
      showPrimaryStyle: true,
      showSecondaryStyles: true,
      showPercentages: true,
      showStyleImages: true,
      showStyleGuides: true,
    },
    theme: {
      primaryColor: "#8B4513",
      secondaryColor: "#2C2C2C",
      backgroundColor: "#FAF9F7",
      textColor: "#432818",
      borderRadius: 16,
      fontSize: 16,
    },
  });

  // Estado do funil
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>(() => {
    try {
      const saved = localStorage.getItem("enhanced_quiz_funnel");
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn("Erro ao carregar funil salvo:", error);
    }

    const realQuestions = generateRealQuestionTemplates();
    const strategicQuestions = generateStrategicQuestionTemplates();

    return {
      id: "enhanced-quiz-funnel",
      name: "Quiz de Estilo Pessoal - Enhanced",
      pages: [
        REAL_QUIZ_TEMPLATES.intro,
        ...realQuestions,
        REAL_QUIZ_TEMPLATES.transition,
        ...strategicQuestions,
        REAL_QUIZ_TEMPLATES.loading,
        REAL_QUIZ_TEMPLATES.result,
        REAL_QUIZ_TEMPLATES.offer,
      ],
    };
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = currentFunnel.pages[currentPageIndex];

  // Auto-save otimizado
  const saveChanges = useCallback(async () => {
    setSaveStatus("saving");
    try {
      localStorage.setItem("enhanced_quiz_funnel", JSON.stringify(currentFunnel));
      localStorage.setItem("enhanced_quiz_config", JSON.stringify(quizConfig));
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveStatus("saved");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveStatus("unsaved");
    }
  }, [currentFunnel, quizConfig]);

  // Funções de navegação entre páginas
  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setSelectedComponent(null);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < currentFunnel.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setSelectedComponent(null);
    }
  };

  const addNewPage = () => {
    const newPage: SimplePage = {
      id: `page-${Date.now()}`,
      title: "Nova Página",
      type: "question",
      progress: 50,
      showHeader: true,
      showProgress: true,
      components: [],
    };

    setCurrentFunnel((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setCurrentPageIndex(currentFunnel.pages.length);
    setSaveStatus("unsaved");
  };

  const duplicatePage = (index?: number) => {
    const pageIndex = index ?? currentPageIndex;
    const pageToClone = currentFunnel.pages[pageIndex];
    
    const newPage: SimplePage = {
      ...pageToClone,
      id: `page-${Date.now()}`,
      title: `${pageToClone.title} (Cópia)`,
      components: pageToClone.components.map((comp) => ({
        ...comp,
        id: `${comp.type}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      })),
    };

    setCurrentFunnel((prev) => ({
      ...prev,
      pages: [
        ...prev.pages.slice(0, pageIndex + 1),
        newPage,
        ...prev.pages.slice(pageIndex + 1),
      ],
    }));
    setCurrentPageIndex(pageIndex + 1);
    addToHistory(newFunnel);
    setSaveStatus("unsaved");
  };

  const deletePage = (index?: number) => {
    const pageIndex = index ?? currentPageIndex;
    
    if (currentFunnel.pages.length > 1) {
      const newFunnel = {
        ...currentFunnel,
        pages: currentFunnel.pages.filter((_, i) => i !== pageIndex),
      };
      
      setCurrentFunnel(newFunnel);
      addToHistory(newFunnel);

      if (currentPageIndex >= newFunnel.pages.length) {
        setCurrentPageIndex(Math.max(0, newFunnel.pages.length - 1));
      }
      setSelectedComponent(null);
      setSaveStatus("unsaved");
    }
  };

  const getPageTypeLabel = (type: SimplePage["type"]): string => {
    const labels = {
      intro: "Introdução",
      question: "Questão",
      transition: "Transição", 
      loading: "Carregando",
      result: "Resultado",
      offer: "Oferta",
      sales: "Vendas",
      checkout: "Checkout",
      upsell: "Upsell",
      thankyou: "Obrigado",
      webinar: "Webinar",
      launch: "Lançamento"
    };
    return labels[type] || type;
  };

  // Funções de drag & drop para etapas
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  
  // Histórico para undo/redo
  const [history, setHistory] = useState<QuizFunnel[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (funnel: QuizFunnel) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(funnel)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFunnel(history[historyIndex - 1]);
      setSaveStatus("unsaved");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFunnel(history[historyIndex + 1]);
      setSaveStatus("unsaved");
    }
  };

  // Adicionar ao histórico quando o funil muda
  useEffect(() => {
    if (currentFunnel && history.length === 0) {
      addToHistory(currentFunnel);
    }
  }, [currentFunnel]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveChanges();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [historyIndex, history.length]);

  const handlePageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPageIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handlePageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handlePageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedPageIndex === null || draggedPageIndex === dropIndex) {
      setDraggedPageIndex(null);
      return;
    }

    const newPages = [...currentFunnel.pages];
    const [draggedPage] = newPages.splice(draggedPageIndex, 1);
    newPages.splice(dropIndex, 0, draggedPage);

    setCurrentFunnel(prev => ({
      ...prev,
      pages: newPages
    }));

    // Atualizar índice da página atual se necessário
    if (currentPageIndex === draggedPageIndex) {
      setCurrentPageIndex(dropIndex);
    } else if (currentPageIndex > draggedPageIndex && currentPageIndex <= dropIndex) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentPageIndex < draggedPageIndex && currentPageIndex >= dropIndex) {
      setCurrentPageIndex(currentPageIndex + 1);
    }

    setDraggedPageIndex(null);
    setSaveStatus("unsaved");
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (saveStatus !== "saving") {
        saveChanges();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentFunnel, quizConfig, saveChanges, saveStatus]);

  // Componentes da paleta aprimorados
  const componentPalette = [
    { type: "logo", label: "Logo", icon: "🏷️", category: "brand" },
    { type: "progress", label: "Progresso", icon: "📊", category: "ui" },
    { type: "title", label: "Título", icon: "📝", category: "text" },
    { type: "subtitle", label: "Subtítulo", icon: "📄", category: "text" },
    { type: "text", label: "Texto", icon: "📰", category: "text" },
    { type: "image", label: "Imagem", icon: "🖼️", category: "media" },
    { type: "video", label: "Vídeo", icon: "📹", category: "media" },
    { type: "input", label: "Campo", icon: "📝", category: "form" },
    { type: "options", label: "Opções", icon: "☑️", category: "form" },
    { type: "button", label: "Botão", icon: "🔘", category: "form" },
    { type: "spacer", label: "Espaçador", icon: "📏", category: "layout" },
    { type: "testimonial", label: "Depoimento", icon: "💬", category: "social" },
    { type: "price", label: "Preço", icon: "💰", category: "ecommerce" },
    { type: "countdown", label: "Timer", icon: "⏰", category: "urgency" },
    { type: "guarantee", label: "Garantia", icon: "🛡️", category: "trust" },
    { type: "bonus", label: "Bônus", icon: "🎁", category: "offer" },
    { type: "faq", label: "FAQ", icon: "❓", category: "info" },
    { type: "social-proof", label: "Prova Social", icon: "👥", category: "social" },
  ];

  const categories = {
    brand: "Marca",
    ui: "Interface",
    text: "Texto",
    media: "Mídia",
    form: "Formulário",
    layout: "Layout",
    social: "Social",
    ecommerce: "E-commerce",
    urgency: "Urgência",
    trust: "Confiança",
    offer: "Oferta",
    info: "Informação"
  };

  // Funções de edição aprimoradas
  const addComponent = (type: ComponentType, index?: number) => {
    const newComponent: SimpleComponent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultData(type),
      style: getDefaultStyle(type),
    };

    const newFunnel = {
      ...currentFunnel,
      pages: currentFunnel.pages.map((page, pageIndex) =>
        pageIndex === currentPageIndex
          ? {
              ...page,
              components: index !== undefined
                ? [
                    ...page.components.slice(0, index),
                    newComponent,
                    ...page.components.slice(index),
                  ]
                : [...page.components, newComponent],
            }
          : page
      ),
    };

    setCurrentFunnel(newFunnel);
    addToHistory(newFunnel);
    setSelectedComponent(newComponent.id);
    setSaveStatus("unsaved");
  };

  const updateComponent = (componentId: string, updates: Partial<SimpleComponent>) => {
    const newFunnel = {
      ...currentFunnel,
      pages: currentFunnel.pages.map((page, index) =>
        index === currentPageIndex
          ? {
              ...page,
              components: page.components.map(comp =>
                comp.id === componentId ? { ...comp, ...updates } : comp
              ),
            }
          : page
      ),
    };
    
    setCurrentFunnel(newFunnel);
    // Não adicionar ao histórico para cada pequena mudança, apenas quando o usuário para de editar
    setSaveStatus("unsaved");
  };

  const deleteComponent = (componentId: string) => {
    setCurrentFunnel(prev => ({
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === currentPageIndex
          ? {
              ...page,
              components: page.components.filter(comp => comp.id !== componentId),
            }
          : page
      ),
    }));
    
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
    setSaveStatus("unsaved");
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentPage.components.find(comp => comp.id === componentId);
    if (component) {
      const duplicated: SimpleComponent = {
        ...component,
        id: `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const index = currentPage.components.findIndex(comp => comp.id === componentId);
      addComponent(duplicated.type, index + 1);
    }
  };

  // Dados padrão para componentes
  function getDefaultData(type: ComponentType): Record<string, any> {
    switch (type) {
      case "logo":
        return {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          alt: "Logo",
        };
      case "progress":
        return { progressValue: 50 };
      case "title":
        return { text: "Novo Título" };
      case "subtitle":
        return { text: "Novo Subtítulo" };
      case "text":
        return { text: "Digite seu texto aqui..." };
      case "image":
        return {
          src: "https://via.placeholder.com/400x300/B89B7A/FFFFFF?text=Nova+Imagem",
          alt: "Nova imagem",
        };
      case "input":
        return {
          label: "CAMPO",
          placeholder: "Digite aqui...",
          required: false,
        };
      case "options":
        return {
          hasImages: false,
          multiSelect: false,
          options: [
            { id: "opt-1", text: "Opção 1", value: "option1" },
            { id: "opt-2", text: "Opção 2", value: "option2" },
          ],
        };
      case "button":
        return { text: "CLIQUE AQUI" };
      case "spacer":
        return { height: 32 };
      case "video":
        return { videoUrl: "" };
      case "testimonial":
        return {
          text: "Este produto mudou minha vida completamente! Recomendo para todos que querem resultados reais.",
          name: "Cliente Satisfeito",
          role: "Cliente verificado",
          avatar: "https://via.placeholder.com/60x60/B89B7A/FFFFFF?text=👤",
        };
      case "price":
        return {
          price: "97",
          originalPrice: "197",
          installments: "9,90",
        };
      case "countdown":
        return {
          title: "⏰ OFERTA LIMITADA!",
        };
      case "guarantee":
        return {
          title: "Garantia de 30 Dias",
          text: "Se não ficar satisfeito, devolvemos 100% do seu dinheiro!",
        };
      case "bonus":
        return {
          bonuses: [
            {
              id: "bonus1",
              title: "Bônus #1: Guia Completo",
              value: "R$ 197",
              description: "Material exclusivo para acelerar seus resultados",
            },
          ],
        };
      case "faq":
        return {
          faqs: [
            {
              id: "faq1",
              question: "Como funciona a garantia?",
              answer: "Oferecemos 30 dias de garantia incondicional. Se não ficar satisfeito, devolvemos seu dinheiro.",
            },
          ],
        };
      case "social-proof":
        return {
          customerCount: "5.000",
          rating: "4.9",
          reviewCount: "1.247",
        };
      default:
        return {};
    }
  }

  function getDefaultStyle(type: ComponentType): Record<string, any> {
    const theme = quizConfig.theme;
    
    switch (type) {
      case "title":
        return {
          fontSize: "2.5rem",
          fontWeight: "700",
          textAlign: "center",
          color: theme.primaryColor,
        };
      case "subtitle":
        return {
          fontSize: "1.25rem",
          textAlign: "center",
          color: theme.secondaryColor,
        };
      case "text":
        return {
          fontSize: "1rem",
          textAlign: "left",
          color: theme.textColor,
        };
      default:
        return {};
    }
  }

  // Render do editor aprimorado
  return (
    <div className="enhanced-editor">
      {/* Header com toolbar aprimorado */}
      <div className="editor-header">
        <div className="header-left">
          <h1 className="editor-title">Enhanced Quiz Editor</h1>
          <div className="save-indicator">
            {saveStatus === "saved" && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Salvo
              </Badge>
            )}
            {saveStatus === "saving" && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Salvando...
              </Badge>
            )}
            {saveStatus === "unsaved" && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Não salvo
              </Badge>
            )}
          </div>
        </div>

        <div className="header-center">
          <div className="device-selector">
            <Button
              variant={deviceView === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="header-right">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Desfazer (Ctrl+Z)"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Refazer (Ctrl+Y)"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Editar" : "Preview"}
          </Button>
          <Button size="sm" onClick={saveChanges} disabled={saveStatus === "saving"}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Layout principal com abas */}
      <div className="editor-content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">
              <Layout className="w-4 h-4 mr-2" />
              Editor Visual
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Aba do Editor Visual */}
          <TabsContent value="editor" className="h-full mt-0">
            <div className="editor-layout-4cols">
              {/* Sidebar 1 - Etapas do Quiz */}
              <div className="editor-sidebar steps">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Etapas do Quiz</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {currentFunnel.pages.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                        {currentFunnel.pages.map((page, index) => (
                          <div
                            key={page.id}
                            className={`step-item ${index === currentPageIndex ? "active" : ""} ${
                              draggedPageIndex === index ? "dragging" : ""
                            }`}
                            onClick={() => setCurrentPageIndex(index)}
                            draggable
                            onDragStart={(e) => handlePageDragStart(e, index)}
                            onDragOver={(e) => handlePageDragOver(e, index)}
                            onDrop={(e) => handlePageDrop(e, index)}
                          >
                            <div className="step-header">
                              <div className="drag-handle">
                                <GripVertical className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="step-number">{index + 1}</div>
                              <div className="step-info">
                                <div className="step-title">{page.title}</div>
                                <div className="step-type">{getPageTypeLabel(page.type)}</div>
                              </div>
                              <div className="step-actions">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicatePage(index);
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(index);
                                  }}
                                  disabled={currentFunnel.pages.length <= 1}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="step-progress">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${page.progress}%` }}
                                />
                              </div>
                              <span className="progress-text">{page.progress}%</span>
                            </div>
                            <div className="step-components">
                              {page.components.length} componente{page.components.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          onClick={addNewPage}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Etapa
                        </Button>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar 2 - Componentes */}
              <div className="editor-sidebar components">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Componentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-full">
                      {Object.entries(categories).map(([categoryKey, categoryName]) => (
                        <div key={categoryKey} className="mb-4">
                          <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                            {categoryName}
                          </h4>
                          <div className="grid grid-cols-1 gap-1">
                            {componentPalette
                              .filter(comp => comp.category === categoryKey)
                              .map(component => (
                                <Button
                                  key={component.type}
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start h-8 px-2 cursor-grab"
                                  onClick={() => addComponent(component.type)}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData("component-type", component.type);
                                    e.dataTransfer.effectAllowed = "copy";
                                  }}
                                  draggable
                                >
                                  <span className="mr-2 text-sm">{component.icon}</span>
                                  <span className="text-xs">{component.label}</span>
                                </Button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Canvas central */}
              <div className="editor-canvas">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {currentPage.title} ({currentPageIndex + 1}/{currentFunnel.pages.length})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                          disabled={currentPageIndex === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPageIndex(Math.min(currentFunnel.pages.length - 1, currentPageIndex + 1))}
                          disabled={currentPageIndex === currentFunnel.pages.length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`canvas-preview ${deviceView}`}>
                      <ScrollArea className="h-full">
                        {showPreview ? (
                          <div className="preview-mode">
                            <div className="quiz-preview">
                              <h2>Preview do Quiz</h2>
                              <p>Visualização em tempo real seria renderizada aqui</p>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="edit-mode"
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "copy";
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const componentType = e.dataTransfer.getData("component-type");
                              if (componentType) {
                                addComponent(componentType as ComponentType);
                              }
                            }}
                          >
                            {currentPage.components.length === 0 ? (
                              <div className="empty-canvas">
                                <div className="text-center text-gray-500 py-12">
                                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                  <p className="text-sm">Arraste componentes da barra lateral</p>
                                  <p className="text-xs text-gray-400 mt-1">ou clique nos componentes para adicionar</p>
                                </div>
                              </div>
                            ) : (
                              <div className="components-list">
                                {currentPage.components.map((component, index) => (
                                  <div
                                    key={component.id}
                                    className={`component-item ${selectedComponent === component.id ? "selected" : ""}`}
                                    onClick={() => setSelectedComponent(component.id)}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const componentType = e.dataTransfer.getData("component-type");
                                      if (componentType) {
                                        addComponent(componentType as ComponentType, index);
                                      }
                                    }}
                                  >
                                    <div className="component-header">
                                      <div className="drag-handle">
                                        <GripVertical className="w-3 h-3 text-gray-400" />
                                      </div>
                                      <div className="component-info">
                                        <span className="component-type">
                                          {componentPalette.find(p => p.type === component.type)?.icon}
                                        </span>
                                        <span className="component-label">
                                          {componentPalette.find(p => p.type === component.type)?.label}
                                        </span>
                                      </div>
                                      <div className="component-actions">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateComponent(component.id);
                                          }}
                                        >
                                          <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteComponent(component.id);
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="component-preview">
                                      {renderComponentPreview(component)}
                                    </div>

                                    <div
                                      className="component-drop-zone"
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const componentType = e.dataTransfer.getData("component-type");
                                        if (componentType) {
                                          addComponent(componentType as ComponentType, index + 1);
                                        }
                                      }}
                                    >
                                      <div className="drop-indicator">
                                        <Plus className="w-4 h-4" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar 4 - Propriedades */}
              <div className="editor-sidebar right">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Propriedades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-full">
                      {selectedComponent ? (
                        <div className="properties-panel">
                          {renderComponentProperties()}
                        </div>
                      ) : (
                        <div className="no-selection">
                          <div className="text-center text-gray-500 py-8">
                            <Settings className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Selecione um componente</p>
                            <p className="text-xs text-gray-400 mt-1">para editar suas propriedades</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

              {/* Canvas central */}
              <div className="editor-canvas">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {currentPage.title} ({currentPageIndex + 1}/{currentFunnel.pages.length})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                          disabled={currentPageIndex === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPageIndex(Math.min(currentFunnel.pages.length - 1, currentPageIndex + 1))}
                          disabled={currentPageIndex === currentFunnel.pages.length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`canvas-preview ${deviceView}`}>
                      <ScrollArea className="h-full">
                        {showPreview ? (
                          <div className="preview-mode">
                            {/* Aqui será renderizado o preview real do quiz */}
                            <div className="quiz-preview">
                              <h2>Preview do Quiz</h2>
                              <p>Visualização em tempo real seria renderizada aqui</p>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="edit-mode"
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "copy";
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const componentType = e.dataTransfer.getData("component-type");
                              if (componentType) {
                                addComponent(componentType as ComponentType);
                              }
                            }}
                          >
                            {currentPage.components.length === 0 ? (
                              <div className="empty-canvas">
                                <div className="text-center text-gray-500 py-12">
                                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                  <p className="text-sm">Arraste componentes da barra lateral</p>
                                  <p className="text-xs text-gray-400 mt-1">ou clique nos componentes para adicionar</p>
                                </div>
                              </div>
                            ) : (
                              <div className="components-list">
                                {currentPage.components.map((component, index) => (
                                  <div
                                    key={component.id}
                                    className={`component-item ${selectedComponent === component.id ? "selected" : ""}`}
                                    onClick={() => setSelectedComponent(component.id)}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const componentType = e.dataTransfer.getData("component-type");
                                      if (componentType) {
                                        addComponent(componentType as ComponentType, index);
                                      }
                                    }}
                                  >
                                    <div className="component-header">
                                      <div className="drag-handle">
                                        <GripVertical className="w-3 h-3 text-gray-400" />
                                      </div>
                                      <div className="component-info">
                                        <span className="component-type">
                                          {componentPalette.find(p => p.type === component.type)?.icon}
                                        </span>
                                        <span className="component-label">
                                          {componentPalette.find(p => p.type === component.type)?.label}
                                        </span>
                                      </div>
                                      <div className="component-actions">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateComponent(component.id);
                                          }}
                                        >
                                          <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteComponent(component.id);
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {/* Preview do componente */}
                                    <div className="component-preview">
                                      {renderComponentPreview(component)}
                                    </div>

                                    {/* Drop zone entre componentes */}
                                    <div
                                      className="component-drop-zone"
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const componentType = e.dataTransfer.getData("component-type");
                                        if (componentType) {
                                          addComponent(componentType as ComponentType, index + 1);
                                        }
                                      }}
                                    >
                                      <div className="drop-indicator">
                                        <Plus className="w-4 h-4" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar 4 - Propriedades */}
              <div className="editor-sidebar right">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Propriedades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-full">
                      {selectedComponent ? (
                        <div className="properties-panel">
                          {renderComponentProperties()}
                        </div>
                      ) : (
                        <div className="no-selection">
                          <div className="text-center text-gray-500 py-8">
                            <Settings className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Selecione um componente</p>
                            <p className="text-xs text-gray-400 mt-1">para editar suas propriedades</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="config" className="h-full mt-0">
            <div className="config-layout">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Configurações do Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeConfigSection} onValueChange={setActiveConfigSection}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="general">
                        <Globe className="w-4 h-4 mr-1" />
                        Geral
                      </TabsTrigger>
                      <TabsTrigger value="seo">
                        <Target className="w-4 h-4 mr-1" />
                        SEO
                      </TabsTrigger>
                      <TabsTrigger value="tracking">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Tracking
                      </TabsTrigger>
                      <TabsTrigger value="scoring">
                        <Zap className="w-4 h-4 mr-1" />
                        Pontuação
                      </TabsTrigger>
                      <TabsTrigger value="theme">
                        <Palette className="w-4 h-4 mr-1" />
                        Tema
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="domain">Domínio</Label>
                          <Input
                            id="domain"
                            value={quizConfig.domain}
                            onChange={(e) => setQuizConfig(prev => ({ ...prev, domain: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="seo" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="seo-title">Título SEO</Label>
                          <Input
                            id="seo-title"
                            value={quizConfig.seo.title}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              seo: { ...prev.seo, title: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="seo-description">Descrição SEO</Label>
                          <Textarea
                            id="seo-description"
                            value={quizConfig.seo.description}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              seo: { ...prev.seo, description: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="seo-keywords">Palavras-chave</Label>
                          <Input
                            id="seo-keywords"
                            value={quizConfig.seo.keywords}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              seo: { ...prev.seo, keywords: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tracking" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                          <Input
                            id="facebook-pixel"
                            value={quizConfig.pixel.facebookPixelId}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              pixel: { ...prev.pixel, facebookPixelId: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="google-analytics">Google Analytics ID</Label>
                          <Input
                            id="google-analytics"
                            value={quizConfig.pixel.googleAnalyticsId}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              pixel: { ...prev.pixel, googleAnalyticsId: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="scoring" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="auto-advance"
                            checked={quizConfig.scoring.autoAdvanceNormal}
                            onCheckedChange={(checked) => setQuizConfig(prev => ({
                              ...prev,
                              scoring: { ...prev.scoring, autoAdvanceNormal: checked }
                            }))}
                          />
                          <Label htmlFor="auto-advance">Avanço automático (questões normais)</Label>
                        </div>
                        <div>
                          <Label htmlFor="selection-limit">Limite de seleções (questões normais)</Label>
                          <Input
                            id="selection-limit"
                            type="number"
                            value={quizConfig.scoring.normalSelectionLimit}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              scoring: { ...prev.scoring, normalSelectionLimit: parseInt(e.target.value) || 3 }
                            }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="theme" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="primary-color">Cor Primária</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="primary-color"
                                type="color"
                                value={quizConfig.theme.primaryColor}
                                onChange={(e) => setQuizConfig(prev => ({
                                  ...prev,
                                  theme: { ...prev.theme, primaryColor: e.target.value }
                                }))}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={quizConfig.theme.primaryColor}
                                onChange={(e) => setQuizConfig(prev => ({
                                  ...prev,
                                  theme: { ...prev.theme, primaryColor: e.target.value }
                                }))}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="secondary-color">Cor Secundária</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="secondary-color"
                                type="color"
                                value={quizConfig.theme.secondaryColor}
                                onChange={(e) => setQuizConfig(prev => ({
                                  ...prev,
                                  theme: { ...prev.theme, secondaryColor: e.target.value }
                                }))}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={quizConfig.theme.secondaryColor}
                                onChange={(e) => setQuizConfig(prev => ({
                                  ...prev,
                                  theme: { ...prev.theme, secondaryColor: e.target.value }
                                }))}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="border-radius">Border Radius</Label>
                          <Input
                            id="border-radius"
                            type="number"
                            value={quizConfig.theme.borderRadius}
                            onChange={(e) => setQuizConfig(prev => ({
                              ...prev,
                              theme: { ...prev.theme, borderRadius: parseInt(e.target.value) || 16 }
                            }))}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Analytics */}
          <TabsContent value="analytics" className="h-full mt-0">
            <div className="analytics-layout">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Analytics & Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Analytics em desenvolvimento</p>
                    <p className="text-sm text-gray-400 mt-1">Estatísticas do quiz serão exibidas aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Funções auxiliares de renderização
  function renderComponentPreview(component: SimpleComponent): React.ReactNode {
    switch (component.type) {
      case "logo":
        return (
          <div className="logo-preview">
            <img 
              src={component.data.src} 
              alt={component.data.alt}
              className="max-h-12 mx-auto"
            />
          </div>
        );
      case "title":
        return (
          <h2 style={component.style} className="text-lg font-bold">
            {component.data.text}
          </h2>
        );
      case "subtitle":
        return (
          <h3 style={component.style} className="text-base">
            {component.data.text}
          </h3>
        );
      case "text":
        return (
          <p style={component.style} className="text-sm">
            {component.data.text}
          </p>
        );
      case "image":
        return (
          <img 
            src={component.data.src} 
            alt={component.data.alt}
            className="max-w-full h-auto rounded"
          />
        );
      case "button":
        return (
          <Button className="w-full" style={component.style}>
            {component.data.text}
          </Button>
        );
      case "input":
        return (
          <div>
            <Label>{component.data.label}</Label>
            <Input placeholder={component.data.placeholder} />
          </div>
        );
      case "options":
        return (
          <div className="space-y-2">
            <h4 className="font-medium">Opções de escolha:</h4>
            {component.data.options?.map((option: any, index: number) => (
              <div key={index} className="p-2 border rounded text-sm">
                {option.text}
              </div>
            ))}
          </div>
        );
      case "spacer":
        return (
          <div 
            style={{ height: component.data.height || 32 }}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
          >
            <span className="text-xs text-gray-400">Espaçador ({component.data.height || 32}px)</span>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded text-center">
            <span className="text-sm text-gray-500">
              Componente: {componentPalette.find(p => p.type === component.type)?.label}
            </span>
          </div>
        );
    }
  }

  function renderComponentProperties(): React.ReactNode {
    if (!selectedComponent) return null;

    const component = currentPage.components.find(comp => comp.id === selectedComponent);
    if (!component) return null;

    const updateComponentData = (key: string, value: any) => {
      updateComponent(selectedComponent, {
        data: { ...component.data, [key]: value }
      });
    };

    const updateComponentStyle = (key: string, value: any) => {
      updateComponent(selectedComponent, {
        style: { ...component.style, [key]: value }
      });
    };

    return (
      <div className="space-y-4">
        <div className="component-type-badge">
          <Badge variant="outline">
            {componentPalette.find(p => p.type === component.type)?.icon}
            {componentPalette.find(p => p.type === component.type)?.label}
          </Badge>
        </div>

        {/* Propriedades específicas por tipo */}
        {component.type === "title" && (
          <>
            <div>
              <Label htmlFor="title-text">Texto</Label>
              <Input
                id="title-text"
                value={component.data.text || ""}
                onChange={(e) => updateComponentData("text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title-size">Tamanho da Fonte</Label>
              <Input
                id="title-size"
                value={component.style?.fontSize || "2.5rem"}
                onChange={(e) => updateComponentStyle("fontSize", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title-color">Cor</Label>
              <Input
                id="title-color"
                type="color"
                value={component.style?.color || "#000000"}
                onChange={(e) => updateComponentStyle("color", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title-align">Alinhamento</Label>
              <Select
                value={component.style?.textAlign || "center"}
                onValueChange={(value) => updateComponentStyle("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {component.type === "text" && (
          <>
            <div>
              <Label htmlFor="text-content">Conteúdo</Label>
              <Textarea
                id="text-content"
                value={component.data.text || ""}
                onChange={(e) => updateComponentData("text", e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="text-size">Tamanho da Fonte</Label>
              <Input
                id="text-size"
                value={component.style?.fontSize || "1rem"}
                onChange={(e) => updateComponentStyle("fontSize", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="text-color">Cor</Label>
              <Input
                id="text-color"
                type="color"
                value={component.style?.color || "#000000"}
                onChange={(e) => updateComponentStyle("color", e.target.value)}
              />
            </div>
          </>
        )}

        {component.type === "image" && (
          <>
            <div>
              <Label htmlFor="image-src">URL da Imagem</Label>
              <Input
                id="image-src"
                value={component.data.src || ""}
                onChange={(e) => updateComponentData("src", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Texto Alternativo</Label>
              <Input
                id="image-alt"
                value={component.data.alt || ""}
                onChange={(e) => updateComponentData("alt", e.target.value)}
              />
            </div>
          </>
        )}

        {component.type === "button" && (
          <>
            <div>
              <Label htmlFor="button-text">Texto do Botão</Label>
              <Input
                id="button-text"
                value={component.data.text || ""}
                onChange={(e) => updateComponentData("text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="button-color">Cor de Fundo</Label>
              <Input
                id="button-color"
                type="color"
                value={component.style?.backgroundColor || quizConfig.theme.primaryColor}
                onChange={(e) => updateComponentStyle("backgroundColor", e.target.value)}
              />
            </div>
          </>
        )}

        {component.type === "spacer" && (
          <div>
            <Label htmlFor="spacer-height">Altura (px)</Label>
            <Input
              id="spacer-height"
              type="number"
              value={component.data.height || 32}
              onChange={(e) => updateComponentData("height", parseInt(e.target.value) || 32)}
            />
          </div>
        )}

        {/* Propriedades comuns de estilo */}
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-2">Margem e Padding</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="margin">Margem</Label>
              <Input
                id="margin"
                value={component.style?.margin || "0"}
                onChange={(e) => updateComponentStyle("margin", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                value={component.style?.padding || "0"}
                onChange={(e) => updateComponentStyle("padding", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default EnhancedAdvancedEditor;