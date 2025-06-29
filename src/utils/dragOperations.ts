
import { DragItem } from '@/types/dragAndDrop';

export const createGhostElement = (target: HTMLElement): HTMLElement => {
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
  
  return ghost;
};

export const applyDragStyles = (element: HTMLElement): void => {
  element.style.opacity = '0.5';
  element.style.transform = 'scale(0.97)';
  element.style.transition = 'all 0.2s ease';
};

export const removeDragStyles = (element: HTMLElement): void => {
  element.style.opacity = '1';
  element.style.transform = 'scale(1)';
  element.style.transition = 'all 0.3s ease';
};

export const setupDragTransfer = (
  e: React.DragEvent,
  dragData: DragItem,
  ghostElement: HTMLElement
): void => {
  e.dataTransfer.setDragImage(ghostElement, 0, 0);
  e.dataTransfer.effectAllowed = 'move';
};

export const cleanupGhostElement = (ghostElement: HTMLElement | null): void => {
  if (ghostElement && ghostElement.parentNode) {
    ghostElement.parentNode.removeChild(ghostElement);
  }
};
