import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useMediaQuery, useTheme } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png",
});

const sensorIconMap = {
  Air_Temperature: "./../../Images/Air_Temperature.png",
  Relative_Air_Humidity: "./../../Images/Relative_Air_Humidity.png",
  Rainfall: "./../../Images/Rainfall.png",
  Soil_Moisture: "./../../Images/Soil_Moisture.png",
  Soil_pH: "./../../Images/Soil_pH.png",
  Soil_Temperature: "./../../Images/Soil_Temperature.png",
  Soil_EC: "./../../Images/Soil_EC.png",
  Soil_Nitrogen: "./../../Images/Soil_Nitrogen.png",
  Soil_Phosphorous: "./../../Images/Soil_Phosphorous.png",
  Soil_Potassium: "./../../Images/Soil_Potassium.png",
};

const MapComponentCA = () => {
  const sriLankaCenter = [7.8731, 80.7718];
  const zoomLevel = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isNestHubMax = useMediaQuery(
    "(max-width: 1280px) and (min-width: 1200px)"
  ); // Approximation for Nest Hub Max
  const isNestHub = useMediaQuery("(max-width: 1024px) and (min-width: 980px)"); // Approximation for Nest Hub

  const sriLankaBounds = [
    [5.916, 79.652],
    [9.835, 82.109],
  ];

  const [locations, setLocations] = useState([]);
  const [mapKey, setMapKey] = useState(0); // State to force map re-render
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

          // const formattedLocations = devices.map((device) => ({
          //   position: [device.latitude, device.longitude],
          //   deviceName: `Device ${device.id}`,
          //   modelName: device.model_name,
          //   serialNumber: device.serial_no,
          //   companyName: device.company_name,
          //   sensors: device.sensors
          //     .map((sensor) => ({
          //       Air_Temperature: sensor.Air_Temperature
          //         ? sensor.Air_Temperature + " °C"
          //         : null,
          //       Relative_Air_Humidity: sensor.Relative_Air_Humidity
          //         ? sensor.Relative_Air_Humidity + " % RH"
          //         : null,
          //       Rainfall: sensor.Rainfall ? sensor.Rainfall + " mm" : null,
          //       Soil_Moisture: sensor.Soil_Moisture
          //         ? sensor.Soil_Moisture + " % VWC"
          //         : null,
          //       Soil_pH: sensor.Soil_pH ? sensor.Soil_pH : null,
          //       Soil_Temperature: sensor.Soil_Temperature
          //         ? sensor.Soil_Temperature + " °C"
          //         : null,
          //       Soil_EC: sensor.Soil_EC ? sensor.Soil_EC + " uS/cm" : null,
          //       Soil_Nitrogen: sensor.Soil_Nitrogen
          //         ? sensor.Soil_Nitrogen + " ppm"
          //         : null,
          //       Soil_Phosphorous: sensor.Soil_Phosphorous
          //         ? sensor.Soil_Phosphorous + " ppm"
          //         : null,
          //       Soil_Potassium: sensor.Soil_Potassium
          //         ? sensor.Soil_Potassium + " ppm"
          //         : null,
          //     }))
          //     .filter((sensor) =>
          //       Object.values(sensor).some((value) => value !== null)
          //     ),
          // }));
          const formattedLocations = devices.map((device) => ({
            position: [device.latitude, device.longitude],
            // deviceName: `Device ${device.id}`,
            deviceName: `${device.device_label}`,
            serialNumber: device.serial_no,
            sensors: device.sensors
              .map((sensor) => ({
                Air_Temperature:
                  sensor.Air_Temperature != null ? sensor.Air_Temperature + " °C" : null,
                Relative_Air_Humidity:
                  sensor.Relative_Air_Humidity != null
                    ? sensor.Relative_Air_Humidity + " % RH"
                    : null,
                Rainfall: sensor.Rainfall != null ? sensor.Rainfall + " mm" : null,
                Soil_Moisture:
                  sensor.Soil_Moisture != null ? sensor.Soil_Moisture + " %" : null,
                Soil_pH: sensor.Soil_pH != null ? sensor.Soil_pH : null,
                Soil_Temperature:
                  sensor.Soil_Temperature != null ? sensor.Soil_Temperature + " °C" : null,
                Soil_EC: sensor.Soil_EC != null ? sensor.Soil_EC + " µS/cm" : null,
                Soil_Nitrogen:
                  sensor.Soil_Nitrogen != null ? sensor.Soil_Nitrogen + " ppm" : null,
                Soil_Phosphorous:
                  sensor.Soil_Phosphorous != null ? sensor.Soil_Phosphorous + " ppm" : null,
                Soil_Potassium:
                  sensor.Soil_Potassium != null ? sensor.Soil_Potassium + " ppm" : null,
              }))
              .filter((sensor) =>
                Object.values(sensor).some((value) => value !== null)
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

  useEffect(() => {
    // Increment the mapKey to force a re-render when screen size changes
    setMapKey((prevKey) => prevKey + 1);
  }, [isMobile, isTablet, isNestHubMax, isNestHub]);

  return (
    <div
      className="map-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "52vh",
      }}
    >
      <MapContainer
        key={mapKey} // Changing this key forces a re-render of the map
        center={sriLankaCenter}
        zoom={zoomLevel}
        style={{
          height: isMobile
            ? "30vh"
            : isTablet
            ? "30vh"
            : isNestHub
            ? "215px"
            : isNestHubMax
            ? "33vh"
            : "270px",
          width: isMobile
            ? "90vw"
            : isTablet
            ? "60vw"
            : isNestHub
            ? "58vw"
            : isNestHubMax
            ? "50vw"
            : "600px",
          margin: "auto",
          marginLeft: isMobile
            ? "7vw"
            : isTablet
            ? "31vw"
            : isNestHub
            ? "25vw"
            : isNestHubMax
            ? "22vw"
            : "270px",
          marginTop: isMobile
            ? "10vw"
            : isTablet
            ? "5vw"
            : isNestHub
            ? "2vw"
            : isNestHubMax
            ? "3vw"
            : "3vw",
          zIndex: 0,
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
                  height: isMobile
            ? "27vh"
            : isTablet
            ? "250px"
            : isNestHub
            ? "220px"
            : isNestHubMax
            ? "250px"
            : "250px",
          width: isMobile
            ? "75vw"
            : isTablet
            ? "300px"
            : isNestHub
            ? "300px"
            : isNestHubMax
            ? "300px"
            : "300px",
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
                  {location.sensors.map((sensor, sensorIndex) => {
                    const sensorEntries = Object.entries(sensor).filter(
                      ([key, value]) => value !== null
                    );
                    const leftValues = sensorEntries.slice(
                      0,
                      Math.ceil(sensorEntries.length / 2)
                    );
                    const rightValues = sensorEntries.slice(
                      Math.ceil(sensorEntries.length / 2)
                    );

                    return (
                      <React.Fragment key={sensorIndex}>
                        <Grid item xs={6}>
                          {leftValues.map(([key, value], i) => (
                            <div key={i}>
                              <img
                                src={sensorIconMap[key]}
                                width="20px"
                                height="20px"
                                alt={key}
                              />{" "}
                              {value}
                            </div>
                          ))}
                        </Grid>
                        <Grid item xs={6}>
                          {rightValues.map(([key, value], i) => (
                            <div key={i}>
                              <img
                                src={sensorIconMap[key]}
                                width="20px"
                                height="20px"
                                alt={key}
                              />{" "}
                              {value}
                            </div>
                          ))}
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponentCA;
