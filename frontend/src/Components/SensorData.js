// src/components/SensorData.js
import React from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";

const data = [
  { label: "Ambient Temperature", value: "25°C" },
  { label: "Relative Air Humidity", value: "25%RH" },
  { label: "Soil pH", value: "25" },
  { label: "Rainfall", value: "25mm" },
  { label: "Soil Electrical Conductivity", value: "25 μS/cm" },
  { label: "Soil Temperature", value: "25°C" },
  { label: "Soil Nitrogen", value: "25 ppm" },
  { label: "Soil Moisture", value: "25%" },
  { label: "Soil Phosphorous", value: "25 ppm" },
  { label: "Soil Potassium", value: "25 ppm" },
];

const SensorData = () => {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Real-time Data
      </Typography>
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item.label}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SensorData;
