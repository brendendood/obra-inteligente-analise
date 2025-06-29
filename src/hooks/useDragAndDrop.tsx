
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { recalculateScheduleDates } from '@/utils/scheduleRecalculator';
import { DragItem, UseDragAndDropProps, DragState } from '@/types/dragAndDrop';
import {
  createGhostElement,
  applyDragStyles,
  removeDragStyles,
  setupDragTransfer,
  cleanupGhostElement
} from '@/utils/dragOperations';
import {
  validateDropTarget,
  isOutsideBounds,
  performReorder
} from '@/utils/dropOperations';
import { getDragItemStyle, getDropIndicatorProps } from '@/utils/dragVisualFeedback';

export const useDragAndDrop = ({ 
  items, 
  onReorder, 
  keyExtractor, 
  enableRecalculation = false,
  onRecalculate 
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dropTargetIndex: null,
    isDragging: false,
    isValidDrop: true
  });
  
  const dragElementRef = useRef<HTMLElement | null>(null);
  const ghostElementRef = useRef<HTMLElement | null>(null);
  const { toast } = useToast();

  const handleDragStart = useCallback((e: React.DragEvent, item: any, index: number) => {
    const dragData: DragItem = {
      id: keyExtractor(item),
      index,
      data: item
    };

    setDragState(prev => ({
      ...prev,
      draggedItem: dragData,
      isDragging: true
    }));

    const target = e.currentTarget as HTMLElement;
    dragElementRef.current = target;
    
    const ghost = createGhostElement(target);
    document.body.appendChild(ghost);
    ghostElementRef.current = ghost;
    
    setupDragTransfer(e, dragData, ghost);
    applyDragStyles(target);
    
    setTimeout(() => {
      cleanupGhostElement(ghostElementRef.current);
      ghostElementRef.current = null;
    }, 100);
  }, [keyExtractor]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    removeDragStyles(target);
    
    setDragState({
      draggedItem: null,
      dropTargetIndex: null,
      isDragging: false,
      isValidDrop: true
    });
    
    cleanupGhostElement(ghostElementRef.current);
    ghostElementRef.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (dragState.draggedItem && targetIndex !== dragState.draggedItem.index) {
      const validation = validateDropTarget(
        dragState.draggedItem.index,
        targetIndex,
        items,
        enableRecalculation
      );
      
      setDragState(prev => ({
        ...prev,
        dropTargetIndex: targetIndex,
        isValidDrop: validation.isValid
      }));
      
      e.dataTransfer.dropEffect = validation.effect as any;
    }
  }, [dragState.draggedItem, items, enableRecalculation]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (isOutsideBounds(e, e.currentTarget)) {
      setDragState(prev => ({
        ...prev,
        dropTargetIndex: null,
        isValidDrop: true
      }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!dragState.draggedItem || targetIndex === dragState.draggedItem.index) {
      setDragState(prev => ({ ...prev, dropTargetIndex: null }));
      return;
    }

    if (!dragState.isValidDrop) {
      toast({
        title: "❌ Reordenação inválida",
        description: "Essa reordenação violaria a sequência lógica da obra.",
        variant: "destructive",
      });
      setDragState(prev => ({ ...prev, dropTargetIndex: null }));
      return;
    }

    const newItems = performReorder(items, dragState.draggedItem.index, targetIndex);
    
    if (enableRecalculation && onRecalculate) {
      try {
        const result = recalculateScheduleDates(newItems);
        
        if (result.warnings.length > 0) {
          toast({
            title: "⚠️ Atenção",
            description: `Cronograma recalculado com ${result.warnings.length} aviso(s).`,
          });
        } else {
          toast({
            title: "✅ Cronograma atualizado",
            description: `Prazos recalculados automaticamente. Nova duração: ${result.totalDuration} dias.`,
          });
        }
        
        onRecalculate(result.tasks, result.warnings);
      } catch (error) {
        console.error('Erro no recálculo:', error);
        toast({
          title: "❌ Erro no recálculo",
          description: "Não foi possível recalcular automaticamente. Verifique as dependências.",
          variant: "destructive",
        });
        onReorder(newItems);
      }
    } else {
      onReorder(newItems);
      toast({
        title: "📋 Ordem atualizada",
        description: "Cronograma reordenado conforme solicitado.",
      });
    }
    
    setDragState(prev => ({ ...prev, dropTargetIndex: null }));
  }, [dragState, items, enableRecalculation, onRecalculate, onReorder, toast]);

  const getDragItemProps = useCallback((item: any, index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, item, index),
    onDragEnd: handleDragEnd,
    style: getDragItemStyle(dragState.isDragging)
  }), [handleDragStart, handleDragEnd, dragState.isDragging]);

  const getDropZoneProps = useCallback((index: number) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, index),
  }), [handleDragOver, handleDragLeave, handleDrop]);

  const getDropIndicatorPropsCallback = useCallback((index: number) => 
    getDropIndicatorProps(
      index,
      dragState.dropTargetIndex,
      dragState.draggedItem,
      dragState.isValidDrop
    ), [dragState.dropTargetIndex, dragState.draggedItem, dragState.isValidDrop]);

  return {
    isDragging: dragState.isDragging,
    draggedItem: dragState.draggedItem,
    dropTargetIndex: dragState.dropTargetIndex,
    isValidDrop: dragState.isValidDrop,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps: getDropIndicatorPropsCallback,
  };
};
