import React from "react";
import { Save, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  isDirty: boolean;
  isSaving: boolean;
  saveIndicator: string;
  className?: string;
}

export function AutoSaveIndicator({
  lastSaved,
  isDirty,
  isSaving,
  saveIndicator,
  className,
}: AutoSaveIndicatorProps) {
  const getIcon = () => {
    if (isSaving) {
      return <Clock className="h-3 w-3 animate-spin" />;
    }
    if (isDirty) {
      return <AlertCircle className="h-3 w-3" />;
    }
    if (lastSaved) {
      return <CheckCircle className="h-3 w-3" />;
    }
    return <Save className="h-3 w-3" />;
  };

  const getColor = () => {
    if (isSaving) return "text-blue-600";
    if (isDirty) return "text-yellow-600";
    if (lastSaved) return "text-green-600";
    return "text-gray-600";
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    return ` - ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div
      className={cn("flex items-center gap-2 text-xs", getColor(), className)}
    >
      {getIcon()}
      <span>
        {saveIndicator}
        {formatLastSaved()}
      </span>
    </div>
  );
}

export default AutoSaveIndicator;
