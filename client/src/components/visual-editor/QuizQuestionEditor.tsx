import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Trash2, Image, Save, Eye } from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  value: string;
  category: string;
  image?: string;
}

interface QuizQuestionEditorProps {
  questionData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const STYLE_CATEGORIES = [
  'Natural',
  'Clássico', 
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo'
];

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dqljyf76t/image/upload/';

const QUESTION_TEMPLATES = {
  'Tipo de roupa favorita': {
    options: [
      { category: 'Natural', text: 'Conforto, leveza e praticidade no vestir', image: 'v1744735329/11_hqmr8l.webp' },
      { category: 'Clássico', text: 'Discrição, caimento clássico e sobriedade', image: 'v1744735330/12_edlmwf.webp' },
      { category: 'Contemporâneo', text: 'Praticidade com um toque de estilo atual', image: 'v1744735317/4_snhaym.webp' },
      { category: 'Elegante', text: 'Elegância refinada, moderna e sem exageros', image: 'v1744735330/14_l2nprc.webp' },
      { category: 'Romântico', text: 'Delicadeza em tecidos suaves e fluidos', image: 'v1744735317/15_xezvcy.webp' },
      { category: 'Sexy', text: 'Sensualidade com destaque para o corpo', image: 'v1744735316/16_mpqpew.webp' },
      { category: 'Dramático', text: 'Impacto visual com peças estruturadas e assimétricas', image: 'v1744735319/17_m5ogub.webp' },
      { category: 'Criativo', text: 'Mix criativo com formas ousadas e originais', image: 'v1744735317/18_j8ipfb.webp' }
    ]
  },
  'Personalidade': {
    options: [
      { category: 'Natural', text: 'Informal, espontânea, alegre, essencialista' },
      { category: 'Clássico', text: 'Conservadora, séria, organizada' },
      { category: 'Contemporâneo', text: 'Informada, ativa, prática' },
      { category: 'Elegante', text: 'Exigente, sofisticada, seletiva' },
      { category: 'Romântico', text: 'Feminina, meiga, delicada, sensível' },
      { category: 'Sexy', text: 'Glamorosa, vaidosa, sensual' },
      { category: 'Dramático', text: 'Cosmopolita, moderna e audaciosa' },
      { category: 'Criativo', text: 'Exótica, aventureira, livre' }
    ]
  },
  'Visual identificação': {
    options: [
      { category: 'Natural', text: 'Visual leve, despojado e natural', image: 'v1744735317/2_ziffwx.webp' },
      { category: 'Clássico', text: 'Visual clássico e tradicional', image: 'v1744735317/3_asaunw.webp' },
      { category: 'Contemporâneo', text: 'Visual casual com toque atual', image: 'v1744735329/13_uvbciq.webp' },
      { category: 'Elegante', text: 'Visual refinado e imponente', image: 'v1744735317/5_dhrgpf.webp' },
      { category: 'Romântico', text: 'Visual romântico, feminino e delicado', image: 'v1744735330/6_gnoxfg.webp' },
      { category: 'Sexy', text: 'Visual sensual, com saia justa e decote', image: 'v1744735327/7_ynez1z.webp' },
      { category: 'Dramático', text: 'Visual marcante e urbano (jeans + jaqueta)', image: 'v1744735329/8_yqu3hw.webp' },
      { category: 'Criativo', text: 'Visual criativo, colorido e ousado', image: 'v1744735329/9_x6so6a.webp' }
    ]
  }
};

export const QuizQuestionEditor: React.FC<QuizQuestionEditorProps> = ({
  questionData,
  onSave,
  onCancel
}) => {
  const [question, setQuestion] = useState(questionData?.text || '');
  const [options, setOptions] = useState<QuestionOption[]>(
    questionData?.options || []
  );
  const [hasImages, setHasImages] = useState(questionData?.hasImages || false);
  const [multiSelect, setMultiSelect] = useState(questionData?.multiSelect || false);
  const [selectionLimit, setSelectionLimit] = useState(questionData?.selectionLimit || 3);

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: 'Nova opção',
      value: `option-${options.length + 1}`,
      category: 'Natural',
      image: hasImages ? '' : undefined
    };
    setOptions([...options, newOption]);
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const applyTemplate = (templateKey: string) => {
    const template = QUESTION_TEMPLATES[templateKey as keyof typeof QUESTION_TEMPLATES];
    if (template) {
      const templateOptions = template.options.map((opt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: opt.text,
        value: opt.category.toLowerCase(),
        category: opt.category,
        image: opt.image ? CLOUDINARY_BASE + opt.image : undefined
      }));
      
      setOptions(templateOptions);
      setHasImages(templateOptions.some(opt => opt.image));
      setMultiSelect(true);
      setSelectionLimit(3);
    }
  };

  const handleSave = () => {
    const savedData = {
      text: question,
      options: options,
      hasImages: hasImages,
      multiSelect: multiSelect,
      selectionLimit: selectionLimit
    };
    onSave(savedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Editor de Questão do Quiz</h2>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar - Templates */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-medium mb-3">Templates Pré-definidos</h3>
            <div className="space-y-2">
              {Object.keys(QUESTION_TEMPLATES).map(template => (
                <Button
                  key={template}
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate(template)}
                  className="w-full justify-start text-xs"
                >
                  {template}
                </Button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-sm font-medium">Configurações</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hasImages}
                      onCheckedChange={setHasImages}
                    />
                    <Label className="text-xs">Opções com imagens</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={multiSelect}
                      onCheckedChange={setMultiSelect}
                    />
                    <Label className="text-xs">Seleção múltipla</Label>
                  </div>

                  {multiSelect && (
                    <div>
                      <Label className="text-xs">Limite de seleções</Label>
                      <Input
                        type="number"
                        value={selectionLimit}
                        onChange={(e) => setSelectionLimit(parseInt(e.target.value) || 1)}
                        min={1}
                        max={8}
                        className="mt-1 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Question Text */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Texto da Pergunta</Label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Digite a pergunta..."
                  className="w-full"
                  rows={2}
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Opções de Resposta</Label>
                  <Button size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Opção
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((option, index) => (
                    <Card key={option.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeOption(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Textarea
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          placeholder="Texto da opção"
                          className="text-xs"
                          rows={2}
                        />

                        <select
                          value={option.category}
                          onChange={(e) => updateOption(index, 'category', e.target.value)}
                          className="w-full text-xs border rounded px-2 py-1"
                        >
                          {STYLE_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        {hasImages && (
                          <div>
                            <Input
                              value={option.image || ''}
                              onChange={(e) => updateOption(index, 'image', e.target.value)}
                              placeholder="URL da imagem (Cloudinary)"
                              className="text-xs"
                            />
                            {option.image && (
                              <img
                                src={option.image}
                                alt={option.text}
                                className="w-full h-20 object-cover rounded mt-2"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6">
                <Label className="text-sm font-medium mb-2 block">Preview da Questão</Label>
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-medium text-lg mb-4">{question || 'Sua pergunta aparecerá aqui'}</h3>
                  
                  <div className={`grid gap-3 ${hasImages ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {options.map((option, index) => (
                      <div key={option.id} className="border rounded p-3 bg-white">
                        <div className="flex items-start space-x-2">
                          <Badge className="text-xs">
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <div className="flex-1">
                            {hasImages && option.image && (
                              <img
                                src={option.image}
                                alt={option.text}
                                className="w-full h-20 object-cover rounded mb-2"
                              />
                            )}
                            <p className="text-sm">{option.text}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {option.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {multiSelect && (
                    <p className="text-xs text-gray-600 mt-3">
                      Selecione até {selectionLimit} opções
                    </p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionEditor;