const TimelineHeader = ({ width, markers }) => {
  return (
    <div className="timeline-header" style={{ width }}>
      {markers.map((marker, index) => (
        <div 
          key={index} 
          className="month-marker"
          style={{ left: marker.position }}
        >
          <span className="month-label">{marker.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TimelineHeader;