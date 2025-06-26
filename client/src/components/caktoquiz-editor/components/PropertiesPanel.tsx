import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Upload, Palette, Type, Image, MousePointer, Layout, Code, X, Edit3, Trash2 } from 'lucide-react'
import QuestionOptionsEditor from './QuestionOptionsEditor'

interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'options' | 'input' | 'spacer' | 'divider' | 'html' | 'script' | 'video' | 'testimonial' | 'price' | 'countdown' | 'guarantee' | 'bonus' | 'faq' | 'social-proof' | 'logo' | 'progress'
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface HeaderConfig {
  logoUrl: string
  showLogo: boolean
  showProgress: boolean
  showBackButton: boolean
}

interface PropertiesPanelProps {
  selectedComponent: QuizComponent | null
  headerConfig: HeaderConfig
  onUpdateComponent: (id: string, updates: Partial<QuizComponent>) => void
  onUpdateHeaderConfig: (updates: Partial<HeaderConfig>) => void
}

// Componentes de formulário específicos
const ColorPicker: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
}> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <Label className="text-xs text-zinc-400">{label}</Label>
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded border-0 cursor-pointer bg-transparent"
        />
      </div>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-8 text-xs bg-zinc-800 border-zinc-700 text-white"
        placeholder="#000000"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  </div>
)

const EnhancedSwitch: React.FC<{
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-start space-x-3">
    <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5" />
    <div className="flex-1">
      <Label className="text-xs font-medium text-zinc-300">{label}</Label>
      {description && (
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      )}
    </div>
  </div>
)

const ImageUploader: React.FC<{
  value: string
  onChange: (value: string) => void
  label: string
}> = ({ value, onChange, label }) => (
  <div className="space-y-2">
    <Label className="text-xs text-zinc-400">{label}</Label>
    <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center">
      {value ? (
        <div className="space-y-2">
          <img src={value} alt="Preview" className="w-full h-24 object-cover rounded" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-zinc-800 border-zinc-700">
              <Edit3 className="w-3 h-3 mr-2" />
              Alterar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onChange('')}
              className="text-red-400 hover:text-red-300 bg-zinc-800 border-zinc-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-zinc-500" />
          <div>
            <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700">
              Fazer Upload
            </Button>
            <p className="text-xs text-zinc-500 mt-2">ou cole uma URL</p>
            <Input
              placeholder="https://exemplo.com/imagem.jpg"
              className="mt-2 h-8 text-xs bg-zinc-800 border-zinc-700 text-white"
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  </div>
)

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'heading': return Type
    case 'text': return Type
    case 'image': return Image
    case 'button': return MousePointer
    case 'input': return Layout
    case 'options': return MousePointer
    case 'spacer': return Layout
    case 'divider': return Layout
    case 'script': return Code
    case 'html': return Code
    default: return Settings
  }
}

const ComponentPropertiesForm: React.FC<{
  component: QuizComponent
  onUpdate: (updates: Record<string, any>) => void
}> = ({ component, onUpdate }) => {
  const updateProp = (key: string, value: any) => {
    onUpdate({ props: { ...component.props, [key]: value } })
  }

  switch (component.type) {
    case 'heading':
    case 'text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Texto</Label>
            <Textarea
              value={component.props.text || ''}
              onChange={(e) => updateProp('text', e.target.value)}
              className="min-h-[80px] text-xs bg-zinc-900 border-zinc-700 text-white"
              placeholder="Digite o texto..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Tamanho</Label>
              <Select value={component.props.fontSize || '1rem'} onValueChange={(value) => updateProp('fontSize', value)}>
                <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.75rem">12px</SelectItem>
                  <SelectItem value="0.875rem">14px</SelectItem>
                  <SelectItem value="1rem">16px</SelectItem>
                  <SelectItem value="1.125rem">18px</SelectItem>
                  <SelectItem value="1.25rem">20px</SelectItem>
                  <SelectItem value="1.5rem">24px</SelectItem>
                  <SelectItem value="2rem">32px</SelectItem>
                  <SelectItem value="2.5rem">40px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Peso</Label>
              <Select value={component.props.fontWeight || 'normal'} onValueChange={(value) => updateProp('fontWeight', value)}>
                <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Alinhamento</Label>
            <Select value={component.props.textAlign || 'left'} onValueChange={(value) => updateProp('textAlign', value)}>
              <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )

    case 'button':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Texto do Botão</Label>
            <Input
              value={component.props.buttonText || component.props.text || ''}
              onChange={(e) => updateProp('buttonText', e.target.value)}
              className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
              placeholder="Digite o texto..."
            />
          </div>
          <EnhancedSwitch
            label="Desabilitado"
            description="Botão não poderá ser clicado"
            checked={component.props.disabled || false}
            onChange={(checked) => updateProp('disabled', checked)}
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-4">
          <ImageUploader
            value={component.props.src || ''}
            onChange={(value) => updateProp('src', value)}
            label="Imagem"
          />
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Texto Alternativo</Label>
            <Input
              value={component.props.alt || ''}
              onChange={(e) => updateProp('alt', e.target.value)}
              className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
              placeholder="Descrição da imagem"
            />
          </div>
        </div>
      )

    case 'options':
      return (
        <QuestionOptionsEditor
          component={component}
          onUpdate={(updates) => {
            Object.entries(updates).forEach(([key, value]) => {
              if (key === 'data') {
                updateProp('data', value)
              } else {
                updateProp(key, value)
              }
            })
          }}
          className="h-full"
        />
      )

    case 'spacer':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Altura</Label>
          <Input
            value={component.props.height || '40px'}
            onChange={(e) => updateProp('height', e.target.value)}
            className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
            placeholder="40px"
          />
        </div>
      )

    case 'divider':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Altura da Linha</Label>
          <Input
            value={component.props.height || '1px'}
            onChange={(e) => updateProp('height', e.target.value)}
            className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
            placeholder="1px"
          />
        </div>
      )

    case 'script':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Código JavaScript</Label>
          <Textarea
            value={component.props.code || ''}
            onChange={(e) => updateProp('code', e.target.value)}
            className="min-h-[120px] text-xs bg-zinc-900 border-zinc-700 text-white font-mono"
            placeholder="// JavaScript personalizado..."
          />
        </div>
      )

    case 'html':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Código HTML</Label>
          <Textarea
            value={component.props.content || ''}
            onChange={(e) => updateProp('content', e.target.value)}
            className="min-h-[120px] text-xs bg-zinc-900 border-zinc-700 text-white font-mono"
            placeholder="<div>HTML personalizado</div>"
          />
        </div>
      )

    default:
      return (
        <div className="text-xs text-zinc-500 text-center py-4">
          Nenhuma propriedade disponível
        </div>
      )
  }
}

