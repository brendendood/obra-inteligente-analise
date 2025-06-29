
export interface DragItem {
  id: string;
  index: number;
  data: any;
}

export interface UseDragAndDropProps {
  items: any[];
  onReorder: (items: any[]) => void;
  keyExtractor: (item: any) => string;
  enableRecalculation?: boolean;
  onRecalculate?: (recalculatedItems: any[], warnings: string[]) => void;
}

export interface DragState {
  draggedItem: DragItem | null;
  dropTargetIndex: number | null;
  isDragging: boolean;
  isValidDrop: boolean;
}

export interface DragHandlers {
  handleDragStart: (e: React.DragEvent, item: any, index: number) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent, targetIndex: number) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetIndex: number) => void;
}
