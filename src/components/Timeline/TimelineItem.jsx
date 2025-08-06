import { useState, useRef } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { formatDate } from '../../utils';

const TimelineItem = ({ 
  item,
  xPosition,
  width,
  yPosition,
  onItemUpdate,
  onDragStart
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.name);
  
  const inputRef = useRef(null);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(item.name);
    // Set focus after the input renders
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  };
  
  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };
  
  const handleEditComplete = () => {
    if (isEditing) {
      const updatedItem = {
        ...item,
        name: editText
      };
      onItemUpdate(updatedItem);
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(item.name);
    }
  };
  
  const handleMouseDown = (e, type) => {
    e.stopPropagation();
    onDragStart(item, type, e.clientX);
  };
  
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div 
            className="timeline-item"
            style={{ 
              left: xPosition, 
              top: yPosition, 
              width: width, 
              height: 40,
              minWidth: 50
            }}
            onDoubleClick={handleDoubleClick}
          >
            <div 
              className="drag-handle left-handle"
              onMouseDown={(e) => handleMouseDown(e, 'start')}
            />
            
            <div 
              className="item-content"
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="item-edit-input"
                  value={editText}
                  onChange={handleEditChange}
                  onBlur={handleEditComplete}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div className="item-name">
                    {item.name}
                  </div>
                  <div className="item-dates">
                    {width < 200 ? '' : `${formatDate(item.start)} - ${formatDate(item.end)}`}
                  </div>
                </>
              )}
            </div>
            
            <div 
              className="drag-handle right-handle"
              onMouseDown={(e) => handleMouseDown(e, 'end')}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content">
            <strong>{item.name}</strong>
            <div>Start: {formatDate(item.start)}</div>
            <div>End: {formatDate(item.end)}</div>
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TimelineItem;