const StylingPropertiesForm: React.FC<{
  component: QuizComponent
  onUpdate: (updates: Record<string, any>) => void
}> = ({ component, onUpdate }) => {
  const updateProp = (key: string, value: any) => {
    onUpdate({ props: { ...component.props, [key]: value } })
  }

  return (
    <div className="space-y-4">
      <ColorPicker
        label="Cor do Texto"
        value={component.props.color || '#ffffff'}
        onChange={(value) => updateProp('color', value)}
      />

      <ColorPicker
        label="Cor de Fundo"
        value={component.props.backgroundColor || ''}
        onChange={(value) => updateProp('backgroundColor', value)}
      />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Borda Arredondada</Label>
        <Input
          value={component.props.borderRadius || '0px'}
          onChange={(e) => updateProp('borderRadius', e.target.value)}
          className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
          placeholder="8px"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Padding</Label>
        <Input
          value={component.props.padding || '0px'}
          onChange={(e) => updateProp('padding', e.target.value)}
          className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white"
          placeholder="16px"
        />
      </div>
    </div>
  )
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  headerConfig,
  onUpdateComponent,
  onUpdateHeaderConfig
}) => {
  const updateComponent = (updates: Record<string, any>) => {
    if (selectedComponent) {
      onUpdateComponent(selectedComponent.id, updates)
    }
  }

  // Garantir que headerConfig existe
  const safeHeaderConfig = headerConfig || {
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    showLogo: true,
    showProgress: true,
    showBackButton: true
  }

  const ComponentIcon = selectedComponent ? getComponentIcon(selectedComponent.type) : Settings

  return (
    <div className="w-[380px] bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Propriedades</h3>
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
        <div className="p-4 space-y-4">
          {/* Card Header Config */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Header do Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                value={safeHeaderConfig.logoUrl}
                onChange={(value) => onUpdateHeaderConfig({ logoUrl: value })}
                label="Logo do Header"
              />
              
              <div className="grid grid-cols-1 gap-4">
                <EnhancedSwitch
                  label="Mostrar Logo"
                  description="Exibe o logo no header do quiz"
                  checked={safeHeaderConfig.showLogo}
                  onChange={(checked) => onUpdateHeaderConfig({ showLogo: checked })}
                />
                <EnhancedSwitch
                  label="Barra de Progresso"
                  description="Mostra o progresso do quiz no header"
                  checked={safeHeaderConfig.showProgress}
                  onChange={(checked) => onUpdateHeaderConfig({ showProgress: checked })}
                />
                <EnhancedSwitch
                  label="Botão Voltar"
                  description="Permite voltar para a questão anterior"
                  checked={safeHeaderConfig.showBackButton}
                  onChange={(checked) => onUpdateHeaderConfig({ showBackButton: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card Component Properties */}
          {selectedComponent && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <ComponentIcon className="w-4 h-4" />
                  {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComponentPropertiesForm 
                  component={selectedComponent}
                  onUpdate={updateComponent}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Card Styling */}
          {selectedComponent && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Estilo & Aparência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StylingPropertiesForm 
                  component={selectedComponent}
                  onUpdate={updateComponent}
                />
              </CardContent>
            </Card>
          )}

          {!selectedComponent && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6">
                <div className="text-center text-zinc-500 text-sm">
                  Selecione um componente para editar suas propriedades
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}