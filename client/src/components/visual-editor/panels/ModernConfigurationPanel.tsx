import { Sliders } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Type,
  Settings,
  Image,
  Upload,
  Link,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Sliders,
  Maximize,
  Minimize,
  Home,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  useQuizTheme,
  useQuizBehavior,
  useQuizLayout,
} from "@/hooks/useQuizConfig";

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

interface ModernConfigurationPanelProps {
  stageName: string;
  stageType: string;
  questionData?: QuestionData;
  currentStage?: {
    id: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    type: string;
  };
  onUpdate?: (data: unknown) => void;
  onStageUpdate?: (stageId: string, stageData: Record<string, unknown>) => void;
}

export const ModernConfigurationPanel: React.FC<
  ModernConfigurationPanelProps
> = ({
  stageName,
  stageType,
  questionData,
  currentStage,
  onUpdate,
  onStageUpdate,
}) => {
  const [previewMode, setPreviewMode] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [expandedOptions, setExpandedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [fontSize, setFontSize] = useState("medium");
  const [imageSize, setImageSize] = useState("medium");
  const [titleFontSize, setTitleFontSize] = useState("large");
  const [editingOption, setEditingOption] = useState<string | null>(null);

  const togglePreview = (optionId: string) => {
    setPreviewMode((prev) => ({ ...prev, [optionId]: !prev[optionId] }));
  };

  const toggleExpanded = (optionId: string) => {
    setExpandedOptions((prev) => ({ ...prev, [optionId]: !prev[optionId] }));
  };
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
        <div className="p-4 space-y-4">
          {/* Modern Header */}
          <div className="pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={`${typeInfo.color} text-white text-xs px-3 py-1`}
              >
                {typeInfo.label}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{stageName}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {stageType === "intro"
                ? "Configure a introdução do quiz"
                : "Configure as opções da questão"}
            </p>
          </div>

          {/* Intro Configuration */}
          {stageType === "intro" && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Configuração da Introdução
                    </h3>
                    <p className="text-xs text-gray-500">
                      Personalize título, subtítulo e botão
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Título Principal
                  </Label>
                  <Input
                    placeholder="Ex: Descubra Seu Estilo Único"
                    className="text-sm"
                    value={currentStage?.title || ""}
                    onChange={(e) => {
                      onStageUpdate?.(currentStage?.id, {
                        ...currentStage,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Subtítulo
                  </Label>
                  <textarea
                    placeholder="Ex: Um quiz personalizado para descobrir qual estilo combina mais com você"
                    className="w-full text-sm p-2 border border-gray-200 rounded-md resize-none"
                    rows={3}
                    value={currentStage?.subtitle || ""}
                    onChange={(e) => {
                      onStageUpdate?.(currentStage?.id, {
                        ...currentStage,
                        subtitle: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Texto do Botão
                  </Label>
                  <Input
                    placeholder="Ex: Começar Quiz"
                    className="text-sm"
                    value={currentStage?.buttonText || ""}
                    onChange={(e) => {
                      onStageUpdate?.(currentStage?.id, {
                        ...currentStage,
                        buttonText: e.target.value,
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Options Management - MODERN & INTUITIVE */}
          {(stageType.startsWith("question-") ||
            stageType.startsWith("strategic-")) && (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Opções de Resposta
                        </h3>
                        <p className="text-xs text-gray-500">
                          {questionData?.options?.length || 0} opções
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const newOption = {
                          id: `option-${Date.now()}`,
                          text: "Nova opção",
                          styleCategory: "Padrão",
                          points: 10,
                          imageUrl: "",
                        };
                        const updatedOptions = [
                          ...(questionData?.options || []),
                          newOption,
                        ];
                        onUpdate?.({
                          ...questionData,
                          options: updatedOptions,
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-80 overflow-y-auto pt-0">
                  {questionData?.options?.map((option, index) => (
                    <div
                      key={option.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                      style={{ backgroundColor: "#FEFEFE" }}
                    >
                      {/* Option Header */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          {option.imageUrl && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
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
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-sm font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-800">
                                Opção {index + 1}
                              </span>
                              <p className="text-xs text-gray-500">
                                {option.text.length > 0
                                  ? `${option.text.length} caracteres`
                                  : "Sem texto"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExpanded(option.id)}
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 h-8 w-8 p-0 rounded-lg"
                            title={
                              expandedOptions[option.id]
                                ? "Minimizar"
                                : "Expandir"
                            }
                          >
                            {expandedOptions[option.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedOptions =
                                questionData?.options?.filter(
                                  (opt) => opt.id !== option.id
                                ) || [];
                              onUpdate?.({
                                ...questionData,
                                options: updatedOptions,
                              });
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"
                            title="Remover opção"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Option Content - Expandable */}
                      <div
                        className={`transition-all duration-300 ${
                          expandedOptions[option.id] !== false
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <div className="p-4 space-y-4">
                          {/* Rich Text Editor */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                Texto da Opção
                              </Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                  title="Negrito"
                                >
                                  <Bold className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                  title="Itálico"
                                >
                                  <Italic className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              value={option.text}
                              onChange={(e) => {
                                const updatedOptions =
                                  questionData?.options?.map((opt) =>
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
                              className="min-h-[80px] bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none text-sm leading-relaxed"
                              style={{ focus: { backgroundColor: "#FEFEFE" } }}
                              maxLength={300}
                            />
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Use texto claro e conciso</span>
                              <span>{option.text.length}/300</span>
                            </div>
                          </div>

                          {/* Advanced Image Editor */}
                          <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              Imagem da Opção
                            </Label>

                            <div className="space-y-3">
                              {/* Image URL Input */}
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    value={option.imageUrl || ""}
                                    onChange={(e) => {
                                      const updatedOptions =
                                        questionData?.options?.map((opt) =>
                                          opt.id === option.id
                                            ? {
                                                ...opt,
                                                imageUrl: e.target.value,
                                              }
                                            : opt
                                        ) || [];
                                      onUpdate?.({
                                        ...questionData,
                                        options: updatedOptions,
                                      });
                                    }}
                                    placeholder="Cole a URL da imagem ou use upload..."
                                    className="flex-1 bg-gray-50 border-gray-200 focus:border-blue-400 text-sm h-9"
                                    style={{
                                      focus: { backgroundColor: "#FEFEFE" },
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="px-3 h-9 border-gray-200 hover:border-blue-400"
                                    title="Upload de imagem"
                                  >
                                    <Upload className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Quick Image Gallery */}
                                <div className="flex gap-2 text-xs">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-gray-500 hover:text-blue-600"
                                    onClick={() => {
                                      // Placeholder URLs for demo
                                      const demoUrls = [
                                        "https://images.unsplash.com/photo-1441986300917-64674bd600d6?w=400",
                                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
                                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                                      ];
                                      const randomUrl =
                                        demoUrls[
                                          Math.floor(
                                            Math.random() * demoUrls.length
                                          )
                                        ];
                                      const updatedOptions =
                                        questionData?.options?.map((opt) =>
                                          opt.id === option.id
                                            ? { ...opt, imageUrl: randomUrl }
                                            : opt
                                        ) || [];
                                      onUpdate?.({
                                        ...questionData,
                                        options: updatedOptions,
                                      });
                                    }}
                                  >
                                    <Link className="w-3 h-3 mr-1" />
                                    Galeria
                                  </Button>
                                </div>
                              </div>

                              {/* Image Preview */}
                              {option.imageUrl && (
                                <div className="relative group">
                                  <img
                                    src={option.imageUrl}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const updatedOptions =
                                          questionData?.options?.map((opt) =>
                                            opt.id === option.id
                                              ? { ...opt, imageUrl: "" }
                                              : opt
                                          ) || [];
                                        onUpdate?.({
                                          ...questionData,
                                          options: updatedOptions,
                                        });
                                      }}
                                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remover
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Nenhuma opção criada
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Clique em "Adicionar" para criar a primeira opção
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Question Settings */}
              <Card className="border-0 shadow-sm bg-gray-50/50">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <Label className="text-sm font-medium text-gray-700">
                        Configurações da Questão
                      </Label>
                    </div>

                    <div
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                      style={{ backgroundColor: "#FEFEFE" }}
                    >
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Seleção múltipla
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Permite selecionar várias opções
                        </p>
                      </div>
                      <Switch
                        checked={questionData?.multiSelect || false}
                        onCheckedChange={(checked) =>
                          onUpdate?.({ ...questionData, multiSelect: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visual Appearance Settings - Controles Melhorados */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <Label className="text-sm font-semibold text-gray-800">
                      Aparência Visual
                    </Label>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Font Size Controls */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Tamanho da Fonte
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["small", "medium", "large"].map((size) => (
                        <Button
                          key={size}
                          variant={fontSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFontSize(size)}
                          className={`text-xs transition-all duration-200 ${
                            fontSize === size
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-105"
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {size === "small" && "Pequeno"}
                          {size === "medium" && "Médio"}
                          {size === "large" && "Grande"}
                        </Button>
                      ))}
                    </div>
                    {/* Font Preview */}
                    <div
                      className="p-3 rounded-lg border border-gray-200"
                      style={{ backgroundColor: "#FEFEFE" }}
                    >
                      <p
                        className={`text-gray-800 transition-all duration-300 ${
                          fontSize === "small"
                            ? "text-sm"
                            : fontSize === "medium"
                            ? "text-base"
                            : "text-lg"
                        }`}
                      >
                        Preview do texto da opção
                      </p>
                    </div>
                  </div>

                  {/* Image Size Controls */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Tamanho das Imagens
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["small", "medium", "large"].map((size) => (
                        <Button
                          key={size}
                          variant={imageSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setImageSize(size)}
                          className={`text-xs transition-all duration-200 ${
                            imageSize === size
                              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md scale-105"
                              : "hover:bg-purple-50 hover:border-purple-300"
                          }`}
                        >
                          {size === "small" && "Compacto"}
                          {size === "medium" && "Padrão"}
                          {size === "large" && "Grande"}
                        </Button>
                      ))}
                    </div>
                    {/* Image Size Preview */}
                    <div
                      className="p-3 rounded-lg border border-gray-200"
                      style={{ backgroundColor: "#FEFEFE" }}
                    >
                      <div
                        className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg transition-all duration-300 ${
                          imageSize === "small"
                            ? "h-16"
                            : imageSize === "medium"
                            ? "h-24"
                            : "h-32"
                        }`}
                        style={{ backgroundColor: "#FEFEFE" }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Preview do tamanho da imagem
                      </p>
                    </div>
                  </div>

                  {/* Title Font Size */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Bold className="w-4 h-4" />
                      Tamanho do Título
                    </Label>
                    <Select
                      value={titleFontSize}
                      onValueChange={setTitleFontSize}
                    >
                      <SelectTrigger
                        className="border-gray-200 focus:border-pink-300 focus:ring-pink-300"
                        style={{ backgroundColor: "#FEFEFE" }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                        <SelectItem value="xl">Extra Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Layout Options */}
                  <div className="space-y-3 pt-2 border-t border-white/50">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Maximize className="w-4 h-4" />
                      Layout das Opções
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs hover:bg-green-50 hover:border-green-300"
                      >
                        <Minimize className="w-3 h-3 mr-1" />
                        Compacto
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs hover:bg-green-50 hover:border-green-300"
                      >
                        <Maximize className="w-3 h-3 mr-1" />
                        Espaçado
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="pb-4"></div>
        </div>
      </ScrollArea>
    </div>
  );
};
