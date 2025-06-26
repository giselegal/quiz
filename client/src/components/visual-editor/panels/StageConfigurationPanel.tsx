import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Equal,
  Pencil,
  Trash2,
  Image,
  Type,
  Palette,
  Settings,
  Upload,
} from "lucide-react";

interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory: string;
  points: number;
}

interface QuestionData {
  id: string;
  title: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

interface StageConfigurationPanelProps {
  stageName: string;
  stageType: string;
  questionData?: QuestionData;
  onUpdate?: (data: unknown) => void;
}

export const StageConfigurationPanel: React.FC<
  StageConfigurationPanelProps
> = ({ stageName, stageType, questionData, onUpdate }) => {
  // Estados para configurações
  const [layout, setLayout] = useState("2 Colunas");
  const [direction, setDirection] = useState("Vertical");
  const [disposition, setDisposition] = useState("Imagem | Texto");
  const [multipleChoice, setMultipleChoice] = useState(
    questionData?.multiSelect || false
  );
  const [required, setRequired] = useState(true);
  const [autoProceed, setAutoProceed] = useState(false);
  const [borders, setBorders] = useState("Pequena");
  const [shadows, setShadows] = useState("Média");
  const [spacing, setSpacing] = useState("Pequeno");
  const [detail, setDetail] = useState("Nenhum");
  const [style, setStyle] = useState("Simples");
  const [maxSize, setMaxSize] = useState([100]);
  const [componentColor, setComponentColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [componentId, setComponentId] = useState("OtYstT");

  const getStageTypeInfo = (type: string) => {
    if (type.startsWith("question-"))
      return { label: "Questão Regular", color: "bg-blue-500" };
    if (type.startsWith("strategic-"))
      return { label: "Questão Estratégica", color: "bg-purple-500" };
    if (type === "intro") return { label: "Introdução", color: "bg-green-500" };
    if (type === "transition")
      return { label: "Transição", color: "bg-yellow-500" };
    if (type === "result")
      return { label: "Resultado", color: "bg-orange-500" };
    if (type === "offer") return { label: "Oferta", color: "bg-red-500" };
    return { label: "Desconhecido", color: "bg-gray-500" };
  };

  const typeInfo = getStageTypeInfo(stageType);

  return (
    <div className="overflow-hidden canvas-editor hidden md:block w-full max-w-[24rem] relative overflow-auto-container sm-scrollbar border-l z-[50]">
      <ScrollArea className="h-full w-full">
        <div className="grid gap-4 px-4 pb-4 pt-2 my-4">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Configurações</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${typeInfo.color} text-white`}>
                {typeInfo.label}
              </Badge>
              <span className="text-sm text-gray-600">{stageName}</span>
            </div>
          </div>

          {/* Layout Configuration */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Layout</p>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              {/* Layout Configuration for Questions */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Coluna">1 Coluna</SelectItem>
                      <SelectItem value="2 Colunas">2 Colunas</SelectItem>
                      <SelectItem value="3 Colunas">3 Colunas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Layout das Opções</Label>
                </div>

                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={disposition} onValueChange={setDisposition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Imagem | Texto">
                        Imagem + Texto
                      </SelectItem>
                      <SelectItem value="Texto | Imagem">
                        Texto + Imagem
                      </SelectItem>
                      <SelectItem value="Só Texto">Apenas Texto</SelectItem>
                      <SelectItem value="Só Imagem">Apenas Imagem</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Disposição</Label>
                </div>

                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={spacing} onValueChange={setSpacing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compacto">Compacto</SelectItem>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Espaçamento</Label>
                </div>

                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={borders} onValueChange={setBorders}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nenhuma">Sem Borda</SelectItem>
                      <SelectItem value="Pequena">Borda Fina</SelectItem>
                      <SelectItem value="Média">Borda Média</SelectItem>
                      <SelectItem value="Grande">Borda Grossa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Bordas</Label>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho das Imagens</Label>
                  <Slider
                    value={maxSize}
                    onValueChange={setMaxSize}
                    max={300}
                    min={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100px</span>
                    <span>{maxSize[0]}px</span>
                    <span>300px</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options Configuration */}
          {questionData && (
            <Card>
              <CardHeader>
                <p className="text-sm text-muted-foreground">Opções</p>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col">
                <div className="w-full h-auto flex-col items-start justify-start">
                  <div className="grid grid-cols-1 w-full h-auto">
                    {questionData.options?.map((option, index) => (
                      <div
                        key={option.id}
                        className="w-full h-auto py-2 border-b"
                      >
                        <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
                          <div className="w-full h-auto flex flex-row items-center justify-start gap-2">
                            <span>
                              <Equal className="w-4 h-4 text-zinc-400" />
                            </span>

                            {option.imageUrl && (
                              <div className="w-12 h-12 bg-zinc-200 rounded-md flex items-center justify-center">
                                <img
                                  height="48"
                                  width="48"
                                  className="min-w-12 rounded-md"
                                  src={option.imageUrl}
                                  alt="Ícone"
                                />
                              </div>
                            )}

                            <div className="w-full max-w-48 text-sm">
                              {String.fromCharCode(65 + index)}) {option.text}
                            </div>

                            <span className="cursor-pointer hover:opacity-75 transition-all ease-in-out">
                              <Pencil className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="ghost" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Opção
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validations */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Validações</p>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiple"
                  checked={multipleChoice}
                  onCheckedChange={setMultipleChoice}
                />
                <div className="flex flex-col items-start justify-start gap-1">
                  <Label htmlFor="multiple">Múltipla Escolha</Label>
                  <p className="text-xs">
                    O usuário poderá selecionar múltiplas opções, entretanto, o
                    avanço para a próxima etapa deve ser definido através de um
                    componente de Botão.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={required}
                  onCheckedChange={setRequired}
                />
                <div className="flex flex-col items-start justify-start gap-1">
                  <Label htmlFor="required">Obrigatório</Label>
                  <p className="text-xs">
                    O usuário é obrigado a selecionar alguma opção para poder
                    avançar.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoProceed"
                  checked={autoProceed}
                  onCheckedChange={setAutoProceed}
                />
                <div className="flex flex-col items-start justify-start gap-1">
                  <Label htmlFor="autoProceed">Auto-avançar</Label>
                  <p className="text-xs">
                    O funil avançará para a etapa seguinte definida na opção
                    selecionada. Caso contrário, o usuário deverá clicar em um
                    componente de Botão para poder prosseguir. A etapa
                    selecionada na opção terá mais peso do que a do Botão.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Styling */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Estilização</p>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              <div className="grid grid-cols-3 grid-flow-col w-full h-auto gap-2">
                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={borders} onValueChange={setBorders}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                      <SelectItem value="Pequena">Pequena</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Bordas</Label>
                </div>

                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={shadows} onValueChange={setShadows}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                      <SelectItem value="Pequena">Pequena</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Sombras</Label>
                </div>

                <div className="flex flex-col-reverse items-start gap-2">
                  <Select value={spacing} onValueChange={setSpacing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Espaçamento</Label>
                </div>
              </div>

              <div className="flex flex-col-reverse items-start gap-2">
                <Select value={detail} onValueChange={setDetail}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nenhum">Nenhum</SelectItem>
                    <SelectItem value="Sutil">Sutil</SelectItem>
                    <SelectItem value="Destacado">Destacado</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Detalhe</Label>
              </div>

              <div className="flex flex-col-reverse items-start gap-2">
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simples">Simples</SelectItem>
                    <SelectItem value="Moderno">Moderno</SelectItem>
                    <SelectItem value="Elegante">Elegante</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Estilo</Label>
              </div>
            </CardContent>
          </Card>

          {/* Customization */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Personalização</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 w-full max-w-sm items-center gap-1.5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="componentColor">Cor</Label>
                  <div className="relative">
                    <Input
                      id="componentColor"
                      type="color"
                      value={componentColor}
                      onChange={(e) => setComponentColor(e.target.value)}
                      className="h-10 border-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="componentTextColor">Texto</Label>
                  <div className="relative">
                    <Input
                      id="componentTextColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 border-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="componentBorderColor">Borda</Label>
                  <div className="relative">
                    <Input
                      id="componentBorderColor"
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="h-10 border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Avançado</p>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="componentId">ID do Componente</Label>
                <Input
                  id="componentId"
                  value={componentId}
                  onChange={(e) => setComponentId(e.target.value)}
                  placeholder="Digite aqui..."
                />
                <Button>Confirmar ID</Button>
              </div>
            </CardContent>
          </Card>

          {/* General */}
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Geral</p>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="maxSize">Tamanho Máximo</Label>
                <Slider
                  value={maxSize}
                  onValueChange={setMaxSize}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col-reverse items-start gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma Opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Alinhamento</Label>
              </div>
            </CardContent>
          </Card>

          {/* Question Configuration for Quiz/Strategic stages */}
          {(stageType.startsWith("question-") ||
            stageType.startsWith("strategic-")) &&
            questionData && (
              <>
                {/* Question Title Configuration */}
                <Card>
                  <CardHeader>
                    <p className="text-sm text-muted-foreground">
                      Configuração da Questão
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-title">Título da Questão</Label>
                      <Input
                        id="question-title"
                        value={questionData.title || ""}
                        onChange={(e) =>
                          onUpdate?.({ ...questionData, title: e.target.value })
                        }
                        placeholder="Digite o título da questão..."
                        className="w-full"
                      />
                    </div>

                    {/* Question Title Styling */}
                    <div className="border-t pt-3 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Type className="w-4 h-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-700">
                          Estilo do Título
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            Tamanho
                          </Label>
                          <Select defaultValue="large">
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">
                                Pequeno (16px)
                              </SelectItem>
                              <SelectItem value="medium">
                                Médio (20px)
                              </SelectItem>
                              <SelectItem value="large">
                                Grande (24px)
                              </SelectItem>
                              <SelectItem value="xlarge">
                                Extra Grande (28px)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            Alinhamento
                          </Label>
                          <Select defaultValue="center">
                            <SelectTrigger className="h-9">
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

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">
                          Cor do Título
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            defaultValue="#111827"
                            className="w-12 h-9 p-1 border rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            defaultValue="#111827"
                            placeholder="#111827"
                            className="flex-1 h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <Label htmlFor="multi-select" className="font-medium">
                          Seleção múltipla
                        </Label>
                        <p className="text-xs text-gray-500">
                          Permite selecionar várias opções
                        </p>
                      </div>
                      <Switch
                        id="multi-select"
                        checked={questionData.multiSelect || false}
                        onCheckedChange={(checked) =>
                          onUpdate?.({ ...questionData, multiSelect: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Layout and Appearance Configuration */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-muted-foreground">
                        Layout e Aparência
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-1 block">
                          Layout das Opções
                        </Label>
                        <Select defaultValue="grid">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">
                              Grade (2 colunas)
                            </SelectItem>
                            <SelectItem value="list">
                              Lista (1 coluna)
                            </SelectItem>
                            <SelectItem value="auto">
                              Auto (baseado no conteúdo)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-1 block">
                          Espaçamento
                        </Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compacto</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="spacious">Espaçoso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">
                          Bordas
                        </Label>
                        <Select defaultValue="small">
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma</SelectItem>
                            <SelectItem value="small">Pequena</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">
                          Sombras
                        </Label>
                        <Select defaultValue="light">
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma</SelectItem>
                            <SelectItem value="light">Leve</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="strong">Forte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">
                          Cantos
                        </Label>
                        <Select defaultValue="rounded">
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sharp">Retos</SelectItem>
                            <SelectItem value="rounded">
                              Arredondados
                            </SelectItem>
                            <SelectItem value="pill">Pill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Cor de Destaque
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          defaultValue="#B89B7A"
                          className="w-12 h-9 p-1 border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          defaultValue="#B89B7A"
                          placeholder="#B89B7A"
                          className="flex-1 h-9 text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Cor usada para seleção e elementos ativos
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Image Configuration */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-muted-foreground">
                        Configuração de Imagens
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-1 block">
                          Proporção
                        </Label>
                        <Select defaultValue="auto">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="1:1">Quadrada (1:1)</SelectItem>
                            <SelectItem value="4:3">4:3</SelectItem>
                            <SelectItem value="16:9">16:9</SelectItem>
                            <SelectItem value="3:2">3:2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-1 block">
                          Ajuste
                        </Label>
                        <Select defaultValue="cover">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">
                              Preencher (cortar)
                            </SelectItem>
                            <SelectItem value="contain">
                              Ajustar (sem cortar)
                            </SelectItem>
                            <SelectItem value="fill">Esticar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Altura das Imagens
                      </Label>
                      <div className="px-3">
                        <Slider
                          defaultValue={[180]}
                          max={300}
                          min={100}
                          step={10}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>100px</span>
                        <span>180px</span>
                        <span>300px</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="show-overlay" defaultChecked={false} />
                        <Label htmlFor="show-overlay" className="text-sm">
                          Overlay escuro
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="lazy-load" defaultChecked={true} />
                        <Label htmlFor="lazy-load" className="text-sm">
                          Carregamento lazy
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Options Management - Improved */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Gerenciar Opções
                        </p>
                        <p className="text-xs text-gray-400">
                          {questionData.options?.length || 0} opções
                          configuradas
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newOption = {
                            id: `option-${Date.now()}`,
                            text: "Nova opção",
                            styleCategory: "Padrão", // Campo interno simplificado
                            points: 10, // Campo interno simplificado
                            imageUrl: "",
                          };
                          const updatedOptions = [
                            ...(questionData.options || []),
                            newOption,
                          ];
                          onUpdate?.({
                            ...questionData,
                            options: updatedOptions,
                          });
                        }}
                        className="shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {questionData.options?.map((option, index) => (
                      <div
                        key={option.id}
                        className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {option.imageUrl && (
                              <div className="w-8 h-8 rounded overflow-hidden">
                                <img
                                  src={option.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              Opção {index + 1}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedOptions =
                                questionData.options?.filter(
                                  (opt) => opt.id !== option.id
                                ) || [];
                              onUpdate?.({
                                ...questionData,
                                options: updatedOptions,
                              });
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            title="Remover opção"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium mb-1 block">
                              Texto da Opção
                            </Label>
                            <Input
                              value={option.text}
                              onChange={(e) => {
                                const updatedOptions =
                                  questionData.options?.map((opt) =>
                                    opt.id === option.id
                                      ? { ...opt, text: e.target.value }
                                      : opt
                                  ) || [];
                                onUpdate?.({
                                  ...questionData,
                                  options: updatedOptions,
                                });
                              }}
                              placeholder="Digite o texto da opção..."
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-1 block">
                              URL da Imagem (opcional)
                            </Label>
                            <div className="space-y-2">
                              <Input
                                value={option.imageUrl || ""}
                                onChange={(e) => {
                                  const updatedOptions =
                                    questionData.options?.map((opt) =>
                                      opt.id === option.id
                                        ? { ...opt, imageUrl: e.target.value }
                                        : opt
                                    ) || [];
                                  onUpdate?.({
                                    ...questionData,
                                    options: updatedOptions,
                                  });
                                }}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="w-full text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Upload className="w-3 h-3 mr-1" />
                                  Upload
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Image className="w-3 h-3 mr-1" />
                                  Galeria
                                </Button>
                              </div>
                            </div>
                            {option.imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={option.imageUrl}
                                  alt="Preview"
                                  className="w-full h-20 object-cover rounded border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Advanced Style Configuration */}
                          <div className="border-t pt-3 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings className="w-4 h-4 text-gray-500" />
                              <Label className="text-sm font-medium text-gray-700">
                                Configurações Avançadas
                              </Label>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Tamanho do Texto
                                </Label>
                                <Select defaultValue="medium">
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">
                                      Pequeno
                                    </SelectItem>
                                    <SelectItem value="medium">
                                      Médio
                                    </SelectItem>
                                    <SelectItem value="large">
                                      Grande
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Peso da Fonte
                                </Label>
                                <Select defaultValue="normal">
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="light">Leve</SelectItem>
                                    <SelectItem value="normal">
                                      Normal
                                    </SelectItem>
                                    <SelectItem value="medium">
                                      Médio
                                    </SelectItem>
                                    <SelectItem value="semibold">
                                      Semi-negrito
                                    </SelectItem>
                                    <SelectItem value="bold">
                                      Negrito
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Alinhamento
                                </Label>
                                <Select defaultValue="left">
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left">
                                      Esquerda
                                    </SelectItem>
                                    <SelectItem value="center">
                                      Centro
                                    </SelectItem>
                                    <SelectItem value="right">
                                      Direita
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Cor do Texto
                                </Label>
                                <div className="flex gap-1">
                                  <Input
                                    type="color"
                                    defaultValue="#374151"
                                    className="w-8 h-8 p-0 border rounded cursor-pointer"
                                  />
                                  <Input
                                    type="text"
                                    defaultValue="#374151"
                                    placeholder="#000000"
                                    className="flex-1 h-8 text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Cor de Fundo
                                </Label>
                                <div className="flex gap-1">
                                  <Input
                                    type="color"
                                    defaultValue="#ffffff"
                                    className="w-8 h-8 p-0 border rounded cursor-pointer"
                                  />
                                  <Input
                                    type="text"
                                    defaultValue="#ffffff"
                                    placeholder="#ffffff"
                                    className="flex-1 h-8 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-sm">Nenhuma opção configurada</p>
                        <p className="text-xs">
                          Clique em "Adicionar" para criar opções
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

          <div className="py-4"></div>
        </div>
      </ScrollArea>
    </div>
  );
};
