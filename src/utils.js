export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Calculate position on timeline based on date
export const getXPosition = (date, startDate, dayWidth) => {
  const days = Math.floor((new Date(date) - startDate) / (1000 * 60 * 60 * 24));
  return days * dayWidth;
};

// Calculate width needed to display an item on the timeline
export const getWidth = (startDate, endDate, dayWidth) => {
  const startTimeMs = new Date(startDate).getTime();
  const endTimeMs = new Date(endDate).getTime();
  
  const days = Math.ceil((endTimeMs - startTimeMs) / (1000 * 60 * 60 * 24)) + 1;
  
  return Math.max(days * dayWidth, 50);
};

// Generate month markers for the timeline header
export const generateMonthMarkers = (startDate, endDate, getXPosition) => {
  const markers = [];
  
  const firstMonth = new Date(startDate);

  if (firstMonth.getDate() !== 1) {
    firstMonth.setDate(1);
    firstMonth.setMonth(firstMonth.getMonth() + 1);
  } else {
    firstMonth.setDate(1);
  }
  
  // Cloning end date to avoid mutation
  const lastDate = new Date(endDate);
  
  // Create markers for months
  const currentDate = new Date(firstMonth);
  while (currentDate <= lastDate) {
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    markers.push({
      date: new Date(currentDate),
      label: monthName,
      position: getXPosition(currentDate)
    });
    
    // Move to first day of the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return markers;
};