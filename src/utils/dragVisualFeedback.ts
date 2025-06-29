
export const getDragItemStyle = (isDragging: boolean) => ({
  cursor: isDragging ? 'grabbing' : 'grab',
  transition: 'all 0.2s ease',
});

export const getDropIndicatorProps = (
  index: number,
  dropTargetIndex: number | null,
  draggedItem: any,
  isValidDrop: boolean
) => ({
  isVisible: dropTargetIndex === index && draggedItem !== null,
  isActive: dropTargetIndex === index,
  isValid: isValidDrop
});
