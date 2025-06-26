import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Save, Monitor, Tablet, Smartphone } from "lucide-react";
import { AutoSaveIndicator } from "../components/AutoSaveIndicator";

interface EditorToolbarProps {
  isPreviewing: boolean;
  onPreviewToggle: () => void;
  previewDevice: "mobile" | "tablet" | "desktop";
  onDeviceChange: (device: "mobile" | "tablet" | "desktop") => void;
  onSave?: () => void;
  autoSaveStatus?: {
    lastSaved: Date | null;
    isDirty: boolean;
    isSaving: boolean;
    saveIndicator: string;
  };
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPreviewing,
  onPreviewToggle,
  previewDevice,
  onDeviceChange,
  onSave,
  autoSaveStatus,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewing ? "default" : "outline"}
            size="sm"
            onClick={onPreviewToggle}
          >
            {isPreviewing ? (
              <EyeOff className="w-4 h-4 mr-1" />
            ) : (
              <Eye className="w-4 h-4 mr-1" />
            )}
            {isPreviewing ? "Editar" : "Preview"}
          </Button>

          {autoSaveStatus && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <AutoSaveIndicator
                lastSaved={autoSaveStatus.lastSaved}
                isDirty={autoSaveStatus.isDirty}
                isSaving={autoSaveStatus.isSaving}
                saveIndicator={autoSaveStatus.saveIndicator}
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <Button
              variant={previewDevice === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceChange("mobile")}
              className="h-8 w-8 p-0"
            >
              <Smartphone className="w-4 h-4" />
            </Button>

            <Button
              variant={previewDevice === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceChange("tablet")}
              className="h-8 w-8 p-0"
            >
              <Tablet className="w-4 h-4" />
            </Button>

            <Button
              variant={previewDevice === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => onDeviceChange("desktop")}
              className="h-8 w-8 p-0"
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>

          {onSave && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button onClick={onSave} size="sm">
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
