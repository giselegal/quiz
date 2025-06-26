import React, { useState } from "react";
import { InLeadSidebar } from "./InLeadSidebar";
import InLeadCanvas from "./InLeadCanvas";
import InLeadPreview from "./InLeadPreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface EditorElement {
  id: string;
  type:
    | "heading"
    | "text"
    | "image"
    | "button"
    | "form"
    | "video"
    | "quiz-question";
  content: {
    text?: string;
    level?: string;
    src?: string;
    alt?: string;
    url?: string;
    fields?: Array<{
      label: string;
      type: string;
      required: boolean;
    }>;
    question?: string;
    options?: string[];
    poster?: string;
  };
  style: {
    color?: string;
    fontSize?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
  };
}

export interface EditorPage {
  id: string;
  name: string;
  elements: EditorElement[];
}

const InLeadEditor: React.FC = () => {
  const [pages, setPages] = useState<EditorPage[]>([
    {
      id: "page-1",
      name: "Página Principal",
      elements: [],
    },
  ]);

  const [currentPageId, setCurrentPageId] = useState("page-1");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  const currentPage = pages.find((page) => page.id === currentPageId);
  const selectedElement = currentPage?.elements.find(
    (el) => el.id === selectedElementId
  );

  const addElement = (type: EditorElement["type"]) => {
    const newElement: EditorElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
    };

    setPages((prev) =>
      prev.map((page) =>
        page.id === currentPageId
          ? { ...page, elements: [...page.elements, newElement] }
          : page
      )
    );
  };

  const updateElement = (
    elementId: string,
    updates: Partial<EditorElement>
  ) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              elements: page.elements.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el
              ),
            }
          : page
      )
    );
  };

  const deleteElement = (elementId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === currentPageId
          ? {
              ...page,
              elements: page.elements.filter((el) => el.id !== elementId),
            }
          : page
      )
    );
    setSelectedElementId(null);
  };

  const getDefaultContent = (type: EditorElement["type"]) => {
    switch (type) {
      case "heading":
        return { text: "Novo Título", level: "h1" };
      case "text":
        return { text: "Digite seu texto aqui..." };
      case "image":
        return {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmMWYxIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbTwvdGV4dD4KPHN2Zz4=",
          alt: "Imagem",
        };
      case "button":
        return { text: "Clique aqui", url: "#" };
      case "form":
        return {
          fields: [
            { label: "Nome", type: "text", required: true },
            { label: "Email", type: "email", required: true },
          ],
        };
      case "video":
        return { url: "", poster: "" };
      case "quiz-question":
        return {
          question: "Sua pergunta aqui?",
          options: ["Opção 1", "Opção 2", "Opção 3"],
        };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type: EditorElement["type"]) => {
    switch (type) {
      case "heading":
        return { fontSize: "32px", color: "#333333", textAlign: "left" };
      case "text":
        return { fontSize: "16px", color: "#666666", textAlign: "left" };
      case "button":
        return {
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "12px 24px",
          fontSize: "16px",
        };
      default:
        return { color: "#333333", fontSize: "16px" };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">InLead Editor</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Salvar
          </Button>
          <Button size="sm">Publicar</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <InLeadSidebar
          selectedElement={selectedElement}
          onAddElement={addElement}
          onUpdateElement={(updates) => {
            if (selectedElementId) {
              updateElement(selectedElementId, updates);
            }
          }}
          onDeleteElement={() => {
            if (selectedElementId) {
              deleteElement(selectedElementId);
            }
          }}
        />

        {/* Main Editor Area */}
        <div className="flex-1 flex">
          <Tabs defaultValue="canvas" className="flex-1 flex flex-col">
            <div className="bg-white border-b px-4">
              <TabsList>
                <TabsTrigger value="canvas">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="canvas" className="flex-1 overflow-auto">
              <InLeadCanvas
                page={currentPage}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={updateElement}
              />
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 overflow-auto bg-white"
            >
              <InLeadPreview page={currentPage} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InLeadEditor;
