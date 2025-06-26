import { useDrag, useDrop } from "react-dnd";
import { useCallback } from "react";

export const ITEM_TYPES = {
  COMPONENT: "component",
  ELEMENT: "element",
};

// Hook para elementos arrastáveis da biblioteca
export const useDraggableComponent = (componentType: string) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.COMPONENT,
    item: { type: componentType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { isDragging, drag };
};

// Hook para elementos arrastáveis no canvas
export const useDraggableElement = (
  elementId: string,
  index: number,
  moveElement: (dragIndex: number, hoverIndex: number) => void
) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.ELEMENT,
    item: { id: elementId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPES.ELEMENT,
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return { isDragging, isOver, drag, drop };
};

// Hook para área de drop (canvas)
export const useDropZone = (
  onDrop: (item: any, monitor: any) => void,
  accept: string | string[] = [ITEM_TYPES.COMPONENT, ITEM_TYPES.ELEMENT]
) => {
  const [{ isOver, canDrop, item }, drop] = useDrop({
    accept,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        onDrop(item, monitor);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  return { isOver, canDrop, item, drop };
};

// Hook para ordenação com drag and drop
export const useSortable = (
  items: any[],
  onReorder: (startIndex: number, endIndex: number) => void
) => {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      onReorder(dragIndex, hoverIndex);
    },
    [onReorder]
  );

  return { moveItem };
};

// Hook para detecção de drop entre elementos
export const useDropBetween = (
  index: number,
  onDropBetween: (item: any, targetIndex: number) => void
) => {
  const [{ isOverTop, isOverBottom }, drop] = useDrop({
    accept: [ITEM_TYPES.COMPONENT, ITEM_TYPES.ELEMENT],
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const hoverBoundingRect = (drop as any).current?.getBoundingClientRect();

      if (!clientOffset || !hoverBoundingRect) return;

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Determinar se está na metade superior ou inferior
      const isTop = hoverClientY < hoverMiddleY;

      return { isTop };
    },
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const hoverBoundingRect = (drop as any).current?.getBoundingClientRect();

      if (!clientOffset || !hoverBoundingRect) return;

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      const targetIndex = hoverClientY < hoverMiddleY ? index : index + 1;
      onDropBetween(item, targetIndex);
    },
    collect: (monitor) => {
      const clientOffset = monitor.getClientOffset();
      const hoverBoundingRect = (drop as any).current?.getBoundingClientRect();

      let isOverTop = false;
      let isOverBottom = false;

      if (monitor.isOver() && clientOffset && hoverBoundingRect) {
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        isOverTop = hoverClientY < hoverMiddleY;
        isOverBottom = hoverClientY >= hoverMiddleY;
      }

      return {
        isOverTop,
        isOverBottom,
        isOver: monitor.isOver(),
      };
    },
  });

  return { isOverTop, isOverBottom, drop };
};
