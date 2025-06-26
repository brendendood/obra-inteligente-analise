
import { useState, useRef, useCallback } from 'react';

interface DragItem {
  id: string;
  index: number;
  data: any;
}

interface UseDragAndDropProps {
  items: any[];
  onReorder: (items: any[]) => void;
  keyExtractor: (item: any) => string;
}

export const useDragAndDrop = ({ items, onReorder, keyExtractor }: UseDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragElementRef = useRef<HTMLElement | null>(null);
  const ghostElementRef = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: any, index: number) => {
    const dragData: DragItem = {
      id: keyExtractor(item),
      index,
      data: item
    };

    setDraggedItem(dragData);
    setIsDragging(true);

    // Criar ghost element com visual aprimorado
    const target = e.currentTarget as HTMLElement;
    dragElementRef.current = target;
    
    // Clone do elemento para ghost
    const ghost = target.cloneNode(true) as HTMLElement;
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '0.8';
    ghost.style.transform = 'rotate(2deg) scale(0.95)';
    ghost.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
    ghost.style.borderRadius = '12px';
    ghost.style.zIndex = '9999';
    ghost.style.border = '2px solid #3b82f6';
    ghost.style.backgroundColor = '#f8fafc';
    
    document.body.appendChild(ghost);
    ghostElementRef.current = ghost;
    
    e.dataTransfer.setDragImage(ghost, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
    
    // Estilo do elemento original durante o drag
    target.style.opacity = '0.4';
    target.style.transform = 'scale(0.98)';
    target.style.transition = 'all 0.2s ease';
    
    // Remover ghost depois de um tempo
    setTimeout(() => {
      if (ghostElementRef.current) {
        document.body.removeChild(ghostElementRef.current);
        ghostElementRef.current = null;
      }
    }, 100);
  }, [keyExtractor]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';
    target.style.transition = 'all 0.2s ease';
    
    setDraggedItem(null);
    setDropTargetIndex(null);
    setIsDragging(false);
    
    // Limpar ghost element se ainda existir
    if (ghostElementRef.current) {
      document.body.removeChild(ghostElementRef.current);
      ghostElementRef.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem && targetIndex !== draggedItem.index) {
      setDropTargetIndex(targetIndex);
    }
  }, [draggedItem]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Verificar se saiu completamente do elemento
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTargetIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem || targetIndex === draggedItem.index) {
      setDropTargetIndex(null);
      return;
    }

    const newItems = [...items];
    const draggedElement = newItems.splice(draggedItem.index, 1)[0];
    newItems.splice(targetIndex, 0, draggedElement);
    
    onReorder(newItems);
    setDropTargetIndex(null);
  }, [draggedItem, items, onReorder]);

  const getDragItemProps = useCallback((item: any, index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, item, index),
    onDragEnd: handleDragEnd,
    style: {
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: 'all 0.2s ease',
    }
  }), [handleDragStart, handleDragEnd, isDragging]);

  const getDropZoneProps = useCallback((index: number) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, index),
  }), [handleDragOver, handleDragLeave, handleDrop]);

  const getDropIndicatorProps = useCallback((index: number) => ({
    isVisible: dropTargetIndex === index && draggedItem !== null,
    isActive: dropTargetIndex === index,
  }), [dropTargetIndex, draggedItem]);

  return {
    isDragging,
    draggedItem,
    dropTargetIndex,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  };
};
