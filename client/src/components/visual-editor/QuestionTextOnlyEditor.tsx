import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { QuestionTextOnlyData } from './QuestionTextOnlyComponent';

interface QuestionTextOnlyEditorProps {
  data: QuestionTextOnlyData;
  onChange: (data: QuestionTextOnlyData) => void;
}

export const QuestionTextOnlyEditor: React.FC<QuestionTextOnlyEditorProps> = ({
  data,
  onChange
}) => {
  const updateQuestion = (question: string) => {
    onChange({ ...data, question });
  };

  const updateMultipleChoice = (multipleChoice: boolean) => {
    onChange({ ...data, multipleChoice });
  };

  const updateMaxSelections = (maxSelections: number) => {
    onChange({ ...data, maxSelections });
  };

  const updateOption = (optionId: string, text: string) => {
    const updatedOptions = data.options.map(option =>
      option.id === optionId ? { ...option, text } : option
    );
    onChange({ ...data, options: updatedOptions });
  };

  const addOption = () => {
    const newLetter = String.fromCharCode(65 + data.options.length); // A, B, C, etc.
    const newOption = {
      id: `opt-${Date.now()}`,
      letter: newLetter,
      text: `Nova opção ${newLetter}`
    };
    onChange({ ...data, options: [...data.options, newOption] });
  };

  const removeOption = (optionId: string) => {
    if (data.options.length <= 2) return; // Mínimo 2 opções
    const filteredOptions = data.options.filter(option => option.id !== optionId);
    // Reordenar letras
    const reorderedOptions = filteredOptions.map((option, index) => ({
      ...option,
      letter: String.fromCharCode(65 + index)
    }));
    onChange({ ...data, options: reorderedOptions });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Questão Texto</h3>
        <p className="text-sm text-blue-700">
          Questão com opções somente texto, sem imagens
        </p>
      </div>

      {/* Configurações da Questão */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="question-text" className="text-sm font-medium">
            Texto da Questão
          </Label>
          <Textarea
            id="question-text"
            value={data.question}
            onChange={(e) => updateQuestion(e.target.value)}
            placeholder="Digite a pergunta..."
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="multiple-choice"
              checked={data.multipleChoice}
              onCheckedChange={updateMultipleChoice}
            />
            <Label htmlFor="multiple-choice" className="text-sm">
              Seleção Múltipla
            </Label>
          </div>

          {data.multipleChoice && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="max-selections" className="text-xs">
                Máx:
              </Label>
              <Input
                id="max-selections"
                type="number"
                min="1"
                max={data.options.length}
                value={data.maxSelections}
                onChange={(e) => updateMaxSelections(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Editor de Opções */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Opções ({data.options.length})
          </Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addOption}
            className="h-8 px-2"
            disabled={data.options.length >= 10}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {data.options.map((option, index) => (
            <div key={option.id} className="flex items-start space-x-2 bg-gray-50 p-2 rounded border">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold text-blue-700 mt-1">
                {option.letter}
              </div>
              
              <Textarea
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Opção ${option.letter}...`}
                className="flex-1 min-h-[60px] text-sm"
                rows={2}
              />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeOption(option.id)}
                disabled={data.options.length <= 2}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Remover opção"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {data.options.length >= 10 && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            Máximo de 10 opções permitidas
          </p>
        )}
      </div>

      {/* Resumo das Configurações */}
      <div className="bg-gray-50 p-3 rounded border text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>Tipo:</strong> {data.multipleChoice ? 'Múltipla Escolha' : 'Única Escolha'}
          </div>
          <div>
            <strong>Opções:</strong> {data.options.length}
          </div>
          {data.multipleChoice && (
            <div className="col-span-2">
              <strong>Máx. Seleções:</strong> {data.maxSelections}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};