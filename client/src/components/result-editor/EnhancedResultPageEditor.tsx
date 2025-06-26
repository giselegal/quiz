import React, { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { QuizFunnel, ResultPage, ResultPageBlock, CTABlock, TestimonialBlock } from '@/types/quizResult';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { styleConfig } from '@/config/styleConfig';
import { toast } from '@/components/ui/use-toast';
import { Save, EyeIcon, Trash2, MoveUp, MoveDown, ImageIcon, Edit, CheckCircle, Settings, Palette, PanelLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Propriedades do componente editor
interface EnhancedResultPageEditorProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  initialFunnel?: QuizFunnel;
  onSave: (funnel: QuizFunnel) => void;
}

// Componente principal do editor
export const EnhancedResultPageEditor: React.FC<EnhancedResultPageEditorProps> = ({
  primaryStyle,
  secondaryStyles,
  initialFunnel,
  onSave
}) => {
  // Estado para armazenar a página de resultados atual
  const [resultPage, setResultPage] = useState<ResultPage>({
    id: `result_page_${Date.now()}`,
    title: 'Resultados do seu estilo',
    blocks: [
      {
        id: `block_title_${Date.now()}`,
        type: 'title',
        content: 'Vista-se de Você — na Prática',
        order: 0,
        isVisible: true
      },
      {
        id: `block_text_${Date.now()}_1`,
        type: 'text',
        content: 'Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir com autenticidade e transformar sua imagem em ferramenta de poder.',
        order: 1,
        isVisible: true
      },
      {
        id: `block_styleResult_${Date.now()}`,
        type: 'styleResult',
        content: 'Seu estilo predominante',
        order: 2,
        isVisible: true,
        settings: {
          styleCategory: primaryStyle.category,
          percentage: primaryStyle.percentage,
          description: styleConfig[primaryStyle.category].description
        }
      },
      {
        id: `block_testimonial_${Date.now()}_1`,
        type: 'testimonial',
        content: 'O guia mudou completamente minha relação com as roupas. Agora sei exatamente o que comprar e como montar looks incríveis!',
        order: 3,
        isVisible: true,
        settings: {
          author: 'Maria Silva',
          authorImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/testimonial1.jpg'
        }
      },
      {
        id: `block_testimonial_${Date.now()}_2`,
        type: 'testimonial',
        content: 'Depois de entender meu estilo predominante, parei de gastar dinheiro com peças que não tinham nada a ver comigo.',
        order: 4,
        isVisible: true,
        settings: {
          author: 'Ana Oliveira',
          authorImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/testimonial2.jpg'
        }
      },
      {
        id: `block_cta_${Date.now()}_1`,
        type: 'cta',
        content: 'Botão de ação principal',
        order: 5,
        isVisible: true,
        settings: {
          buttonText: 'Quero meu Guia de Estilo Agora',
          url: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF'
        }
      },
      {
        id: `block_guarantee_${Date.now()}`,
        type: 'guarantee',
        content: 'Experimente por 7 dias sem risco. Se não ficar satisfeito, devolveremos 100% do seu dinheiro.',
        order: 6,
        isVisible: true
      }
    ],
    settings: {
      backgroundColor: '#fffaf7',
      primaryColor: '#aa6b5d',
      secondaryColor: '#B89B7A',
      fontFamily: 'inherit',
      showSecondaryStyles: true
    }
  });
  
  // Estado para controlar o painel ativo (blocos, configurações ou estilos)
  const [activePanel, setActivePanel] = useState<'blocks' | 'settings' | 'styles'>('blocks');
  
  // Estado para ativar/desativar a pré-visualização
  const [previewMode, setPreviewMode] = useState(false);

  // Efeito para carregar dados iniciais do funil, se disponíveis
  useEffect(() => {
    if (initialFunnel?.resultPage) {
      try {
        setResultPage(initialFunnel.resultPage);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados salvos do editor.",
          variant: "destructive"
        });
      }
    }
  }, [initialFunnel]);

  // Atualizar o título da página
  const updatePageTitle = (title: string) => {
    setResultPage(prev => ({
      ...prev,
      title
    }));
  };

  // Atualizar configurações da página
  const updateSettings = (field: string, value: any) => {
    setResultPage(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  // Adicionar um novo bloco
  const addBlock = (type: ResultPageBlock['type']) => {
    const newBlock: ResultPageBlock = {
      id: `block_${type}_${Date.now()}`,
      type,
      content: `Novo bloco de ${type}`,
      order: resultPage.blocks.length,
      isVisible: true
    };
    
    // Configurações adicionais baseadas no tipo
    if (type === 'cta') {
      (newBlock as CTABlock).settings = {
        buttonText: 'Clique Aqui',
        url: 'https://exemplo.com',
        backgroundColor: '#4CAF50',
        textColor: '#FFFFFF'
      };
    } else if (type === 'testimonial') {
      (newBlock as TestimonialBlock).settings = {
        author: 'Nome do Cliente'
      };
    } else if (type === 'styleResult') {
      newBlock.settings = {
        styleCategory: primaryStyle.category,
        percentage: primaryStyle.percentage
      };
    }
    
    setResultPage(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  // Remover um bloco existente
  const removeBlock = (id: string) => {
    setResultPage(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id)
    }));
  };

  // Atualizar um bloco existente
  const updateBlock = (id: string, field: string, value: any) => {
    setResultPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id 
          ? { ...block, [field]: value } 
          : block
      )
    }));
  };

  // Tornar um bloco visível ou invisível
  const toggleBlockVisibility = (id: string, isVisible: boolean) => {
    setResultPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id 
          ? { ...block, isVisible } 
          : block
      )
    }));
  };

  // Mover um bloco para cima
  const moveBlockUp = (id: string) => {
    setResultPage(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(block => block.id === id);
      
      if (index <= 0) return prev;
      
      // Trocar a ordem dos blocos
      const temp = blocks[index - 1].order;
      blocks[index - 1].order = blocks[index].order;
      blocks[index].order = temp;
      
      // Trocar a posição dos blocos no array
      const tempBlock = blocks[index];
      blocks[index] = blocks[index - 1];
      blocks[index - 1] = tempBlock;
      
      return {
        ...prev,
        blocks
      };
    });
  };

  // Mover um bloco para baixo
  const moveBlockDown = (id: string) => {
    setResultPage(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(block => block.id === id);
      
      if (index >= blocks.length - 1) return prev;
      
      // Trocar a ordem dos blocos
      const temp = blocks[index + 1].order;
      blocks[index + 1].order = blocks[index].order;
      blocks[index].order = temp;
      
      // Trocar a posição dos blocos no array
      const tempBlock = blocks[index];
      blocks[index] = blocks[index + 1];
      blocks[index + 1] = tempBlock;
      
      return {
        ...prev,
        blocks
      };
    });
  };

  // Salvar as alterações
  const handleSave = () => {
    try {
      // Ordenar os blocos por order
      const sortedBlocks = [...resultPage.blocks].sort((a, b) => a.order - b.order);
      
      // Preparar o objeto de funil com os dados atualizados
      const updatedFunnel: QuizFunnel = {
        ...(initialFunnel || {
          id: `funnel_${Date.now()}`,
          name: 'Novo Funil',
          quizQuestions: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        resultPage: {
          ...resultPage,
          blocks: sortedBlocks
        },
        updatedAt: new Date()
      };
      
      // Chamar a função de salvamento passada como prop
      onSave(updatedFunnel);
      
      toast({
        title: "Alterações salvas",
        description: "Todas as alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Alternar entre modo de edição e pré-visualização
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Renderizar conteúdo de um bloco específico
  const renderBlockContent = (block: ResultPageBlock) => {
    if (!block.isVisible) return null;
    
    switch (block.type) {
      case 'title':
        return <h1 className="text-2xl font-bold text-center mb-4">{block.content}</h1>;
        
      case 'subtitle':
        return <h2 className="text-xl font-semibold mb-3">{block.content}</h2>;
        
      case 'text':
        return <p className="text-gray-700 mb-4">{block.content}</p>;
        
      case 'image':
        return (
          <div className="mb-4 text-center">
            {block.imageUrl ? (
              <img 
                src={block.imageUrl} 
                alt={block.content} 
                className="max-w-full h-auto mx-auto rounded"
              />
            ) : (
              <div className="bg-gray-200 h-40 flex items-center justify-center rounded">
                <ImageIcon className="h-10 w-10 text-gray-400" />
              </div>
            )}
            {block.content && <p className="mt-2 text-sm text-gray-500">{block.content}</p>}
          </div>
        );
        
      case 'styleResult':
        return (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{block.content}</h3>
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${block.settings?.percentage || 0}%` }}
                ></div>
              </div>
              <span className="ml-2">{block.settings?.percentage}%</span>
            </div>
            <p>{block.settings?.description}</p>
          </div>
        );
        
      case 'testimonial':
        const testimonial = block as TestimonialBlock;
        return (
          <div className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              {testimonial.settings?.authorImage ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img 
                    src={testimonial.settings.authorImage} 
                    alt={testimonial.settings.author} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <p className="font-medium">{testimonial.settings?.author}</p>
            </div>
            <p className="text-gray-700 text-sm italic">{block.content}</p>
          </div>
        );
        
      case 'cta':
        const cta = block as CTABlock;
        return (
          <div className="mb-6 text-center">
            <button 
              className="py-3 px-6 rounded-md text-center font-semibold"
              style={{ 
                backgroundColor: cta.settings?.backgroundColor || '#4CAF50',
                color: cta.settings?.textColor || '#FFFFFF'
              }}
            >
              {cta.settings?.buttonText}
            </button>
            {block.content && block.content !== cta.settings?.buttonText && (
              <p className="mt-2 text-sm text-gray-500">{block.content}</p>
            )}
          </div>
        );
        
      case 'guarantee':
        return (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Garantia</h3>
            <p className="text-gray-700">{block.content}</p>
          </div>
        );
        
      case 'bonus':
        return (
          <div className="mb-4 p-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                <CheckCircle className="h-3 w-3" />
              </div>
              <p>{block.content}</p>
            </div>
          </div>
        );
        
      default:
        return <p>Bloco não suportado: {block.type}</p>;
    }
  };

  // Renderizar a pré-visualização da página de resultados
  const renderPreview = () => {
    // Ordenar os blocos pela ordem
    const sortedBlocks = [...resultPage.blocks].sort((a, b) => a.order - b.order);
    
    return (
      <div 
        className="w-full h-full overflow-auto p-4"
        style={{ 
          backgroundColor: resultPage.settings.backgroundColor || '#fffaf7',
          fontFamily: resultPage.settings.fontFamily || 'inherit'
        }}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {sortedBlocks.map(block => (
            <div key={block.id}>
              {renderBlockContent(block)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar o editor de um bloco específico
  const renderBlockEditor = (block: ResultPageBlock, index: number) => {
    return (
      <Card key={block.id} className="p-0 overflow-hidden mb-4">
        <CardContent className="p-0">
          <div className="border-b p-3 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch 
                checked={block.isVisible} 
                onCheckedChange={(checked) => toggleBlockVisibility(block.id, checked)}
              />
              <span className="font-medium capitalize">{block.type}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => moveBlockUp(block.id)} disabled={index === 0}>
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => moveBlockDown(block.id)} disabled={index === resultPage.blocks.length - 1}>
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeBlock(block.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-3 space-y-3">
            {/* Campos comuns */}
            <div>
              <Label>Conteúdo</Label>
              <Textarea 
                value={block.content} 
                onChange={(e) => updateBlock(block.id, 'content', e.target.value)} 
                rows={3}
              />
            </div>
            
            {/* Campos específicos por tipo */}
            {block.type === 'image' && (
              <div>
                <Label>URL da Imagem</Label>
                <Input 
                  value={block.imageUrl || ''} 
                  onChange={(e) => updateBlock(block.id, 'imageUrl', e.target.value)} 
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            )}
            
            {block.type === 'cta' && (
              <>
                <div>
                  <Label>Texto do Botão</Label>
                  <Input 
                    value={(block as CTABlock).settings?.buttonText || ''} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, buttonText: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>URL de Destino</Label>
                  <Input 
                    value={(block as CTABlock).settings?.url || ''} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, url: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Cor de Fundo</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={(block as CTABlock).settings?.backgroundColor || '#4CAF50'} 
                        onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, backgroundColor: e.target.value })} 
                      />
                      <div 
                        className="w-6 h-6 border rounded" 
                        style={{ backgroundColor: (block as CTABlock).settings?.backgroundColor || '#4CAF50' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={(block as CTABlock).settings?.textColor || '#FFFFFF'} 
                        onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, textColor: e.target.value })} 
                      />
                      <div 
                        className="w-6 h-6 border rounded" 
                        style={{ backgroundColor: (block as CTABlock).settings?.textColor || '#FFFFFF' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {block.type === 'testimonial' && (
              <>
                <div>
                  <Label>Nome do Autor</Label>
                  <Input 
                    value={(block as TestimonialBlock).settings?.author || ''} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, author: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>URL da Imagem do Autor</Label>
                  <Input 
                    value={(block as TestimonialBlock).settings?.authorImage || ''} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, authorImage: e.target.value })} 
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </>
            )}
            
            {block.type === 'styleResult' && (
              <>
                <div>
                  <Label>Categoria de Estilo</Label>
                  <Select 
                    value={block.settings?.styleCategory || primaryStyle.category} 
                    onValueChange={(value) => updateBlock(block.id, 'settings', { ...block.settings, styleCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(styleConfig).map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Percentual</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={block.settings?.percentage || 0} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, percentage: parseInt(e.target.value) })} 
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea 
                    value={block.settings?.description || ''} 
                    onChange={(e) => updateBlock(block.id, 'settings', { ...block.settings, description: e.target.value })} 
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Renderizar o painel de configurações
  const renderSettingsPanel = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Mostrar Estilos Secundários</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Switch 
              checked={resultPage.settings.showSecondaryStyles || false} 
              onCheckedChange={(checked) => updateSettings('showSecondaryStyles', checked)}
            />
            <Label>
              {resultPage.settings.showSecondaryStyles ? 'Visível' : 'Oculto'}
            </Label>
          </div>
        </div>
        
        <div>
          <Label>URL do Background (opcional)</Label>
          <Input 
            value={resultPage.settings.backgroundImage || ''} 
            onChange={(e) => updateSettings('backgroundImage', e.target.value)} 
            placeholder="https://exemplo.com/fundo.jpg"
          />
        </div>
        
        <div>
          <Label>Família de Fontes</Label>
          <Select 
            value={resultPage.settings.fontFamily || 'inherit'} 
            onValueChange={(value) => updateSettings('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Padrão</SelectItem>
              <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
              <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
              <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
              <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // Renderizar o painel de estilos
  const renderStylesPanel = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Cor de Fundo</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              value={resultPage.settings.backgroundColor || '#fffaf7'} 
              onChange={(e) => updateSettings('backgroundColor', e.target.value)} 
            />
            <div 
              className="w-6 h-6 border rounded" 
              style={{ backgroundColor: resultPage.settings.backgroundColor || '#fffaf7' }}
            ></div>
          </div>
        </div>
        
        <div>
          <Label>Cor Primária</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              value={resultPage.settings.primaryColor || '#aa6b5d'} 
              onChange={(e) => updateSettings('primaryColor', e.target.value)} 
            />
            <div 
              className="w-6 h-6 border rounded" 
              style={{ backgroundColor: resultPage.settings.primaryColor || '#aa6b5d' }}
            ></div>
          </div>
        </div>
        
        <div>
          <Label>Cor Secundária</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input 
              value={resultPage.settings.secondaryColor || '#B89B7A'} 
              onChange={(e) => updateSettings('secondaryColor', e.target.value)} 
            />
            <div 
              className="w-6 h-6 border rounded" 
              style={{ backgroundColor: resultPage.settings.secondaryColor || '#B89B7A' }}
            ></div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">Estilo Principal</h3>
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="font-medium">{primaryStyle.category}</p>
            <p className="text-sm text-gray-500">Percentual: {primaryStyle.percentage}%</p>
          </div>
        </div>
        
        {secondaryStyles.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Estilos Secundários</h3>
            <div className="space-y-2">
              {secondaryStyles.map(style => (
                <div key={style.category} className="bg-gray-100 p-2 rounded-md">
                  <p className="font-medium">{style.category}</p>
                  <p className="text-sm text-gray-500">Percentual: {style.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar o painel de blocos
  const renderBlocksPanel = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Título da Página</h3>
          <Input 
            value={resultPage.title} 
            onChange={(e) => updatePageTitle(e.target.value)} 
            className="mt-1"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => addBlock('title')}>+ Título</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('subtitle')}>+ Subtítulo</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('text')}>+ Texto</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('image')}>+ Imagem</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('cta')}>+ CTA</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('testimonial')}>+ Depoimento</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('bonus')}>+ Bônus</Button>
          <Button size="sm" variant="outline" onClick={() => addBlock('guarantee')}>+ Garantia</Button>
        </div>
        
        <Separator />
        
        <div className="space-y-0">
          {resultPage.blocks
            .sort((a, b) => a.order - b.order)
            .map((block, index) => renderBlockEditor(block, index))}
        </div>
      </div>
    );
  };

  // Se estiver no modo de pré-visualização, mostrar a página de resultados
  if (previewMode) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-white border-b p-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Pré-visualização da Página de Resultados</h1>
          <Button variant="outline" onClick={togglePreviewMode}>
            <Edit className="h-4 w-4 mr-2" />
            Voltar para Edição
          </Button>
        </div>
        
        {renderPreview()}
      </div>
    );
  }

  // Renderizar o editor
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b p-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Editor da Página de Resultados</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreviewMode}>
            <EyeIcon className="h-4 w-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden grid grid-cols-4">
        {/* Painel de edição */}
        <div className="col-span-1 border-r">
          <div className="flex border-b">
            <Button 
              variant={activePanel === 'blocks' ? 'default' : 'ghost'}
              onClick={() => setActivePanel('blocks')}
              className="flex-1 rounded-none"
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              Blocos
            </Button>
            <Button 
              variant={activePanel === 'settings' ? 'default' : 'ghost'}
              onClick={() => setActivePanel('settings')}
              className="flex-1 rounded-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              Config.
            </Button>
            <Button 
              variant={activePanel === 'styles' ? 'default' : 'ghost'}
              onClick={() => setActivePanel('styles')}
              className="flex-1 rounded-none"
            >
              <Palette className="h-4 w-4 mr-2" />
              Estilos
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-112px)]">
            <div className="p-4">
              {activePanel === 'blocks' && renderBlocksPanel()}
              {activePanel === 'settings' && renderSettingsPanel()}
              {activePanel === 'styles' && renderStylesPanel()}
            </div>
          </ScrollArea>
        </div>
        
        {/* Painel de pré-visualização */}
        <div className="col-span-3 bg-gray-50 overflow-auto">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};