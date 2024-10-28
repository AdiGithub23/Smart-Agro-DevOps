import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Grid from "@mui/material/Grid";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.6.0/dist/Images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6.0/dist/Images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6.0/dist/Images/marker-shadow.png",
});

const MapComponent = () => {
  const sriLankaCenter = [7.8731, 80.7718];
  const zoomLevel = 8;

  const sriLankaBounds = [
    [5.916, 79.652],
    [9.835, 82.109],
  ];

  const [locations, setLocations] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.id);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchDevices = async () => {
        try {
          const response = await axios.get(
            `/api/device/customer/locations/${userId}`
          );
          const devices = response.data;

          const formattedLocations = devices.map((device) => ({
            position: [device.latitude, device.longitude],
            deviceName: "Device " + device.id,
            modelName: device.model_name,
            serialNumber: device.serial_no,
            companyName: device.company_name,
            ...device.sensors.reduce(
              (acc, sensor) => ({
                ...acc,
                [`status${Object.keys(sensor).indexOf("Air_Temperature") + 1}`]:
                  sensor.Air_Temperature + " °C",
                [`status${
                  Object.keys(sensor).indexOf("Relative_Air_Humidity") + 1
                }`]: sensor.Relative_Air_Humidity + " % RH",
                [`status${Object.keys(sensor).indexOf("Rainfall") + 1}`]:
                  sensor.Rainfall + " mm",
                [`status${Object.keys(sensor).indexOf("Soil_Moisture") + 1}`]:
                  sensor.Soil_Moisture + " °C",
                [`status${Object.keys(sensor).indexOf("Soil_pH") + 1}`]:
                  sensor.Soil_pH,
                [`status${
                  Object.keys(sensor).indexOf("Soil_Temperature") + 1
                }`]: sensor.Soil_Temperature + " °C",
                [`status${Object.keys(sensor).indexOf("Soil_EC") + 1}`]:
                  sensor.Soil_EC + " uS/cm",
                [`status${Object.keys(sensor).indexOf("Soil_Nitrogen") + 1}`]:
                  sensor.Soil_Nitrogen + " ppm",
                [`status${
                  Object.keys(sensor).indexOf("Soil_Phosphorous") + 1
                }`]: sensor.Soil_Phosphorous + " ppm",
                [`status${Object.keys(sensor).indexOf("Soil_Potassium") + 1}`]:
                  sensor.Soil_Potassium + " ppm",
              }),
              {}
            ),
          }));

          setLocations(formattedLocations);
        } catch (error) {
          console.error("Failed to fetch devices:", error);
        }
      };

      fetchDevices();
    }
  }, [userId]);

  return (
    <div className="map-container">
      <MapContainer
        center={sriLankaCenter}
        zoom={zoomLevel}
        style={{
          height: "350px",
          width: "45%",
          marginLeft: "267px",
          marginTop: "40px",
        }}
        minZoom={8}
        maxZoom={12}
        maxBounds={sriLankaBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Tooltip>{location.deviceName}</Tooltip>
            <Popup>
              <div
                style={{
                  width: "300px",
                  height: "250px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  paddingLeft: "5px",
                }}
              >
                <center>
                  <h4>
                    {location.deviceName}
                    <br />
                    {location.serialNumber}
                  </h4>
                </center>
                <br />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <img src="/Images/I7.png" width="20px" height="20px" />{" "}
                    {location.status1}
                    <br />
                    <img src="/Images/I8.png" width="20px" height="20px" />{" "}
                    {location.status2}
                    <br />
                    <img src="/Images/I9.png" width="20px" height="20px" />{" "}
                    {location.status3}
                    <br />
                    <img src="/Images/I3.png" width="20px" height="20px" />{" "}
                    {location.status4}
                    <br />
                    <img src="/Images/I5.png" width="20px" height="20px" />{" "}
                    {location.status5}
                    <br />
                  </Grid>
                  <Grid item xs={6}>
                    <img src="/Images/I1.png" width="20px" height="20px" />{" "}
                    {location.status6}
                    <br />
                    <img src="/Images/I2.png" width="20px" height="20px" />{" "}
                    {location.status7}
                    <br />
                    <img src="/Images/I4.png" width="20px" height="20px" />{" "}
                    {location.status8}
                    <br />
                    <img
                      src="/Images/I10.png"
                      width="20px"
                      height="20px"
                    />{" "}
                    {location.status9}
                    <br />
                    <img
                      src="/Images/I11.png"
                      width="20px"
                      height="20px"
                    />{" "}
                    {location.status10}
                  </Grid>
                </Grid>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
