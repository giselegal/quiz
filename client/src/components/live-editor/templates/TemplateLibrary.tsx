import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  Heart,
  Crown,
  Palette,
  Layout
} from 'lucide-react';
import { EditorStage } from '@/hooks/useLiveEditor';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'quiz' | 'lead-magnet' | 'sales' | 'engagement';
  thumbnail: string;
  stages: Partial<EditorStage>[];
  tags: string[];
  conversionRate?: number;
  difficulty: 'easy' | 'medium' | 'advanced';
}

interface TemplateLibraryProps {
  onTemplateSelect: (template: Template) => void;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: 'style-discovery-pro',
    name: 'Quiz de Estilo Profissional',
    description: 'Template otimizado para descoberta de estilo pessoal com alta conversão',
    category: 'quiz',
    thumbnail: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
    tags: ['estilo', 'moda', 'personalidade', 'alta-conversão'],
    conversionRate: 85,
    difficulty: 'easy',
    stages: [
      {
        name: 'Introdução Cativante',
        type: 'intro',
        components: [
          {
            id: 'hero-intro',
            type: 'hero',
            content: {
              title: 'Descubra Seu Estilo Único em 3 Minutos',
              subtitle: 'Quiz personalizado que revela seu estilo autêntico',
              buttonText: 'Começar Descoberta'
            },
            style: {
              backgroundColor: '#FAF9F7',
              textColor: '#432818'
            },
            position: { x: 0, y: 0 },
            size: { width: 100, height: 400 }
          }
        ]
      }
    ]
  },
  {
    id: 'lead-magnet-ultimate',
    name: 'Gerador de Leads Premium',
    description: 'Template focado em captura de leads com estratégias de neuromarketing',
    category: 'lead-magnet',
    thumbnail: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
    tags: ['leads', 'email', 'conversão', 'neuromarketing'],
    conversionRate: 73,
    difficulty: 'medium',
    stages: []
  },
  {
    id: 'engagement-quiz',
    name: 'Quiz de Engajamento Viral',
    description: 'Maximize o compartilhamento e engajamento nas redes sociais',
    category: 'engagement',
    thumbnail: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744923890/testimonial1_vw8gzx.webp',
    tags: ['viral', 'redes-sociais', 'engajamento', 'compartilhamento'],
    conversionRate: 92,
    difficulty: 'easy',
    stages: []
  },
  {
    id: 'sales-funnel-complete',
    name: 'Funil de Vendas Completo',
    description: 'Template de quiz que conduz naturalmente para a venda',
    category: 'sales',
    thumbnail: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744923891/testimonial2_kx9pql.webp',
    tags: ['vendas', 'funil', 'conversão', 'persuasão'],
    conversionRate: 68,
    difficulty: 'advanced',
    stages: []
  }
];

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onTemplateSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Layout },
    { id: 'quiz', name: 'Quiz', icon: Target },
    { id: 'lead-magnet', name: 'Lead Magnet', icon: Users },
    { id: 'sales', name: 'Vendas', icon: TrendingUp },
    { id: 'engagement', name: 'Engajamento', icon: Heart }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quiz': return Target;
      case 'lead-magnet': return Users;
      case 'sales': return TrendingUp;
      case 'engagement': return Heart;
      default: return Layout;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#B89B7A]" />
              <h2 className="text-2xl font-bold text-[#432818]">Templates Inteligentes</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              ✕
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <Card
                  key={template.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    {template.conversionRate && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {template.conversionRate}% conversão
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="w-4 h-4 text-[#B89B7A]" />
                      <h3 className="font-semibold text-[#432818]">{template.name}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full bg-[#B89B7A] hover:bg-[#A1835D] text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto mb-2" />
                <p>Nenhum template encontrado</p>
                <p className="text-sm">Tente ajustar sua busca ou filtros</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default TemplateLibrary;
