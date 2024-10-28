import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #72ad87, #25382c)",
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        padding: { xs: "0px", sm: "0px", md: "0px" },
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "1200px",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",

          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "80px",
          marginBottom: {xs:"30px",sm:"70px"},
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ maxWidth: "90%", marginTop: "20px", marginBottom: "50px" }}
        >
          {/* Mission */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
          >
            <Box
              sx={{
                textAlign: "center",
                background: "#B6E9C8",
                padding: "30px",
                borderRadius: "15px",
                height: "auto",
                width: isMobile ? "100%" : "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)", // Zoom in effect on hover
                },
              }}
            >
              <img
                src="/Images/mission.png"
                alt="Mission"
                style={{ width: "auto", objectFit: "cover" }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Mission
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                Building The Incubation And Accelerator Ecosystem For Research &
                Development By Harnessing The Best Talents Through Innovation
                And Rapid Adoption Of Technology Advancements To Make
                Competitive Edge In The Market.
              </Typography>
            </Box>
          </Grid>

          {/* Vision */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
          >
            <Box
              sx={{
                textAlign: "center",
                background: "#B6E9C8",
                padding: "30px",
                borderRadius: "15px",
                height: "auto",
                width: isMobile ? "100%" : "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)", // Zoom in effect on hover
                },
              }}
            >
              <img
                src="/Images/vision.png"
                alt="Vision"
                style={{ width: "auto", objectFit: "cover" }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vision
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                Be The Catalyst In Creating The Green Society By Way Of
                Developing Applications And Technologies, Uplifting Lifestyle
                Globally.
              </Typography>
            </Box>
          </Grid>

          {/* Objective */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
          >
            <Box
              sx={{
                textAlign: "center",
                background: "#B6E9C8",
                padding: "30px",
                borderRadius: "15px",
                height: "auto",
                width: isMobile ? "100%" : "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)", // Zoom in effect on hover
                },
              }}
            >
              <img
                src="/Images/objective.png"
                alt="Objective"
                style={{ width: "auto", objectFit: "cover" }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Objective
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                Connect Digitally <br /> Reduce Energy Consumption <br />{" "}
                Enhancing Trust and Openness <br /> Enhance Business Value and
                Revenue
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutPage;
