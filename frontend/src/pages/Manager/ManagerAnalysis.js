import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import NotificationD from "../../Components/NotificationDAnalysis.js";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';
import { Chart as ChartJS, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import NavBar6 from "../../Components/NavBar6";
import Footer2 from "../../Components/Footer2";
import DateTime from "../../Components/DateTime";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import NotificationTH from "../../Components/NotificationTHAnalysis.js";

ChartJS.register(...registerables, annotationPlugin);

const backgroundStyle = {
  backgroundColor: "#8FBAA6",
  padding: "10px 0px 100px 0px",
  minHeight: "100vh",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -1,
};

const ManagerAnalysis = () => {
  const [graphData, setGraphData] = useState([]);
  const deviceId = localStorage.getItem("DeviceID");

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        if (!deviceId) {
          throw new Error("No Devices found for your account");
        }
        const dataResponse = await axios.get(`/api/analysis/${deviceId}`);
        setGraphData(dataResponse.data);
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    };

    fetchParameters();
  }, [deviceId]);


  return (
    <div style={backgroundStyle}>
      <Box
        sx={{
          padding: { xs: "13px", sm: "20px", md: "20px", lg: "20px" },
          mt: { xs: 13, sm: 11, md: 12, lg: 9 },
          width: { xs: "80%", sm: "60%", md: "75%", lg: "55%" },
        }}
      >
       
        <Grid
          container
          spacing={3}
          sx={{ marginLeft: { xs: 0, sm: 24, md: 18, lg: 28 } }}
        >
          {graphData.map((graphLabel, index) => {
            const yMinThreshold = graphLabel.minThresholdValue;
            const yMaxThreshold = graphLabel.maxThresholdValue;

            return (
              <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
                <Paper elevation={3} sx={{ padding: "10px",backgroundColor:"#c7ddd3" }}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ marginBottom: "10px" }}
                  >
                    {graphLabel.label}
                  </Typography>
                  <Line
                  
                    data={{
                      labels: graphLabel.values.map((point) => point.time),
                      datasets: [
                        {
                          label: `${graphLabel.label}`,
                          data: graphLabel.values.map((point) => point.value),
                          borderColor: "black",
                          backgroundColor: "transparent", 
                          fill: false, 
                          borderWidth: 1.5,
                          pointRadius:1.5,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        x: {
                          ticks: {
                            color: "#2b3832", // Set X-axis labels color to black
                          },
                        },
                        y: {
                          min: graphLabel.minParameterValue,
                          max: graphLabel.maxParameterValue,
                          ticks: {
                            color: "#2b3832", // Set Y-axis labels color to black
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },  
                        annotation: {
                          annotations: [
                            // Conditionally add Min Threshold Line
                            ...(yMinThreshold !== null ? [{
                              type: "line",
                              yMin: yMinThreshold,
                              yMax: yMinThreshold,
                              borderColor: "blue",
                              borderWidth: 1,
                              borderDash: [5, 2],
                              label: {
                                content: `Min Threshold: ${yMinThreshold}`,
                                enabled: true,
                                position: "top",
                                backgroundColor: "blue",
                                color: "white",
                              },
                            }] : []),
                            // Conditionally add Max Threshold Line
                            ...(yMaxThreshold !== null ? [{
                              type: "line",
                              yMin: yMaxThreshold,
                              yMax: yMaxThreshold,
                              borderColor: "red",
                              borderWidth: 1,
                              borderDash: [5, 2],
                              label: {
                                content: `Max Threshold: ${yMaxThreshold}`,
                                enabled: true,
                                position: "top",
                                backgroundColor: "red",
                                color: "white",
                              },
                            }] : []),
                            // Color-coded Vertical Strips
                            ...graphLabel.values.map((point, index) => {
                              if (index === graphLabel.values.length - 1) return null; // Skip the last point

                              // Calculate the time range (X-axis) between the current and next point
                              const currentTime = graphLabel.values[index].time;
                              const nextTime = graphLabel.values[index + 1].time;

                              // Determine the color for this vertical strip based on the current point value
                              let color;
                              if (point.value > graphLabel.maxThresholdValue) {
                                color = "rgba(255, 0, 0, 0.3)"; // Red for above max threshold
                              } else if (point.value < graphLabel.minThresholdValue) {
                                color = "rgba(224, 240, 5,0.3)";
                              } else {
                                color = "rgba(0, 255, 0, 0.3)"; // Green for in range
                              }

                              // Return an annotation for this vertical region with yMin and yMax
                              return {
                                type: "box",
                                xMin: currentTime, // Start from the current point's time
                                xMax: nextTime, // End at the next point's time
                                yMin: graphLabel.minParameterValue, // Constrain to min Y-axis value
                                yMax: graphLabel.maxParameterValue, // Constrain to max Y-axis value
                                backgroundColor: color,
                                borderWidth: 0, // No border
                              };
                            }).filter(annotation => annotation !== null), // Remove any null annotations
                          ],
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        <NotificationTH />
      </Box>
      <Footer2 />
      <DateTime />
      
    </div>
  );
};

export default ManagerAnalysis;