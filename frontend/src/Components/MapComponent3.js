// MapComponent.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png",
});

const MapComponent = () => {
  // Center of Sri Lanka
  const sriLankaCenter = [7.8731, 80.7718];
  const zoomLevel = 7;

  // Custom locations with labels
  const locations = [
    { position: [6.9271, 79.8612], label: "Colombo" }, // Example location: Colombo
    { position: [7.2906, 80.6337], label: "Kandy" }, // Example location: Kandy
    { position: [6.0535, 80.221], label: "Galle" }, // Example location: Galle
    // Add more locations as needed
  ];

  return (
    <MapContainer
      center={sriLankaCenter}
      zoom={zoomLevel}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker key={index} position={location.position}>
          <Tooltip>{location.label}</Tooltip>
          <Popup>{location.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
