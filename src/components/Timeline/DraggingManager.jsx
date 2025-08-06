import { useEffect, useCallback } from 'react';

const DraggingManager = ({
  draggingState,
  onDragUpdate,
  onDragEnd,
  dayWidth
}) => {
  const handleMouseMove = useCallback((e) => {
    if (!draggingState || !draggingState.active) return;

    const { item, type, initialX, initialDate } = draggingState;
    
    const deltaX = e.clientX - initialX;
    const dayDelta = Math.round(deltaX / dayWidth);

    if (dayDelta === 0) return;
    
    let newStart = item.start;
    let newEnd = item.end;

    if (type === 'start') {
      const newStartDate = new Date(initialDate.start);
      newStartDate.setDate(newStartDate.getDate() + dayDelta);

      if (newStartDate < new Date(item.end)) {
        newStart = newStartDate.toISOString().split('T')[0];
      }
    } else if (type === 'end') {
      const newEndDate = new Date(initialDate.end);
      newEndDate.setDate(newEndDate.getDate() + dayDelta);
      
      if (newEndDate > new Date(item.start)) {
        newEnd = newEndDate.toISOString().split('T')[0];
      }
    } else if (type === 'move') {
      const newStartDate = new Date(initialDate.start);
      newStartDate.setDate(newStartDate.getDate() + dayDelta);
      newStart = newStartDate.toISOString().split('T')[0];
      
      const newEndDate = new Date(initialDate.end);
      newEndDate.setDate(newEndDate.getDate() + dayDelta);
      newEnd = newEndDate.toISOString().split('T')[0];
    }

    if (newStart !== item.start || newEnd !== item.end) {
      onDragUpdate({
        ...item,
        start: newStart,
        end: newEnd
      });
    }
  }, [draggingState, onDragUpdate, dayWidth]);

  const handleMouseUp = useCallback(() => {
    if (draggingState && draggingState.active) {
      onDragEnd();
    }
  }, [draggingState, onDragEnd]);

  useEffect(() => {
    if (draggingState && draggingState.active) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Avoid text selection when dragging
      document.body.style.userSelect = 'none';
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [draggingState, handleMouseMove, handleMouseUp]);

  return null;
};

export default DraggingManager;