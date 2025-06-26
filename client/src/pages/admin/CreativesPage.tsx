import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Download, Upload, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Creative {
  id: string;
  name: string;
  type: 'banner' | 'video' | 'carousel' | 'story';
  status: 'active' | 'paused' | 'draft';
  performance: {
    ctr: number;
    conversions: number;
    spend: number;
    roas: number;
  };
  createdAt: string;
  lastModified: string;
  thumbnail: string;
}

const mockCreatives: Creative[] = [
  {
    id: '1',
    name: 'Banner Principal - Quiz Estilo',
    type: 'banner',
    status: 'active',
    performance: { ctr: 3.2, conversions: 45, spend: 250, roas: 4.2 },
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    thumbnail: '/placeholder-creative.jpg'
  },
  {
    id: '2',
    name: 'Vídeo Explicativo - 30s',
    type: 'video',
    status: 'active',
    performance: { ctr: 5.8, conversions: 78, spend: 380, roas: 6.1 },
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    thumbnail: '/placeholder-video.jpg'
  },
  {
    id: '3',
    name: 'Carousel - Antes/Depois',
    type: 'carousel',
    status: 'paused',
    performance: { ctr: 2.1, conversions: 23, spend: 180, roas: 2.8 },
    createdAt: '2024-01-08',
    lastModified: '2024-01-15',
    thumbnail: '/placeholder-carousel.jpg'
  },
  {
    id: '4',
    name: 'Stories - Quiz Rápido',
    type: 'story',
    status: 'draft',
    performance: { ctr: 0, conversions: 0, spend: 0, roas: 0 },
    createdAt: '2024-01-22',
    lastModified: '2024-01-22',
    thumbnail: '/placeholder-story.jpg'
  }
];

const CreativesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredCreatives = mockCreatives.filter(creative => {
    const matchesSearch = creative.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || creative.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || creative.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return '🖼️';
      case 'video': return '🎥';
      case 'carousel': return '📱';
      case 'story': return '📖';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criativos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus criativos publicitários e analise performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button size="sm" className="bg-[#B89B7A] hover:bg-[#A88B6A] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Criativo
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Criativos</p>
                <p className="text-2xl font-bold text-gray-900">{mockCreatives.length}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CTR Médio</p>
                <p className="text-2xl font-bold text-green-600">3.8%</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversões</p>
                <p className="text-2xl font-bold text-blue-600">146</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROAS Médio</p>
                <p className="text-2xl font-bold text-purple-600">4.3x</p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar criativos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Todos os tipos</option>
              <option value="banner">Banner</option>
              <option value="video">Vídeo</option>
              <option value="carousel">Carousel</option>
              <option value="story">Stories</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="paused">Pausado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Criativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCreatives.map((creative) => (
          <Card key={creative.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTypeIcon(creative.type)}</div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{creative.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusBadgeVariant(creative.status)}>
                        {creative.status}
                      </Badge>
                      <span className="text-sm text-gray-500 capitalize">{creative.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Performance Metrics */}
              {creative.status !== 'draft' && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CTR</span>
                    <span className="font-semibold text-green-600">{creative.performance.ctr}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversões</span>
                    <span className="font-semibold">{creative.performance.conversions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gasto</span>
                    <span className="font-semibold">R$ {creative.performance.spend}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROAS</span>
                    <span className="font-semibold text-purple-600">{creative.performance.roas}x</span>
                  </div>
                  
                  {/* Performance Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Performance</span>
                      <span className="text-gray-600">{Math.round(creative.performance.roas * 20)}%</span>
                    </div>
                    <Progress value={creative.performance.roas * 20} className="h-2" />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="text-xs text-gray-500 mb-4">
                <p>Criado: {new Date(creative.createdAt).toLocaleDateString('pt-BR')}</p>
                <p>Modificado: {new Date(creative.lastModified).toLocaleDateString('pt-BR')}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCreatives.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum criativo encontrado</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro criativo publicitário.'}
          </p>
          <Button className="bg-[#B89B7A] hover:bg-[#A88B6A] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Criativo
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreativesPage;
