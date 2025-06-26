import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ComponentsSidebar } from "./sidebar/ComponentsSidebar";
import { PreviewPanel } from "./preview/PreviewPanel";
import PropertiesPanel from "./properties/PropertiesPanel";
import { EditorToolbar } from "./toolbar/EditorToolbar";
import { Block } from "@/types/editor";
import { useIsMobile } from "@/hooks/use-mobile";
import useAutoSave from "@/hooks/useAutoSave";
import { Eye, EyeOff, Smartphone, Tablet, Monitor, Save } from "lucide-react";

interface EnhancedEditorLayoutProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onBlockSelect: (id: string | null) => void;
  onBlockAdd: (type: string) => void;
  onBlockUpdate: (id: string, content: any) => void;
  onBlockDelete: (id: string) => void;
  onBlocksReorder: (blocks: Block[]) => void;
  onSave?: () => void;
  primaryStyle?: any;
}

export function EnhancedEditorLayout({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockAdd,
  onBlockUpdate,
  onBlockDelete,
  onBlocksReorder,
  onSave,
  primaryStyle,
}: EnhancedEditorLayoutProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Auto-save functionality
  const autoSave = useAutoSave({
    blocks,
    onSave,
    autoSaveInterval: 3000, // 3 segundos
    storageKey: "enhanced_editor_blocks",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        onBlocksReorder(newBlocks);
      }
    },
    [blocks, onBlocksReorder]
  );

  const selectedBlock = selectedBlockId
    ? blocks.find((b) => b.id === selectedBlockId) || null
    : null;

  return (
    <div className="h-screen flex flex-col bg-[#FAF9F7]">
      {/* Toolbar */}
      <EditorToolbar
        isPreviewing={isPreviewing}
        onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
        previewDevice={previewDevice}
        onDeviceChange={setPreviewDevice}
        onSave={autoSave.saveNow}
        autoSaveStatus={{
          lastSaved: autoSave.lastSaved,
          isDirty: autoSave.isDirty,
          isSaving: autoSave.isSaving,
          saveIndicator: autoSave.saveIndicator,
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Components */}
        {!isPreviewing && (
          <div
            className={`bg-white border-r border-[#E5E5E5] transition-all duration-300 ${
              sidebarOpen ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            <ComponentsSidebar onAddBlock={onBlockAdd} />
          </div>
        )}

        {/* Main Content - Preview */}
        <div className="flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <PreviewPanel
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                isPreviewing={isPreviewing}
                previewDevice={previewDevice}
                onBlockSelect={onBlockSelect}
                onBlockDelete={onBlockDelete}
                primaryStyle={primaryStyle}
              />
            </SortableContext>
          </DndContext>
        </div>

        {/* Properties Panel */}
        {!isPreviewing && selectedBlock && (
          <div className="w-80 bg-white border-l border-[#E5E5E5] overflow-y-auto">
            <PropertiesPanel
              selectedBlock={selectedBlock}
              onUpdateBlock={onBlockUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
