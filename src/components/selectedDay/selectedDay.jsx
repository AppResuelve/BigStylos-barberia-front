import React, { useState } from "react";
import './selectedDay.css'

const SelectedDay = () => {
  const totalSlots = 18;
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (index) => {
    setIsMouseDown(true);
    updateSelectedSlots(index);
  };

  const handleMouseEnter = (index) => {
    if (isMouseDown) {
      updateSelectedSlots(index);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const updateSelectedSlots = (index) => {
    setSelectedSlots((prevSelection) => {
      if (prevSelection.includes(index)) {
        return prevSelection.filter((value) => value !== index);
      } else {
        return [...prevSelection, index];
      }
    });
  };

  return (
    <div>
      <div onMouseUp={handleMouseUp}>
        {Array.from({ length: totalSlots }, (_, index) => (
          <div
            key={index}
            className={`slot ${
              selectedSlots.includes(index) ? "selected" : ""
            }`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDay;
