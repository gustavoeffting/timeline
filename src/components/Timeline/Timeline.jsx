import { useState, useEffect, useRef, useCallback } from 'react';
import TimelineHeader from './TimelineHeader';
import TimelineItem from './TimelineItem';
import DraggingManager from './DraggingManager';
import { getXPosition, getWidth, generateMonthMarkers } from '../../utils';
import './Timeline.css';
import timelineItems from './timelineItems';
import assignLanes from './assignLanes';

const Timeline = () => {
  const [items, setItems] = useState(timelineItems);
  const [itemsWithLanes, setItemsWithLanes] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [draggingState, setDraggingState] = useState(null);
  
  const timelineRef = useRef(null);
  
  const startDate = new Date(Math.min(...items.map(item => new Date(item.start).getTime())));
  const endDate = new Date(Math.max(...items.map(item => new Date(item.end).getTime())));
  
  startDate.setDate(1);
  startDate.setDate(startDate.getDate() - 3); // This adds a few days padding at the beginning

  if (endDate.getDate() < new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()) {
    // Adds a few days padding when it doesn't end on the last day of the month
    endDate.setDate(endDate.getDate() + 3);
  } else {
    endDate.setDate(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate());
  }
  
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 2; // Extra days for better measure
  const dayWidth = 20 * zoomLevel;
  
  const calculateXPosition = useCallback((date) => {
    return getXPosition(date, startDate, dayWidth);
  }, [startDate, dayWidth]);
  
  const calculateWidth = useCallback((start, end) => {
    return getWidth(start, end, dayWidth);
  }, [dayWidth]);
  
  useEffect(() => {
    const lanes = assignLanes([...items]);
    
    const itemsWithLaneInfo = items.map(item => {
      const laneIndex = lanes.findIndex(lane => 
        lane.some(laneItem => laneItem.id === item.id)
      );
      
      return {
        ...item,
        lane: laneIndex
      };
    });
    
    setItemsWithLanes(itemsWithLaneInfo);
  }, [items]);
  
  const handleItemUpdate = useCallback((updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }, []);

  const handleDragStart = useCallback((item, type, clientX) => {
    if (!timelineRef.current) return;
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    
    setDraggingState({
      active: true,
      item,
      type,
      initialX: clientX,
      initialDate: {
        start: item.start,
        end: item.end
      },
      timelineRect
    });
  }, []);
  
  const handleDragUpdate = useCallback((updatedItem) => {
    handleItemUpdate(updatedItem);
  }, [handleItemUpdate]);
  
  const handleDragEnd = useCallback(() => {
    setDraggingState(null);
  }, []);
  
  const handleZoom = useCallback((factor) => {
    setZoomLevel(prev => {
      const newZoom = prev * factor;
      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  }, []);
  
  const markers = generateMonthMarkers(
    startDate, 
    endDate, 
    calculateXPosition
  );
  
  return (
    <div className="timeline-container">
      <h1 className="timeline-title">Timeline Visualization</h1>
      
      <div className="zoom-controls">
        <button className="zoom-button" onClick={() => handleZoom(0.8)}>Zoom Out</button>
        <button className="zoom-button" onClick={() => setZoomLevel(1)}>Reset</button>
        <button className="zoom-button" onClick={() => handleZoom(1.2)}>Zoom In</button>
        <span className="zoom-level">Zoom: {zoomLevel.toFixed(1)}x</span>
      </div>
      
      <div className="timeline-wrapper" ref={timelineRef}>
        <TimelineHeader 
          width={totalDays * dayWidth} 
          markers={markers} 
        />
        
        <div 
          className="timeline-content" 
          style={{ 
            width: totalDays * dayWidth, 
            height: itemsWithLanes.length > 0 
              ? (Math.max(...itemsWithLanes.map(item => item.lane)) + 1) * 50 + 20 
              : 100 
          }}
        >
          {itemsWithLanes.map(item => (
            <TimelineItem
              key={item.id}
              item={item}
              xPosition={calculateXPosition(item.start)}
              width={calculateWidth(item.start, item.end)}
              yPosition={item.lane * 50 + 10}
              onItemUpdate={handleItemUpdate}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
      
      <DraggingManager
        draggingState={draggingState}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
        startDate={startDate}
        dayWidth={dayWidth}
      />
    </div>
  );
};

export default Timeline;