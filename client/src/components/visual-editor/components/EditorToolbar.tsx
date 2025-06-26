import React from "react";
import {
  Save,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Settings,
} from "lucide-react";

interface ToolbarProps {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onSettings: () => void;
}

const EditorToolbar: React.FC<ToolbarProps> = ({
  isDirty,
  isSaving,
  lastSaved,
  onSave,
  onPreview,
  onExport,
  onSettings,
}) => {
  const getSaveStatus = () => {
    if (isSaving) {
      return {
        icon: Clock,
        text: "Salvando...",
        className: "text-blue-600",
      };
    }
    if (isDirty) {
      return {
        icon: AlertCircle,
        text: "Alterações não salvas",
        className: "text-yellow-600",
      };
    }
    if (lastSaved) {
      return {
        icon: CheckCircle,
        text: `Salvo em ${lastSaved.toLocaleTimeString()}`,
        className: "text-green-600",
      };
    }
    return {
      icon: Save,
      text: "Pronto para salvar",
      className: "text-gray-600",
    };
  };

  const status = getSaveStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className="editor-toolbar"
      role="toolbar"
      aria-label="Ferramentas do editor"
    >
      <div className="toolbar-left">
        <div className={`save-status ${status.className}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm">{status.text}</span>
        </div>
      </div>

      <div className="toolbar-center">
        <h1 className="editor-title">Quiz Builder Pro</h1>
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          title="Salvar alterações"
          aria-label="Salvar alterações"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>

        <button
          className="toolbar-btn secondary"
          onClick={onPreview}
          title="Visualizar quiz"
          aria-label="Visualizar quiz"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          className="toolbar-btn secondary"
          onClick={onExport}
          title="Exportar quiz"
          aria-label="Exportar quiz"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>

        <button
          className="toolbar-btn secondary"
          onClick={onSettings}
          title="Configurações"
          aria-label="Configurações do editor"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
