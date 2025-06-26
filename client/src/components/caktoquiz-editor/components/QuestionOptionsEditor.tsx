import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Edit3, 
  GripVertical, 
  Settings,
  Eye,
  EyeOff,
  Upload,
  Palette,
  Grid3X3,
  Type,
  MousePointer
} from 'lucide-react'

interface QuestionOption {
  id: string
  letter: string
  text: string
  image: string
  points: Record<string, number>
  visible: boolean
}

interface QuestionOptionsEditorProps {
  component: any
  onUpdate: (updates: any) => void
  className?: string
}

const defaultOptions: QuestionOption[] = [
  { id: 'opt-a', letter: 'A', text: 'Amo roupas confortáveis e práticas para o dia a dia.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/b2fefbd6-0e7d-4582-ba8b-2896addff401.png', points: { casual: 3, comfortable: 5 }, visible: true },
  { id: 'opt-b', letter: 'B', text: 'Prefiro peças discretas, clássicas e atemporais.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/b15ba435-ffdf-4cc4-babf-db387ddd5966.png', points: { classic: 5, elegant: 3 }, visible: true },
  { id: 'opt-c', letter: 'C', text: 'Gosto de roupas casuais, mas com um toque de estilo.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/5932c580-f01e-4d7d-a205-fb28de5ac3ef.png', points: { casual: 4, modern: 3 }, visible: true },
  { id: 'opt-d', letter: 'D', text: 'Escolho peças elegantes, com cortes impecáveis e sofisticados.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/41147537-a827-4186-b335-f927bfb60584.png', points: { elegant: 5, sophisticated: 4 }, visible: true },
  { id: 'opt-e', letter: 'E', text: 'Adoro roupas leves e delicadas, com cores suaves.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/bea71e05-26ef-457f-82e5-f1557f80f667.png', points: { romantic: 5, soft: 4 }, visible: true },
  { id: 'opt-f', letter: 'F', text: 'Roupas que valorizam meu corpo são as minhas favoritas.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/a5839aa4-5fdd-4f28-9b5e-212f76bc7f8b.png', points: { sensual: 5, confident: 4 }, visible: true },
  { id: 'opt-g', letter: 'G', text: 'Adoro roupas modernas, com cortes diferentes e detalhes únicos.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/1a64dd93-e81e-4c69-8e9a-a7929f61ec4c.png', points: { modern: 5, creative: 4 }, visible: true },
  { id: 'opt-h', letter: 'H', text: 'Amo looks marcantes e criativos, cheios de personalidade.', image: 'https://cakto-quiz-br01.b-cdn.net/uploads/4f5b215c-b36c-429f-9006-14d957e6ddd0.png', points: { dramatic: 5, creative: 5 }, visible: true }
]

