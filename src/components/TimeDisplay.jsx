import React from 'react';

const TimeDisplay = ({ time }) => {
  // Format the time using the browser's locale
  const formattedTime = new Date(time).toLocaleString();

  return <span>{formattedTime}</span>;
};

export default TimeDisplay;