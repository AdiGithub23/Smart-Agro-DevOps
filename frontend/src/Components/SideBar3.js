import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import MessageIcon from "@mui/icons-material/Message";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SpaIcon from "@mui/icons-material/Spa";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
const drawerWidth = 240;

export default function SideBar3({ open, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const [settings, setSettings] = useState({}); 
  const deviceID = localStorage.getItem("DeviceID");
  useEffect(() => {
    const fetchSettings = async () => {
      if (!deviceID) {
        console.warn('Device ID is missing');
        return; 
      }
      try {
        const response = await fetch(`/api/settings?device_id=${deviceID}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching dashboard settings:', error);
      }
    };
    fetchSettings();
  }, [deviceID]);

  if (!settings) {
    return null;
  }
  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: isMobile ? "80px" : isTablet ? "175px" : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "80px" : isTablet ? "175px" : drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#A4D0AE",
            color: "white",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Link to="/">
              <img
                src="/Images/logo.png"
                alt="Logo"
                style={{
                  height: isMobile ? 40 : isTablet ? 60 : 90,
                  marginBottom: 10,
                  marginTop: isMobile ? 20 : 35,
                }}
              />
            </Link>
          </Toolbar>
          <List sx={{ flexGrow: 1 }}>
            <ListItem
              button
              component={Link}
              to="/managerdashboard"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/managerdashboard"
                    ? "#61B44A"
                    : "transparent",
                borderRadius: "20px",
                justifyContent: isMobile ? "center" : "flex-start",
                marginTop: isMobile ? "20px" : "4px",
                "& .MuiListItemIcon-root": {
                  minWidth: isMobile ? 0 : 56,
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Dashboard" sx={{ color: "black" }} />
              )}
            </ListItem>
            {settings?.real_time && (
              <ListItem
                button
                component={Link}
                to="/managerrealtime"
                sx={{
                  "&:hover": {
                    backgroundColor: "#61B44A",
                  },
                  backgroundColor:
                    location.pathname === "/managerrealtime"
                      ? "#61B44A"
                      : "transparent",
                  borderRadius: "20px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  marginTop: isMobile ? "20px" : "4px",
                  "& .MuiListItemIcon-root": {
                    minWidth: isMobile ? 0 : 56,
                  },
                }}
              >
                <ListItemIcon>
                  <HistoryIcon sx={{ color: "black" }} />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText primary="Real Time" sx={{ color: "black" }} />
                )}
              </ListItem>
            )}
            {settings.alerts && (
              <ListItem
                button
                component={Link}
                to="/manageralerts"
                sx={{
                  "&:hover": {
                    backgroundColor: "#61B44A",
                  },
                  backgroundColor:
                    location.pathname === "/manageralerts"
                      ? "#61B44A"
                      : "transparent",
                  borderRadius: "20px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  marginTop: isMobile ? "20px" : "4px",
                  "& .MuiListItemIcon-root": {
                    minWidth: isMobile ? 0 : 56,
                  },
                }}
              >
                <ListItemIcon>
                  <NotificationsIcon sx={{ color: "black" }} />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText primary="Alerts" sx={{ color: "black" }} />
                )}
              </ListItem>
            )}
            {settings.analysis && (
              <ListItem
                button
                component={Link}
                to="/manageranalysis"
                sx={{
                  "&:hover": {
                    backgroundColor: "#61B44A",
                  },
                  backgroundColor:
                    location.pathname === "/manageranalysis"
                      ? "#61B44A"
                      : "transparent",
                  borderRadius: "20px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  marginTop: isMobile ? "20px" : "4px",
                  "& .MuiListItemIcon-root": {
                    minWidth: isMobile ? 0 : 56,
                  },
                }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon sx={{ color: "black" }} />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText primary="Analysis" sx={{ color: "black" }} />
                )}
              </ListItem>
            )}
            {settings.yield && (
              <ListItem
                button
                component={Link}
                to="/manageryield"
                sx={{
                  "&:hover": {
                    backgroundColor: "#61B44A",
                  },
                  backgroundColor:
                    location.pathname === "/manageryield"
                      ? "#61B44A"
                      : "transparent",
                  borderRadius: "20px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  marginTop: isMobile ? "20px" : "4px",
                  "& .MuiListItemIcon-root": {
                    minWidth: isMobile ? 0 : 56,
                  },
                }}
              >
                <ListItemIcon>
                  <SpaIcon sx={{ color: "black" }} />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText primary="Yield" sx={{ color: "black" }} />
                )}
              </ListItem>
            )}
            <ListItem
              button
              component={Link}
              to="/managerdevices"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/managerdevices"
                    ? "#61B44A"
                    : "transparent",
                borderRadius: "20px",
                justifyContent: isMobile ? "center" : "flex-start",
                marginTop: isMobile ? "20px" : "4px",
                "& .MuiListItemIcon-root": {
                  minWidth: isMobile ? 0 : 56,
                },
              }}
            >
              <ListItemIcon>
                <BuildIcon sx={{ color: "black" }} />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Devices" sx={{ color: "black" }} />
              )}
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/managermessages"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/managermessages"
                    ? "#61B44A"
                    : "transparent",
                borderRadius: "20px",
                justifyContent: isMobile ? "center" : "flex-start",
                marginTop: isMobile ? "20px" : "4px",
                "& .MuiListItemIcon-root": {
                  minWidth: isMobile ? 0 : 56,
                },
              }}
            >
              <ListItemIcon>
              <MessageIcon sx={{ color: "black" }} /> 
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Messages" sx={{ color: "black" }} />
              )}
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/managerdistrictselection"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/managerdistrictselection"
                    ? "#61B44A"
                    : "transparent",
                borderRadius: "20px",
                justifyContent: isMobile ? "center" : "flex-start",
                marginTop: isMobile ? "20px" : "4px",
                "& .MuiListItemIcon-root": {
                  minWidth: isMobile ? 0 : 56,
                },
              }}
            >
              <ListItemIcon>
              <TravelExploreIcon sx={{ color: "black" }} />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Guidance" sx={{ color: "black" }} />
              )}
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                borderRadius: "20px",
                justifyContent: isMobile ? "center" : "flex-start",
                marginTop: isMobile ? "20px" : "4px",
                "& .MuiListItemIcon-root": {
                  minWidth: isMobile ? 0 : 56,
                },
              }}
            >
              <ListItemIcon sx={{ color: "black" }}>
                <LogoutIcon
                  sx={{ fontSize: isMobile ? 24 : isTablet ? 28 : 24 }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Log Out" sx={{ color: "black" }} />
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
