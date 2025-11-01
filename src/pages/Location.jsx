import React from "react";
import "./Location.css";

const Location = () => {
  const address = "My Office, Madhapur, Beside Metro Station, Pillar No 1178";

  const handleOpenLocation = () => {
    const query = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  return (
    <div className="location-container">
      <h2 className="location-heading">My Office Location</h2>
      <p className="location-address">
        <strong>Address:</strong> {address}
      </p>
      <button className="location-button" onClick={handleOpenLocation}>
        Open Location in Maps
      </button>
    </div>
  );
};

export default Location;
