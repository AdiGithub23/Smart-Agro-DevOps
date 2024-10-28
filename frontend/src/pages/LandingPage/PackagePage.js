import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PackagePage = () => {
  const [layout, setLayout] = useState("threeGrid");
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("/api/packages");
        const visiblePackages = response.data.filter(
          (pkg) => pkg.landingPageVisibility === true
        );
        setPackages(visiblePackages);
        setFilteredPackages(
          visiblePackages.filter((pkg) => pkg.poleOrPortable === "Pole")
        );
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    // Filter the packages based on the selected layout
    const type = newLayout === "threeGrid" ? "Pole" : "Portable";
    setFilteredPackages(packages.filter((pkg) => pkg.poleOrPortable === type));
  };

  const navigateToPage = (page) => {
    let elementId = "";
    switch (page) {
      case "Contact Us":
        elementId = "contact";
        break;
      default:
        elementId = "";
    }

    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #B6E9C8, #72ad87)",
        width: "auto",
        height: "auto",
        alignItems: "center",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      {/* Buttons for switching layouts */}
      <Box
        sx={{
          textAlign: "center",
          marginTop: { xs: "70px", sm: "70px", md: "60px",lg:"70px" },
          marginBottom: "10px",
        }}
      >
        <Button
          variant={layout === "threeGrid" ? "contained" : "outlined"}
          onClick={() => handleLayoutChange("threeGrid")}
          sx={{
            marginRight: "10px",
            marginBottom: { xs: "10px", sm: "0px", md: "0px",lg:"0px" },
            backgroundColor: layout === "threeGrid" ? "#61B44A" : "transparent",
            color: layout === "threeGrid" ? "white" : "#61B44A",
            fontWeight: "bold",
            borderColor: "#61B44A",
            "&:hover": {
              backgroundColor: layout === "threeGrid" ? "#61B44A" : "#E8F5E9",
              color: layout === "threeGrid" ? "white" : "#61B44A",
              borderColor: "#61B44A",
            },
          }}
        >
          Fazenda Pole
        </Button>
        <Button
          variant={layout === "oneGrid" ? "contained" : "outlined"}
          onClick={() => handleLayoutChange("oneGrid")}
          sx={{
            backgroundColor: layout === "oneGrid" ? "#61B44A" : "transparent",
            color: layout === "oneGrid" ? "white" : "#61B44A",
            fontWeight: "bold",
            marginBottom: { xs: "10px", sm: "0px", md: "0px",lg:"0px" },
            borderColor: "#61B44A",
            "&:hover": {
              backgroundColor: layout === "oneGrid" ? "#61B44A" : "#E8F5E9",
              color: layout === "oneGrid" ? "white" : "#61B44A",
              borderColor: "#61B44A",
            },
          }}
        >
          Fazenda Portable
        </Button>
      </Box>

      <Grid
        container
        spacing={6}
        justifyContent="center"
        sx={{
          maxWidth: { xs: "90%", sm: "90%", md: "100%" ,lg:"90%"},
          marginLeft: { xs: "10px", sm: "30px", md: "0px",lg:"100px" },
          marginTop: { xs: "30px", sm: "50px", md: "0px",lg:"20px" },
         
          marginBottom: "50px",
        }}
      >
        {filteredPackages.map((pkg, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: { xs: "10px", sm: "20px", md: "10px",lg:"20px" },
                borderRadius: "15px",
                height: "auto",
                width: "auto",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {pkg.packageName}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  <>
                    {Array.isArray(pkg.parameters) ||
                    typeof pkg.parameters === "string" ? (
                      <>
                        <h3>Parameters</h3>
                        {Array.isArray(pkg.parameters)
                          ? pkg.parameters.map((parameter, idx) => (
                              <React.Fragment key={`parameter-${idx}`}>
                                {parameter}
                                <br />
                              </React.Fragment>
                            ))
                          : pkg.parameters.split(",").map((parameter, idx) => (
                              <React.Fragment key={`parameter-${idx}`}>
                                {parameter.trim()}
                                <br />
                              </React.Fragment>
                            ))}
                      </>
                    ) : (
                      "No parameters available"
                    )}

                    {Array.isArray(pkg.features) ||
                    typeof pkg.features === "string" ? (
                      <>
                        <h3>Features</h3>
                        {Array.isArray(pkg.features)
                          ? pkg.features.map((feature, idx) => (
                              <React.Fragment key={`feature-${idx}`}>
                                {feature}
                                <br />
                              </React.Fragment>
                            ))
                          : pkg.features.split(",").map((feature, idx) => (
                              <React.Fragment key={`feature-${idx}`}>
                                {feature.trim()}
                                <br />
                              </React.Fragment>
                            ))}
                      </>
                    ) : (
                      "No features available"
                    )}
                  </>
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#61B44A",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#4E7F41",
                    },
                  }}
                  onClick={() => navigateToPage("Contact Us")}
                >
                  Request for a Demo
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PackagePage;
