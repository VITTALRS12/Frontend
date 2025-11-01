import React, { useState } from "react";
import "./Rating.css"; // Make sure styles support hover and click visuals

const Rating = ({ value = 0, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(value);

  const handleClick = (val) => {
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= (hovered || selected) ? "filled" : ""}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          style={{ cursor: "pointer" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
