import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ValueDialog from "../../Components/ValueDialog.js";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import MapComponentSLT from "../../Components/MapComponentSLT.js";
import NavBar2 from "../../Components/NavBar2.js";
import Footer1 from "../../Components/Footer1.js";
import Footer2 from "../../Components/Footer2.js";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import NotificationSLT from "../../Components/NotificationSLT.js";
import DateTime from "../../Components/DateTime";
import { useNavigate } from "react-router-dom";

export default function AdminSLTDashboard() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [farmCount, setFarmCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDevices, setActiveDevices] = useState(0);
  const [inactiveDevices, setInactiveDevices] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [userId, setUserId] = useState(null);
  const isNestHubMax = useMediaQuery(
    "(max-width: 1300px) and (min-width: 1200px)"
  );
  const isNestHub = useMediaQuery("(max-width: 1024px) and (min-width: 980px)");
  const isSurfacePro7 = useMediaQuery(
    "(max-width: 1370px) and (min-width: 912px)"
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
            "/api/device/count"
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
            "/api/device/active-count"
          );
          setActiveDevices(response.data.count);
        } catch (error) {
          console.error("Failed to fetch active device count:", error);
        }
      };

      fetchActiveDeviceCount();

      //   const fetchCustomerCount = async () => {
      //   try {
      //     const response = await axios.get(`/api/user/customer/count/${userId}`);
      //     setCustomerCount(response.data.count);
      //   } catch (error) {
      //     console.error('Failed to fetch customer count:', error);
      //   }
      // };

      // fetchCustomerCount();

      const fetchManagerCount = async () => {
        try {
          const response = await axios.get(
            "/api/user/manager/count"
          );
          setManagerCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch manager count:", error);
        }
      };

      fetchManagerCount();

      const fetchFarmCount = async () => {
        try {
          const response = await axios.get(
            "/api/farm/count"
          );
          setFarmCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch farm count:", error);
        }
      };

      fetchFarmCount();

      const fetchCustomerCount = async () => {
        try {
          const response = await axios.get(
            "/api/user/customer/count"
          );
          setCustomerCount(response.data.count);
        } catch (error) {
          console.error("Failed to fetch customer count:", error);
        }
      };

      fetchCustomerCount();
    }
  }, [userId]);

  const values = [customerCount, farmCount, managerCount, deviceCount];
  const titles = ["Customers", "Farms", "Users", "Devices"];

  const handlePopoverOpen = (event, title, value) => {
    if (title === "Devices") {
      // const listValues = Array.from({ length: value }, (_, i) => ({
      //   status: i % 2 === 0 ? 'Active' : 'Inactive', // Example condition
      // }));

      // const activeCount = listValues.filter(device => device.status === 'Active').length;
      // const inactiveCount = listValues.filter(device => device.status === 'Inactive').length;

      // setActiveDevices(activeCount);
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
        navigate("/adminsltdevices");
        break;
      case "Customers":
        navigate("/adminsltuser");
        break;
      case "Users":
        navigate("/adminsltuser");
        break;
      default:
        break;
    }
  };
  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    backgroundSize: "cover",

    minHeight: isMobile
      ? "100vh"
      : isTablet
      ? "100vh"
      : isSurfacePro7
      ? "110vh"
      : "100vh",
    width: isMobile
      ? "100%"
      : isTablet
      ? "110%"
      : isNestHub
      ? "100%"
      : isNestHubMax
      ? "100%"
      : isSurfacePro7
      ? "115%"
      : "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
      <NavBar2 />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          mt: isMobile ? 15 : isTablet ? 12 :isSurfacePro7?15: 12,
          marginLeft: isMobile ? "15px" : isTablet ? "240px" : isNestHubMax
          ?"250px":isSurfacePro7?"190px": isNestHubMax
          ?"300px": "250px",
          justifyContent: isMobile ? "center" : "left",
          padding: "10px",
        }}
      >
        {/* ----------------------Device Card-------------------- */}
        <Grid item xs={12}>
          <Grid container spacing={3.3}>
            {values.map((value, index) => (
              <Grid key={index} item xs={6} sm={5} md={3} lg={3}>
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
                      margin: "1px ",
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

      {/* ----------------- Map------------------------ */}
      <MapComponentSLT />

      {/* ---------------------- NotificationBox----------------------- */}
      <NotificationSLT />

      <Footer1 /> 
      <DateTime />
    </div>
  );
}
