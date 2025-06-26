import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/hooks/useEditorNew";
import { getCurrentStep, getSelectedElement } from "@/utils/editorUtils";

export const PropertiesSidebar: React.FC = () => {
  const { state, dispatch } = useEditor();
  const currentStep = getCurrentStep(state);
  const selectedElement = getSelectedElement(state);

  const handleStepSettingChange = (key: string, value: boolean) => {
    if (!currentStep) return;

    dispatch({
      type: "UPDATE_STEP",
      payload: {
        id: currentStep.id,
        updates: {
          settings: {
            ...currentStep.settings,
            [key]: value,
          },
        },
      },
    });
  };

  const handleStepNameChange = (name: string) => {
    if (!currentStep) return;

    dispatch({
      type: "UPDATE_STEP",
      payload: {
        id: currentStep.id,
        updates: { name },
      },
    });
  };

  const handleElementContentChange = (key: string, value: unknown) => {
    if (!selectedElement || !currentStep) return;

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        stepId: currentStep.id,
        elementId: selectedElement.id,
        updates: {
          content: {
            ...selectedElement.content,
            [key]: value,
          },
        },
      },
    });
  };

  const handleElementStyleChange = (key: string, value: unknown) => {
    if (!selectedElement || !currentStep) return;

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        stepId: currentStep.id,
        elementId: selectedElement.id,
        updates: {
          styles: {
            ...selectedElement.styles,
            [key]: value,
          },
        },
      },
    });
  };

  const renderElementProperties = () => {
    if (!selectedElement) return null;

    const content = selectedElement.content as Record<string, unknown>;

    switch (selectedElement.type) {
      case "heading": {
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Propriedades do Título
              </p>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="heading-text">Texto</Label>
                <Input
                  id="heading-text"
                  value={(content.text as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("text", e.target.value)
                  }
                  placeholder="Digite o título..."
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="heading-level">Nível (H1-H6)</Label>
                <Input
                  id="heading-level"
                  type="number"
                  min="1"
                  max="6"
                  value={(content.level as number) || 1}
                  onChange={(e) =>
                    handleElementContentChange(
                      "level",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        );
      }

      case "text": {
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Propriedades do Texto
              </p>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="text-content">Texto</Label>
                <Input
                  id="text-content"
                  value={(content.text as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("text", e.target.value)
                  }
                  placeholder="Digite o texto..."
                />
              </div>
            </CardContent>
          </Card>
        );
      }

      case "button": {
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Propriedades do Botão
              </p>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="button-text">Texto do Botão</Label>
                <Input
                  id="button-text"
                  value={(content.text as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("text", e.target.value)
                  }
                  placeholder="Digite o texto do botão..."
                />
              </div>
            </CardContent>
          </Card>
        );
      }

      case "input": {
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Propriedades do Campo
              </p>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-label">Rótulo</Label>
                <Input
                  id="input-label"
                  value={(content.label as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("label", e.target.value)
                  }
                  placeholder="Rótulo do campo..."
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="input-placeholder">Placeholder</Label>
                <Input
                  id="input-placeholder"
                  value={(content.placeholder as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("placeholder", e.target.value)
                  }
                  placeholder="Texto de placeholder..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="input-required"
                  checked={(content.required as boolean) || false}
                  onCheckedChange={(checked) =>
                    handleElementContentChange("required", checked)
                  }
                />
                <Label htmlFor="input-required">Campo obrigatório</Label>
              </div>
            </CardContent>
          </Card>
        );
      }

      case "image": {
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Propriedades da Imagem
              </p>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="image-src">URL da Imagem</Label>
                <Input
                  id="image-src"
                  value={(content.src as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("src", e.target.value)
                  }
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="image-alt">Texto Alternativo</Label>
                <Input
                  id="image-alt"
                  value={(content.alt as string) || ""}
                  onChange={(e) =>
                    handleElementContentChange("alt", e.target.value)
                  }
                  placeholder="Descrição da imagem..."
                />
              </div>
            </CardContent>
          </Card>
        );
      }

      default:
        return (
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">
                Elemento selecionado
              </p>
            </CardHeader>
            <CardContent>
              <p>Tipo: {selectedElement.type}</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!currentStep) {
    return <div>Nenhuma etapa selecionada</div>;
  }

  return (
    <ScrollArea className="overflow-hidden canvas-editor hidden md:block w-full max-w-[24rem] relative overflow-auto-container sm-scrollbar border-l z-[50]">
      <div className="grid gap-4 px-4 pb-4 pt-2 my-4">
        {/* Step Properties */}
        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">Título da Etapa</p>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="stepName">Nome da Etapa</Label>
              <Input
                type="text"
                id="stepName"
                placeholder="Digite aqui..."
                value={currentStep.name}
                onChange={(e) => handleStepNameChange(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Header Settings */}
        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">Header</p>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-logo"
                checked={currentStep.settings.showLogo}
                onCheckedChange={(checked) =>
                  handleStepSettingChange("showLogo", checked)
                }
              />
              <Label htmlFor="show-logo">Mostrar Logo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-progress"
                checked={currentStep.settings.showProgress}
                onCheckedChange={(checked) =>
                  handleStepSettingChange("showProgress", checked)
                }
              />
              <Label htmlFor="show-progress">Mostrar Progresso</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-return"
                checked={currentStep.settings.allowReturn}
                onCheckedChange={(checked) =>
                  handleStepSettingChange("allowReturn", checked)
                }
              />
              <Label htmlFor="allow-return">Permitir Voltar</Label>
            </div>
          </CardContent>
        </Card>

        {/* Element Properties */}
        {renderElementProperties()}

        <div className="py-4"></div>
      </div>
    </ScrollArea>
  );
};
