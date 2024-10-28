import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { red } from "@mui/material/colors";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";

const InfoCard = () => {
  const [data, setData] = useState([]);

  const device_id = localStorage.getItem("DeviceID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/real-time/tiles/${device_id}`);
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching tile data:", error);
      }
    };
    fetchData();

    const intervalId = setInterval(fetchData, 1800000); //for 30 minutes
    return () => clearInterval(intervalId);
  }, [device_id]);

  const getColor = (value, minThresholdValue, maxThresholdValue) => {
    if (minThresholdValue !== null && maxThresholdValue !== null) {
      if (value < minThresholdValue) {
        return "rgba(224, 240, 5)";
      }
      if (value >= minThresholdValue && value <= maxThresholdValue) {
        return "rgba(0, 153, 76)";
      }
      if (value > maxThresholdValue) {
        return "red";
      }
    }
  };

  return (
    <Box sx={{ display: "flex", mt: 10 }}>
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item key={index} sx={{ textAlign: "center" }}>
            <Paper
              sx={{
                height: 150,
                width: 90,
                border: "none",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                position: "relative", // Needed for positioning the warning
              }}
            >
              <img
                src={`/Images/${item.image}.png`} // Correct path for images in the public folder
                alt={item.label}
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 10,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: getColor(
                    item.value,
                    item.minThresholdValue,
                    item.maxThresholdValue
                  ),
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: getColor(
                    item.value,
                    item.minThresholdValue,
                    item.maxThresholdValue
                  ),
                }}
              >
                {item.value}
              </Typography>

              {item.value !== null &&
                (item.value > item.maxParameterValue ||
                  item.value < item.minParameterValue) && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      fontSize: 10,
                    }}
                  >
                    <WarningAmberIcon
                      fontSize="small"
                      style={{ color: red[500] }}
                    />
                  </Typography>
                )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InfoCard;
