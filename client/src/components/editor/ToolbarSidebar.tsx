import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TriangleAlert,
  Book,
  Mic,
  RectangleHorizontal,
  LoaderCircle,
  GalleryHorizontalEnd,
  ChartArea,
  AlignHorizontalDistributeEnd,
  Sparkles,
  Quote,
  TextCursorInput,
  Proportions,
  MessageCircleQuestion,
  ChartNoAxesColumnIncreasing,
  Images,
  List,
  ArrowRightLeft,
  SlidersHorizontal,
  Rows3,
  CircleDollarSign,
  Code,
  Scale,
  Text,
  Heading1,
  Video,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { EditorElement } from "@/types/editor";
import { createElement } from "@/utils/editorUtils";

interface ToolbarItem {
  id: string;
  type: EditorElement["type"];
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isNew?: boolean;
}

const toolbarItems: ToolbarItem[] = [
  { id: "alert", type: "text", icon: TriangleAlert, label: "Alerta" },
  { id: "arguments", type: "text", icon: Book, label: "Argumentos" },
  { id: "audio", type: "video", icon: Mic, label: "Audio" },
  { id: "button", type: "button", icon: RectangleHorizontal, label: "Botão" },
  { id: "loading", type: "text", icon: LoaderCircle, label: "Carregando" },
  {
    id: "carousel",
    type: "image",
    icon: GalleryHorizontalEnd,
    label: "Carrosel",
  },
  { id: "chart", type: "text", icon: ChartArea, label: "Cartesiano" },
  {
    id: "compare",
    type: "text",
    icon: AlignHorizontalDistributeEnd,
    label: "Comparar",
    isNew: true,
  },
  {
    id: "confetti",
    type: "text",
    icon: Sparkles,
    label: "Confetti",
    isNew: true,
  },
  { id: "testimonials", type: "text", icon: Quote, label: "Depoimentos" },
  { id: "input", type: "input", icon: TextCursorInput, label: "Entrada" },
  { id: "spacer", type: "spacer", icon: Proportions, label: "Espaçador" },
  {
    id: "faq",
    type: "text",
    icon: MessageCircleQuestion,
    label: "FAQ",
    isNew: true,
  },
  {
    id: "graphics",
    type: "text",
    icon: ChartNoAxesColumnIncreasing,
    label: "Gráficos",
  },
  { id: "image", type: "image", icon: Images, label: "Imagem" },
  { id: "list", type: "text", icon: List, label: "Lista", isNew: true },
  {
    id: "marquee",
    type: "text",
    icon: ArrowRightLeft,
    label: "Marquise",
    isNew: true,
  },
  { id: "level", type: "text", icon: SlidersHorizontal, label: "Nível" },
  { id: "options", type: "text", icon: Rows3, label: "Opções" },
  { id: "price", type: "text", icon: CircleDollarSign, label: "Preço" },
  { id: "script", type: "text", icon: Code, label: "Script" },
  { id: "terms", type: "text", icon: Scale, label: "Termos" },
  { id: "text", type: "text", icon: Text, label: "Texto" },
  { id: "title", type: "heading", icon: Heading1, label: "Título" },
  { id: "video", type: "video", icon: Video, label: "Video" },
];

const DraggableToolbarItem: React.FC<{ item: ToolbarItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: {
        type: "toolbar-item",
        elementType: item.type,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${
          isDragging ? 0.9 : 1
        }) scaleY(${isDragging ? 0.9 : 1})`,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-zinc-950/50 relative hover:z-30 cursor-move"
      role="button"
      tabIndex={0}
    >
      <div className="text-zinc-100 cursor-move col-span-4 rounded border hover:border-gray-400 items-center py-2 px-3 gap-2 ease relative flex">
        <div className="relative w-auto">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xs py-1">{item.label}</div>
        {item.isNew && (
          <span className="text-[0.6rem] text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg rounded-full px-1 py-0.5 absolute -top-1 -right-1">
            Novo!
          </span>
        )}
      </div>
    </div>
  );
};

export const ToolbarSidebar: React.FC = () => {
  return (
    <>
      {/* Desktop version */}
      <ScrollArea className="relative overflow-hidden hidden md:block w-full max-h-full md:max-w-[9.5rem] pr-2">
        <div className="overflow-hidden relative z-[1] flex flex-col gap-1 p-2 pb-6">
          {toolbarItems.map((item) => (
            <DraggableToolbarItem key={item.id} item={item} />
          ))}
        </div>
        <div className="py-8"></div>
      </ScrollArea>

      {/* Mobile version */}
      <ScrollArea className="relative overflow-hidden block md:hidden w-full max-h-[60px] pr-2">
        <div
          className="relative z-[1] flex gap-1 p-2 pb-6"
          style={{ minWidth: "fit-content" }}
        >
          {toolbarItems.map((item) => (
            <DraggableToolbarItem key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
