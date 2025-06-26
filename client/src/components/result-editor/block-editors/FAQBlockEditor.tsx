
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';

interface FAQBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const FAQBlockEditor: React.FC<FAQBlockEditorProps> = ({ block, onUpdate }) => {
  const { content = {} } = block;
  const faqItems = content.faqItems || [];

  const handleAddFAQ = () => {
    const newFaqItems = [...faqItems, { question: 'Nova pergunta', answer: 'Nova resposta' }];
    onUpdate({ ...content, faqItems: newFaqItems });
  };

  const handleRemoveFAQ = (index: number) => {
    const newFaqItems = [...faqItems];
    newFaqItems.splice(index, 1);
    onUpdate({ ...content, faqItems: newFaqItems });
  };

  const handleQuestionChange = (index: number, question: string) => {
    const newFaqItems = [...faqItems];
    newFaqItems[index] = { ...newFaqItems[index], question };
    onUpdate({ ...content, faqItems: newFaqItems });
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newFaqItems = [...faqItems];
    newFaqItems[index] = { ...newFaqItems[index], answer };
    onUpdate({ ...content, faqItems: newFaqItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="defaultOpen"
          checked={content.defaultOpen || false}
          onCheckedChange={(checked) => onUpdate({ ...content, defaultOpen: checked })}
        />
        <Label htmlFor="defaultOpen">Abrir primeiro item por padrão</Label>
      </div>

      <div className="space-y-4">
        <Label>Perguntas & Respostas</Label>
        {faqItems.map((item, index) => (
          <Card key={index} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Pergunta {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFAQ(index)}
                className="h-7 w-7 p-0 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`question-${index}`}>Pergunta</Label>
              <Input
                id={`question-${index}`}
                value={item.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Digite a pergunta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`answer-${index}`}>Resposta</Label>
              <Textarea
                id={`answer-${index}`}
                value={item.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Digite a resposta"
                className="min-h-[100px]"
              />
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleAddFAQ} variant="outline" className="w-full">
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Pergunta
      </Button>
    </div>
  );
};

export default FAQBlockEditor;
