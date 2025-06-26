
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditorStage, EditorComponent } from '@/hooks/useLiveEditor';
import { Eye, EyeOff, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePreviewProps {
  stage?: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (componentId: string, updates: Partial<EditorComponent>) => void;
  isPreviewMode: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode
}) => {
  const [viewportMode, setViewportMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getViewportClasses = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  const renderComponent = (component: EditorComponent) => {
    const isSelected = selectedComponentId === component.id;
    
    return (
      <div
        key={component.id}
        className={`relative transition-all cursor-pointer ${
          isSelected && !isPreviewMode
            ? 'ring-2 ring-[#B89B7A] ring-offset-2' 
            : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
        }`}
        onClick={() => onSelectComponent(component.id)}
      >
        {/* Component Content */}
        <div className="bg-white">
          {component.type === 'hero' && (
            <div className="relative bg-gradient-to-br from-[#FAF9F7] to-[#F5F1ED] py-16 px-8 text-center">
              {component.content.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${component.content.backgroundImage})` }}
                />
              )}
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-[#432818] mb-6">
                  {component.content.title || 'Título do Hero'}
                </h1>
                <p className="text-xl text-[#432818]/80 mb-8 max-w-2xl mx-auto">
                  {component.content.subtitle || 'Subtítulo do hero section'}
                </p>
                <Button size="lg" className="bg-[#B89B7A] hover:bg-[#A1835D] text-white text-lg px-8 py-4">
                  {component.content.buttonText || 'Call to Action'}
                </Button>
              </div>
            </div>
          )}
          
          {component.type === 'question-title' && (
            <div className="text-center py-8 px-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#432818] mb-4">
                {component.content.text || 'Título da Questão'}
              </h2>
              {component.content.selections && (
                <p className="text-[#432818]/70">
                  Escolha {component.content.selections} opção{component.content.selections > 1 ? 'ões' : ''}
                </p>
              )}
            </div>
          )}
          
          {component.type === 'options-grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {component.content.options?.map((option: any, index: number) => (
                  <div key={option.id || index} className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#B89B7A] transition-colors">
                    {option.imageUrl && (
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img 
                          src={option.imageUrl} 
                          alt={option.text || `Opção ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm font-medium text-[#432818] text-center">
                      {option.text || `Opção ${index + 1}`}
                    </p>
                    {option.styleCategory && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {option.styleCategory}
                      </Badge>
                    )}
                  </div>
                )) || Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="aspect-square bg-gray-200 rounded mb-2"></div>
                    <p className="text-sm font-medium">Opção {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {component.type === 'image' && (
            <div className="p-4">
              {component.content.src ? (
                <img 
                  src={component.content.src} 
                  alt={component.content.alt || 'Imagem'} 
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    📷 Clique para adicionar imagem
                  </div>
                </div>
              )}
            </div>
          )}
          
          {component.type === 'result-header' && (
            <div className="bg-gradient-to-br from-[#FAF9F7] to-[#F5F1ED] py-12 px-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">
                {component.content.title || 'Seu Resultado'}
              </h1>
              <p className="text-lg text-[#432818]/80">
                {component.content.subtitle || 'Descubra seu estilo único'}
              </p>
            </div>
          )}
          
          {component.type === 'style-card' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {component.content.styles?.slice(0, 8).map((style: any) => (
                  <div key={style.category} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-[#B89B7A] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl text-white">🎨</span>
                    </div>
                    <h3 className="font-bold text-[#432818] mb-2">
                      {style.name || style.category}
                    </h3>
                    <p className="text-sm text-[#432818]/70 mb-3">
                      {style.description?.substring(0, 80) || 'Descrição do estilo'}...
                    </p>
                    {style.image && (
                      <img 
                        src={style.image} 
                        alt={style.name} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )) || (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Configurar estilos disponíveis
                  </div>
                )}
              </div>
            </div>
          )}
          
          {component.type === 'pricing' && (
            <div className="p-6 bg-gradient-to-br from-[#FAF9F7] to-white">
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-[#B89B7A]">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#432818] mb-4">
                    {component.content.title || 'Oferta Especial'}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-[#B89B7A]">
                      R$ {component.content.price || '197'}
                    </span>
                    {component.content.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        R$ {component.content.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                {component.content.features && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {component.content.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-[#432818]">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button size="lg" className="w-full bg-[#B89B7A] hover:bg-[#A1835D] text-white">
                  {component.content.buttonText || 'Comprar Agora'}
                </Button>
              </div>
            </div>
          )}
          
          {component.type === 'product-grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {component.content.products?.map((product: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-bold text-[#432818] mb-2">{product.name}</h4>
                    <p className="text-sm text-[#432818]/70">{product.description}</p>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Configurar produtos
                  </div>
                )}
              </div>
            </div>
          )}
          
          {component.type === 'testimonials' && (
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {component.content.testimonials?.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                      {testimonial.image && (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-[#432818]">{testimonial.author}</h5>
                        {testimonial.rating && (
                          <div className="flex text-yellow-400">
                            {Array.from({ length: testimonial.rating }, (_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[#432818]/80 italic">"{testimonial.text}"</p>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Configurar depoimentos
                  </div>
                )}
              </div>
            </div>
          )}
          
          {component.type === 'guarantee' && (
            <div className="p-6 bg-green-50 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-4xl mb-4">{component.content.icon || '🛡️'}</div>
                <h4 className="text-xl font-bold text-[#432818] mb-2">
                  {component.content.title || 'Garantia'}
                </h4>
                <p className="text-[#432818]/80">
                  {component.content.description || 'Descrição da garantia'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Selection Indicator */}
        {isSelected && !isPreviewMode && (
          <div className="absolute -top-2 -left-2 bg-[#B89B7A] text-white px-2 py-1 rounded text-xs font-medium z-10">
            {component.type}
          </div>
        )}
      </div>
    );
  };

  if (!stage) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAF9F7] text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-medium mb-2">Selecione uma etapa</h3>
          <p>Escolha uma etapa na sidebar para começar a editar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Preview Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#432818]">
              {stage.name}
            </h2>
            <Badge variant="secondary">
              {stage.type}
            </Badge>
            {stage.components.length > 0 && (
              <Badge variant="outline">
                {stage.components.length} componentes
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('desktop')}
                className="w-8 h-8 p-0"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('tablet')}
                className="w-8 h-8 p-0"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('mobile')}
                className="w-8 h-8 p-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={`transition-all duration-300 ${getViewportClasses()}`}>
          <div className="bg-white min-h-96">
            {stage.components.length > 0 ? (
              <div className="space-y-0">
                {stage.components.map(renderComponent)}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg m-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium mb-2">Nenhum componente</h3>
                  <p>Adicione componentes da sidebar para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
