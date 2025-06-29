
import { validateTaskOrder } from '@/utils/scheduleRecalculator';

export const validateDropTarget = (
  draggedIndex: number,
  targetIndex: number,
  items: any[],
  enableRecalculation: boolean
): { isValid: boolean; effect: string } => {
  if (draggedIndex === targetIndex) {
    return { isValid: false, effect: 'none' };
  }

  if (!enableRecalculation) {
    return { isValid: true, effect: 'move' };
  }

  // Simulate the reorder to validate
  const newItems = [...items];
  const draggedElement = newItems.splice(draggedIndex, 1)[0];
  newItems.splice(targetIndex, 0, draggedElement);
  
  const validation = validateTaskOrder(newItems);
  return {
    isValid: validation.isValid,
    effect: validation.isValid ? 'move' : 'none'
  };
};

export const isOutsideBounds = (
  e: React.DragEvent,
  currentTarget: EventTarget
): boolean => {
  const rect = (currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;
  
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
};

export const performReorder = <T>(
  items: T[],
  draggedIndex: number,
  targetIndex: number
): T[] => {
  const newItems = [...items];
  const draggedElement = newItems.splice(draggedIndex, 1)[0];
  newItems.splice(targetIndex, 0, draggedElement);
  return newItems;
};
