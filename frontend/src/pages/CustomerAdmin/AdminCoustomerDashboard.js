import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import MapComponentCA from "../../Components/MapComponentCA.js";
import NavBar7 from "../../Components/NavBar7.js";
import Footer1 from "../../Components/Footer1.js";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationCA from "../../Components/NotificationCA.js";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function AdminCustomerDashboard() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [farmCount, setFarmCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDevices, setActiveDevices] = useState(0);
  const [inactiveDevices, setInactiveDevices] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isNestHubMax = useMediaQuery(
    "(max-width: 1280px) and (min-width: 1200px)"
  );
  const navigate = useNavigate();

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
      const fetchDeviceCount = async () => {
        try {
          const response = await axios.get(
            `/api/device/count/customer/${userId}`
          );
          setDeviceCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch device count:", error);
        }
      };
      fetchDeviceCount();

      const fetchActiveDeviceCount = async () => {
        try {
          const response = await axios.get(
            `/api/device/active-count/customer/${userId}`
          );
          setActiveDevices(response.data.count);
        } catch (error) {
          console.error("Failed to fetch active device count:", error);
        }
      };
      fetchActiveDeviceCount();

      const fetchFarmCount = async () => {
        try {
          const response = await axios.get(
            `/api/farm/customer-count/${userId}`
          );
          setFarmCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch farm count:", error);
        }
      };

      fetchFarmCount();

      const fetchManagerCount = async () => {
        try {
          const response = await axios.get(
            `/api/user/manager/count/${userId}`
          );
          setManagerCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch manager count:", error);
        }
      };

      fetchManagerCount();
    }
  }, [userId]);

  // useEffect(() => {
  //   const fetchManagerCount = async () => {
  //     try {
  //       const response = await axios.get('/api/user/manager/count');
  //       setManagerCount(response.data.count);
  //     } catch (error) {
  //       console.error('Failed to fetch manager count:', error);
  //     }
  //   };

  //   fetchManagerCount();
  // }, []);

  const values = [deviceCount, farmCount, managerCount];
  const titles = ["Devices", "Farms", "Managers"];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  const handlePopoverOpen = (event, title, value) => {
    if (title === "Devices") {
      // const listValues = Array.from({ length: value }, (_, i) => ({
      //   status: i % 2 === 0 ? 'Active' : 'Inactive', // Example condition
      // }));

      // const activeCount = listValues.filter(device => device.status === 'Active').length;
      // const inactiveCount = listValues.filter(device => device.status === 'Inactive').length;

      // setActiveDevices(activeCount);
      // setInactiveDevices(inactiveCount);
      setInactiveDevices(deviceCount - activeDevices);
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleCardClick = (title) => {
    switch (title) {
      case "Devices":
        navigate("/admincustomerdevices");
        break;
      case "Farms":
        navigate("/customeradminfarms");
        break;
      case "Managers":
        navigate("/customeradminuser");
        break;
      default:
        break;
    }
  };

  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    backgroundSize: "cover",
    minHeight: isMobile ? "80vh" : isTablet ? "100vh" : "100vh",
    width: isMobile ? "100%" : isTablet ? "100%" : "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
     
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          mt: isMobile ? 18 : isTablet ? 20 : isNestHubMax? 14: 11,
          mt: isMobile ? 16 : isTablet ? 20 : isNestHubMax? 14: 12,
          marginLeft: isMobile
          ? "3px"
          : isTablet
          ? "200px"
          : isNestHubMax
          ? "300px"
          : "270px",
          justifyContent: isMobile ? "center" : "left",
        }}
      >
        {/*---------------------Device Card-----------------------*/}
        <Grid item xs={12}>
          <Grid
              container
              spacing={6} // Adjusted spacing between cards
              xs={15}
              sm={15}
              md={15}
              lg={15}
              justifyContent="center"
              alignItems="center"
          >
            {values.map((value, index) => (
              <Grid
                key={index}
                item
                xs={6}
                sm={4}
                md={4}
                lg={4}
                display="flex"
                justifyContent="center"
              >
                <Paper
                  sx={{
                    height: 150,
                    width: 120,
                    border: "none",
                    background:
                      "linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    borderRadius: "10%",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
                    },
                  }}
                  onMouseEnter={(event) =>
                    handlePopoverOpen(event, titles[index], value)
                  }
                  onMouseLeave={handlePopoverClose}
                  onClick={() => handleCardClick(titles[index])}
                >
                  <div
                    style={{
                      textAlign: "center",
                      margin: "1px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#333",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      {titles[index]}
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "none",
                      height: "70px",
                      width: "70px",
                      borderRadius: "50%",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <h1
                       style={{
                        color: "#000",
                        fontSize: "36px",
                        fontWeight: "bold",
                      }}
                    >
                      {value}
                    </h1>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CircleIcon sx={{ color: "green", fontSize: 14, mr: 1 }} />
            Active Devices: {activeDevices}
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CircleIcon sx={{ color: "red", fontSize: 14, mr: 1 }} />
            Inactive Devices: {inactiveDevices}
          </Typography>
        </Box>
      </Popover>
      {/*---------------------Map-----------------------*/}
      <MapComponentCA />
      {/*---------------------Notification-----------------------*/}
      <NotificationCA />

      <Footer1 />
    </div>
  );
}
