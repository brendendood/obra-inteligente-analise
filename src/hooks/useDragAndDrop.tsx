import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { recalculateScheduleDates, validateTaskOrder } from '@/utils/scheduleRecalculator';

interface DragItem {
  id: string;
  index: number;
  data: any;
}

interface UseDragAndDropProps {
  items: any[];
  onReorder: (items: any[]) => void;
  keyExtractor: (item: any) => string;
  enableRecalculation?: boolean;
  onRecalculate?: (recalculatedItems: any[], warnings: string[]) => void;
}

export const useDragAndDrop = ({ 
  items, 
  onReorder, 
  keyExtractor, 
  enableRecalculation = false,
  onRecalculate 
}: UseDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidDrop, setIsValidDrop] = useState(true);
  const dragElementRef = useRef<HTMLElement | null>(null);
  const ghostElementRef = useRef<HTMLElement | null>(null);
  const { toast } = useToast();

  const handleDragStart = useCallback((e: React.DragEvent, item: any, index: number) => {
    const dragData: DragItem = {
      id: keyExtractor(item),
      index,
      data: item
    };

    setDraggedItem(dragData);
    setIsDragging(true);

    // Criar ghost element melhorado
    const target = e.currentTarget as HTMLElement;
    dragElementRef.current = target;
    
    const ghost = target.cloneNode(true) as HTMLElement;
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '0.9';
    ghost.style.transform = 'rotate(1deg) scale(0.98)';
    ghost.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.4)';
    ghost.style.borderRadius = '12px';
    ghost.style.zIndex = '9999';
    ghost.style.border = '2px solid #3B82F6';
    ghost.style.backgroundColor = '#F8FAFC';
    
    document.body.appendChild(ghost);
    ghostElementRef.current = ghost;
    
    e.dataTransfer.setDragImage(ghost, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
    
    // Estilo do elemento original
    target.style.opacity = '0.5';
    target.style.transform = 'scale(0.97)';
    target.style.transition = 'all 0.2s ease';
    
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
    target.style.transition = 'all 0.3s ease';
    
    setDraggedItem(null);
    setDropTargetIndex(null);
    setIsDragging(false);
    setIsValidDrop(true);
    
    if (ghostElementRef.current) {
      document.body.removeChild(ghostElementRef.current);
      ghostElementRef.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedItem && targetIndex !== draggedItem.index) {
      setDropTargetIndex(targetIndex);
      
      // Validar se é um drop válido quando recálculo está habilitado
      if (enableRecalculation) {
        const newItems = [...items];
        const draggedElement = newItems.splice(draggedItem.index, 1)[0];
        newItems.splice(targetIndex, 0, draggedElement);
        
        const validation = validateTaskOrder(newItems);
        setIsValidDrop(validation.isValid);
        e.dataTransfer.dropEffect = validation.isValid ? 'move' : 'none';
      } else {
        setIsValidDrop(true);
        e.dataTransfer.dropEffect = 'move';
      }
    }
  }, [draggedItem, items, enableRecalculation]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTargetIndex(null);
      setIsValidDrop(true);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem || targetIndex === draggedItem.index) {
      setDropTargetIndex(null);
      return;
    }

    // Verificar se é um drop válido
    if (!isValidDrop) {
      toast({
        title: "❌ Reordenação inválida",
        description: "Essa reordenação violaria a sequência lógica da obra.",
        variant: "destructive",
      });
      setDropTargetIndex(null);
      return;
    }

    const newItems = [...items];
    const draggedElement = newItems.splice(draggedItem.index, 1)[0];
    newItems.splice(targetIndex, 0, draggedElement);
    
    // Executar recálculo se habilitado
    if (enableRecalculation && onRecalculate) {
      try {
        const result = recalculateScheduleDates(newItems);
        
        // Mostrar warnings se existirem
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
        onReorder(newItems); // Fallback para reordenação simples
      }
    } else {
      onReorder(newItems);
      toast({
        title: "📋 Ordem atualizada",
        description: "Cronograma reordenado conforme solicitado.",
      });
    }
    
    setDropTargetIndex(null);
  }, [draggedItem, items, isValidDrop, enableRecalculation, onRecalculate, onReorder, toast]);

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
    isValid: isValidDrop
  }), [dropTargetIndex, draggedItem, isValidDrop]);

  return {
    isDragging,
    draggedItem,
    dropTargetIndex,
    isValidDrop,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  };
};
