
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface OptionConfigurationPanelProps {
  optionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (optionId: string, field: string, value: any) => void;
}

export const OptionConfigurationPanel: React.FC<OptionConfigurationPanelProps> = ({
  optionId,
  isOpen,
  onClose,
  onUpdate
}) => {
  if (!isOpen || !optionId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Configurar Opção</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="option-text">Texto da Opção</Label>
            <Textarea
              id="option-text"
              placeholder="Digite o texto da opção"
              rows={2}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="option-image">URL da Imagem</Label>
            <Input
              id="option-image"
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="option-alt">Texto Alternativo</Label>
            <Input
              id="option-alt"
              placeholder="Descrição da imagem"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="option-points">Pontos</Label>
            <Input
              id="option-points"
              type="number"
              placeholder="0"
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} className="flex-1">
              Salvar
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StageConfigurationPanelProps {
  stageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (stageId: string, field: string, value: any) => void;
}

export const StageConfigurationPanel: React.FC<StageConfigurationPanelProps> = ({
  stageId,
  isOpen,
  onClose,
  onUpdate
}) => {
  if (!isOpen || !stageId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Configurar Etapa</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stage-title">Título da Etapa</Label>
            <Input
              id="stage-title"
              placeholder="Nome da etapa"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="stage-type">Tipo da Etapa</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intro">Introdução</SelectItem>
                <SelectItem value="question">Questão</SelectItem>
                <SelectItem value="strategic">Estratégica</SelectItem>
                <SelectItem value="transition">Transição</SelectItem>
                <SelectItem value="capture">Captura</SelectItem>
                <SelectItem value="result">Resultado</SelectItem>
                <SelectItem value="offer">Oferta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="stage-description">Descrição</Label>
            <Textarea
              id="stage-description"
              placeholder="Descrição da etapa"
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} className="flex-1">
              Salvar
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