export const QuestionOptionsEditor: React.FC<QuestionOptionsEditorProps> = ({
  component,
  onUpdate,
  className = ''
}) => {
  const [options, setOptions] = useState<QuestionOption[]>(component.data?.options || defaultOptions)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')

  const updateOption = useCallback((optionId: string, updates: Partial<QuestionOption>) => {
    const newOptions = options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    )
    setOptions(newOptions)
    onUpdate({
      data: {
        ...component.data,
        options: newOptions
      }
    })
  }, [options, component.data, onUpdate])

  const addOption = useCallback(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const usedLetters = options.map(opt => opt.letter)
    const nextLetter = Array.from(letters).find((letter: string) => !usedLetters.includes(letter)) || `${letters[options.length % 26]}${Math.floor(options.length / 26) + 1}`
    
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      letter: nextLetter,
      text: 'Nova opção',
      image: '',
      points: {},
      visible: true
    }
    
    const newOptions = [...options, newOption]
    setOptions(newOptions)
    onUpdate({
      data: {
        ...component.data,
        options: newOptions
      }
    })
  }, [options, component.data, onUpdate])

  const removeOption = useCallback((optionId: string) => {
    const newOptions = options.filter(opt => opt.id !== optionId)
    setOptions(newOptions)
    onUpdate({
      data: {
        ...component.data,
        options: newOptions
      }
    })
  }, [options, component.data, onUpdate])

  const toggleOptionVisibility = useCallback((optionId: string) => {
    updateOption(optionId, { visible: !options.find(opt => opt.id === optionId)?.visible })
  }, [options, updateOption])

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header Controls */}
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-zinc-100">Opções do Quiz</h3>
            <Badge variant="secondary" className="text-xs">
              {options.filter(opt => opt.visible).length} visíveis
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('edit')}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant={previewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Grid Layout Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Layout do Grid</Label>
            <Select 
              value={component.data?.gridCols || '2'} 
              onValueChange={(value) => onUpdate({ 
                data: { ...component.data, gridCols: value } 
              })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Colunas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Coluna</SelectItem>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
                <SelectItem value="4">4 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-300">Seleção Múltipla</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={component.data?.multipleSelection || false}
                  onCheckedChange={(checked) => onUpdate({
                    data: { ...component.data, multipleSelection: checked }
                  })}
                />
                <Label className="text-sm">Ativar</Label>
              </div>
              {component.data?.multipleSelection && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-zinc-400">Limite:</Label>
                  <Input
                    type="number"
                    min="2"
                    max="8"
                    value={component.data?.selectionLimit || 3}
                    onChange={(e) => onUpdate({
                      data: { ...component.data, selectionLimit: parseInt(e.target.value) }
                    })}
                    className="w-16 h-8 bg-zinc-800 border-zinc-700 text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Options List/Preview */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {previewMode === 'preview' ? (
            /* Preview Mode - Replica exactly the CaktoQuiz layout */
            <div className={`grid grid-cols-${component.data?.gridCols || '2'} gap-2`}>
              {options.filter(opt => opt.visible).map((option) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto py-2 flex-col items-center justify-start border drop-shadow-md option-button"
                >
                  {option.image && (
                    <img 
                      src={option.image} 
                      alt={option.text}
                      className="w-full rounded-t-md bg-white h-full"
                      style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                    />
                  )}
                  <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                    <div className="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
                      <p><strong>{option.letter})</strong> {option.text}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Edit Mode - Advanced Option Editor */
            <div className="space-y-4">
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`border rounded-lg p-4 ${
                      selectedOption === option.id
                        ? 'border-amber-500 bg-amber-500/5'
                        : 'border-zinc-700 bg-zinc-800/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                          {option.letter}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOptionVisibility(option.id)}
                          className="p-1"
                        >
                          {option.visible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-zinc-500" />
                          )}
                        </Button>
                      </div>

                      <div className="flex-1 space-y-3">
                        {/* Option Text */}
                        <div className="space-y-2">
                          <Label className="text-sm text-zinc-300">Texto da Opção</Label>
                          <Textarea
                            value={option.text}
                            onChange={(e) => updateOption(option.id, { text: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
                            rows={2}
                            placeholder="Digite o texto da opção..."
                          />
                        </div>

                        {/* Option Image */}
                        <div className="space-y-2">
                          <Label className="text-sm text-zinc-300">Imagem</Label>
                          <div className="flex gap-2">
                            <Input
                              value={option.image}
                              onChange={(e) => updateOption(option.id, { image: e.target.value })}
                              className="bg-zinc-800 border-zinc-700 text-zinc-100"
                              placeholder="URL da imagem..."
                            />
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                          {option.image && (
                            <div className="mt-2">
                              <img 
                                src={option.image} 
                                alt="Preview"
                                className="w-20 h-20 rounded object-cover border border-zinc-700"
                              />
                            </div>
                          )}
                        </div>

                        {/* Points Configuration */}
                        <div className="space-y-2">
                          <Label className="text-sm text-zinc-300">Pontuação por Estilo</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['casual', 'elegant', 'romantic', 'dramatic', 'modern', 'classic'].map((style) => (
                              <div key={style} className="flex items-center gap-2">
                                <Label className="text-xs text-zinc-400 capitalize w-16">{style}</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={option.points[style] || 0}
                                  onChange={(e) => updateOption(option.id, {
                                    points: {
                                      ...option.points,
                                      [style]: parseInt(e.target.value) || 0
                                    }
                                  })}
                                  className="w-16 h-8 bg-zinc-800 border-zinc-700 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="cursor-move text-zinc-500">
                          <GripVertical className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Option Button */}
              <Button
                onClick={addOption}
                variant="outline"
                className="w-full h-12 border-2 border-dashed border-zinc-600 hover:border-amber-500 text-zinc-400 hover:text-amber-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Nova Opção
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* JavaScript Code Generator */}
      {component.data?.multipleSelection && (
        <div className="p-4 border-t border-zinc-800/60 bg-zinc-900/50">
          <Label className="text-sm text-zinc-300 mb-2 block">JavaScript Gerado (Seleção Múltipla)</Label>
          <div className="bg-zinc-800 p-3 rounded text-xs text-green-400 font-mono">
            <div className="text-zinc-400">// Código automático para seleção múltipla</div>
            <div>const selectedOptions = new Set();</div>
            <div>const selectionLimit = {component.data?.selectionLimit || 3};</div>
            <div className="text-zinc-400">// Validação e controle de botão "Continuar"</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionOptionsEditor