import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, registerables } from "chart.js";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularWithValueLabel from "./Loading";

ChartJS.register(...registerables, annotationPlugin);

export default function AreaChartFillByXRange() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const deviceId = localStorage.getItem("DeviceID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!deviceId) return;

        setLoading(true);

        if (startDate && endDate) {
          if (startDate > endDate) {
            setLoading(false);
            return;
          }

          const response = await axios.get(
            `/api/real-time/graph/date/${deviceId}`,
            {
              params: { startDate, endDate },
            }
          );
          setGraphData(response.data);
        } else {
          const response = await axios.get(`/api/real-time/${deviceId}`);
          setGraphData(response.data);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate, deviceId]);

  const fetchTop20Records = () => {
    if (graphData.length === 0) return;

    const sortedData = [...graphData].map((dataGroup) => {
      const sortedValues = [...dataGroup.values].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      return {
        ...dataGroup,
        values: sortedValues.slice(0, 20).reverse(),
      };
    });

    setGraphData(sortedData);
  };

  const handleDownload = async () => {
    try {
      if (startDate > endDate) {
        alert("End date should be after start date");
        return;
      }

      const response = await axios.get(`/api/real-time/download/${deviceId}`, {
        params: {
          startDate,
          endDate,
          download: true,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sensor-data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <div>
      <Box sx={{ mb: 6, mt: 5, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={10} sm={2}>
            <Button
              variant="contained"
              color="success"
              sx={{
                marginLeft: { xs: 17, sm: 1, md: 7, lg: 5 },
                height: "50px",
              }}
              onClick={fetchTop20Records}
            >
              Top 20
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
          <TextField
  type="date"
  label="From"
  InputLabelProps={{ shrink: true }}
  value={startDate}
  onChange={(e) => {
    const value = e.target.value;
    const [year, month, day] = value.split("-");

    // Ensure year is exactly 4 digits, month is 1-12, and day is valid for the given month
    const isValidYear = year.length === 4 && /^\d{4}$/.test(year);
    const isValidMonth = month && month.length === 2 && Number(month) >= 1 && Number(month) <= 12;
    const isValidDay =
      day && day.length === 2 && Number(day) >= 1 && Number(day) <= new Date(Number(year), Number(month), 0).getDate();

    if (isValidYear && isValidMonth && isValidDay) {
      setStartDate(value); 
      setDateError("");// Update only if all parts are valid
    }
  }}
  inputProps={{
    maxLength: 10, // Still limits the total length to YYYY-MM-DD
  }}
  sx={{
    mx: 2,
    width: { xs: 140, sm: 130, md: 150, lg: 160 },
    marginLeft: { xs: 2, sm: 2, md: 2, lg: 10 },
    "& .MuiInputBase-root": {
      "&:after": {
        borderBottomColor: "green",
      },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255) inset",
      WebkitTextFillColor: "black",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255) inset",
      WebkitTextFillColor: "black",
      transition: "background-color 5000s ease-in-out 0s",
    },
  }}
/>

            {/*<TextField
              type="date"
              label="From"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mx: 2, marginLeft: { xs: 0, sm: 0, md: 8, lg: 20 } }}
            />*/}
          </Grid>
          <Grid item xs={6} sm={3}>
          <TextField
  type="date"
  label="To"
  InputLabelProps={{ shrink: true }}
  value={endDate}
  onChange={(e) => {
    const value = e.target.value;
    const [year, month, day] = value.split("-");

    // Ensure year is exactly 4 digits, month is 1-12, and day is valid for the given month
    const isValidYear = year.length === 4 && /^\d{4}$/.test(year);
    const isValidMonth = month && month.length === 2 && Number(month) >= 1 && Number(month) <= 12;
    const isValidDay =
      day && day.length === 2 && Number(day) >= 1 && Number(day) <= new Date(Number(year), Number(month), 0).getDate();

    if (isValidYear && isValidMonth && isValidDay) {
      setEndDate(value);
      if (startDate && new Date(value) < new Date(startDate)) {
        setDateError('End date cannot be earlier than the start date');
      } else {
        setDateError(""); // Clear the error if the date range is valid
      } // Update only if all parts are valid
    }
  }}
  inputProps={{
    maxLength: 10, // Still limits the total length to YYYY-MM-DD
  }}
  sx={{
    mx: 2,
    width: { xs: 140, sm: 130, md: 150, lg: 160 },
    marginLeft: { xs: 3, sm: 5, md: 5, lg: 15 },
    "& .MuiInputBase-root": {
      "&:after": {
        borderBottomColor: "green",
      },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255) inset",
      WebkitTextFillColor: "black",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255) inset",
      WebkitTextFillColor: "black",
      transition: "background-color 5000s ease-in-out 0s",
    },
  }}
/>
{dateError && (
          <Typography color="error" variant="caption">
            {dateError}
          </Typography>
        )}



           {/*<TextField
              type="date"
              label="To"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mx: 2, marginLeft: { xs: 0, sm: 3, md: 8, lg: 20 } }}
            />*/}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="success"
              sx={{
                marginLeft: { xs: 11, sm: 6, md: 8, lg: 20 },
                height: "50px",
              }}
              onClick={handleDownload}
            >
              Download History
            </Button>
          </Grid>
        </Grid>{" "}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularWithValueLabel />
        </Box>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {graphData.map((graphLabel, index) => {
            const yMinThreshold = graphLabel.minThresholdValue;
            const yMaxThreshold = graphLabel.maxThresholdValue;

            return (
              <Grid item xs={12} sm={11.8} md={6} lg={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{ padding: "5px", backgroundColor: "#c7ddd3" }}
                >
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
                          pointRadius: 1.5,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        x: {
                          ticks: {
                            color: "#2b3832",
                          },
                        },

                        y: {
                          min: graphLabel.minParameterValue,
                          max: graphLabel.maxParameterValue,
                          ticks: {
                            color: "#2b3832",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        annotation: {
                          annotations: [
                            ...(yMinThreshold !== null
                              ? [
                                  {
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
                                  },
                                ]
                              : []),
                            ...(yMaxThreshold !== null
                              ? [
                                  {
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
                                  },
                                ]
                              : []),
                            ...graphLabel.values
                              .map((point, idx) => {
                                if (idx === graphLabel.values.length - 1)
                                  return null;
                                let color;
                                if (point.value > yMaxThreshold) {
                                  color = "rgba(255, 0, 0, 0.3)";
                                } else if (point.value < yMinThreshold) {
                                  color = "rgba(224, 240, 5,0.3)";
                                } else {
                                  color = "rgba(0, 255, 0, 0.3)";
                                }

                                return {
                                  type: "box",
                                  xMin: idx,
                                  xMax: idx + 1,
                                  yMin: graphLabel.minParameterValue,
                                  yMax: graphLabel.maxParameterValue,
                                  backgroundColor: color,
                                  borderWidth: 0,
                                };
                              })
                              .filter((annotation) => annotation !== null),
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
      )}
    </div>
  );
}
