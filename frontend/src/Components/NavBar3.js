import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  Select,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableBody,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NotificationBox from "./NotificationBox";
import SideBar1 from "./SideBar1";
import axios from "axios";
import ConfirmationDialog from "./ConfirmatoinDialog";
import { jwtDecode } from "jwt-decode";

export default function NavBar1() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletScreen = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    real_time: false,
    alerts: false,
    analysis: false,
    yield: false,
  });
  const [selectedValue, setSelectedValue] = useState("");
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationSetting, setConfirmationSetting] = useState("");
  const isMenuOpen = Boolean(anchorEl);
  const [admin_id, setUserId] = useState(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const [data, setData] = useState([]);

  const device_id = localStorage.getItem("DeviceID");

  useEffect(() => {
    fetchData();
    if (device_id) {
      fetchSettings();
    }
  }, [device_id]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to decode token:", error);
      };
    }
    fetchUserData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/device/${device_id}`);
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error("Error fetching yield data:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`/api/settings?device_id=${device_id}`);
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const updateSettings = async (updates) => {
    try {
      await axios.post(`/api/settings?device_id=${device_id}`, updates);
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigation = (page) => {
    navigate(page);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    navigate(value);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setIsNotificationBoxOpen(!isNotificationBoxOpen);
  };

  const handleNotificationBoxClose = () => {
    setNotificationAnchorEl(null);
    setIsNotificationBoxOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };

  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
  };

  const toggleButton = (fieldName) => {
    setConfirmationSetting(fieldName);
    setConfirmationDialogOpen(true);
  };

  const confirmToggleButton = () => {
    const newValue = !settings[confirmationSetting];
    updateSettings({
      ...settings,
      [confirmationSetting]: newValue,
    });
    setConfirmationSetting("");
  };

  useEffect(() => {
    if (location.pathname === `/devicesrealtime/${device_id}`) {
      setSelectedValue(`/devicesrealtime/${device_id}`);
    } else if (location.pathname === `/devicesAlert/${device_id}`) {
      setSelectedValue(`/devicesAlert/${device_id}`);
    } else if (location.pathname === `/devicesanalysis/${device_id}`) {
      setSelectedValue(`/devicesanalysis/${device_id}`);
    } else if (location.pathname === `/devicesyield/${device_id}`) {
      setSelectedValue(`/devicesyield/${device_id}`);
    } else {
      setSelectedValue("");
    }
  }, [location.pathname]);


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
    const fetchUnreadAlertCount = async () => {
      try {
        const response = await axios.get(`/api/notifications/alerts/count/${admin_id}`);

        if (response.data.success) {
          setUnreadAlertsCount(response.data.unreadCount);
        } else {
          console.error('Failed to fetch unread notifications count: ', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching unread notifications count:', error);
      }
    };

    fetchUnreadAlertCount();

    const fetchUnreadMessageCount = async () => {
      try {
        const response = await axios.get(`/api/notifications/messages/count/${admin_id}`);

        if (response.data.success) {
          setUnreadMessagesCount(response.data.unreadCount);
        } else {
          console.error('Failed to fetch unread notifications count: ', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching unread notifications count:', error);
      }
    };

    fetchUnreadMessageCount();

    // Optional: Refresh count every minute (60000 milliseconds)
    const intervalId1 = setInterval(fetchUnreadMessageCount, 60000);
    const intervalId2 = setInterval(fetchUnreadAlertCount, 60000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    }; // Cleanup interval on component unmount
    
  }, [admin_id]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigation("/adminslt")}>
        <AccountCircle /> Profile
      </MenuItem>
      <MenuItem onClick={handleSettingsDialogOpen}>
        <SettingsIcon /> Settings
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(196, 218, 208, 0.8)",
          color: "#000",
          zIndex: 1100,
          padding: 1,
        }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                top: theme.spacing(2),
                left: theme.spacing(2),
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                marginLeft: { xs: 5, sm: 22, md: 22, lg: 30 },
                fontWeight: { xs: 500, sm: 500, md: 500, lg: 500 },
                fontSize: { xs: 10, sm: 13, md: 18, lg: 18 },
              }}
            >
              <div>Company : {data?.company_name || "Not assigned"}</div>
              <div>Farm : {data?.farm_name || "Not assigned"}</div>
              <div>Device: {data?.id}</div>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            {isSmallScreen || isTabletScreen ? (
              <FormControl
                sx={{
                  m: { xs: 1, sm: 1, md: 1, lg: 2 },
                  maxWidth: { xs: 100, sm: 120, md: 170, lg: 120 },
                }}
              >
                <Select
                  value={selectedValue}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ fontSize: { xs: 11, sm: 15, md: 20, lg: 500 } }}
                >
                  <MenuItem value={`/devicesrealtime/${device_id}`}>Real Time</MenuItem>
                  <MenuItem value={`/devicesAlert/${device_id}`}>Alerts</MenuItem>
                  <MenuItem value={`/devicesanalysis/${device_id}`}>Analysis</MenuItem>
                  <MenuItem value={`/devicesyield/${device_id}`}>Yield</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <>
                <Button
                  onClick={() => navigate(`/devicesrealtime/${device_id}`)}
                  variant="outlined"
                  sx={{
                    mx: 3,
                    color: "black",
                    borderColor: "black",
                    backgroundColor:
                      location.pathname === `/devicesrealtime/${device_id}`
                        ? "#61B44A"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "#61B44A",
                      borderColor: "#61B44A",
                    },
                  }}
                >
                  Real time
                </Button>
                <Button
                  onClick={() => navigate(`/devicesAlert/${device_id}`)}
                  variant="outlined"
                  sx={{
                    mx: 3,
                    color: "black",
                    borderColor: "black",
                    backgroundColor:
                      location.pathname === `/devicesAlert/${device_id}`
                        ? "#61B44A"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "#61B44A",
                      borderColor: "#61B44A",
                    },
                  }}
                >
                  Alerts
                </Button>
                <Button
                  onClick={() => navigate(`/devicesanalysis/${device_id}`)}
                  variant="outlined"
                  sx={{
                    mx: 3,
                    color: "black",
                    borderColor: "black",
                    backgroundColor:
                      location.pathname === `/devicesanalysis/${device_id}`
                        ? "#61B44A"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "#61B44A",
                      borderColor: "#61B44A",
                    },
                  }}
                >
                  Analysis
                </Button>
                <Button
                  onClick={() => navigate(`/devicesyield/${device_id}`)}
                  variant="outlined"
                  sx={{
                    mx: 3,
                    color: "black",
                    borderColor: "black",
                    backgroundColor:
                      location.pathname === `/devicesyield/${device_id}`
                        ? "#61B44A"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "#61B44A",
                      borderColor: "#61B44A",
                    },
                  }}
                >
                  Yield
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              size="large"
              aria-label="show new notifications count"
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={unreadAlertsCount+unreadMessagesCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
               <Avatar
                    src={user?.profile_picture ? user.profile_picture : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="Profile"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                    }}
                  />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <SideBar1 open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <NotificationBox
        anchorEl={notificationAnchorEl}
        open={isNotificationBoxOpen}
        onClose={handleNotificationBoxClose}
      />
      <Dialog
        open={settingsDialogOpen}
        onClose={handleSettingsDialogClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "20px",
            backgroundColor: "rgba(199, 221, 211)",
          },
        }}
      >
        <DialogContent>
          <Box>
            <Box sx={{ fontWeight: 500 }}>
              <Typography>
                Company : {data?.company_name || "Not assigned"}
              </Typography>
              <Typography>
                Farm : {data?.farm_name || "Not assigned"}
              </Typography>
              <Typography>Device: {data?.id}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 2,
            }}
          >
            <TableContainer sx={{ maxWidth: "100%" }}>
              <Table sx={{ width: "100%" }}>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <h3>Real Time</h3>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={settings.real_time ? "success" : "error"}
                        onClick={() => toggleButton("real_time")}
                        sx={{ width: "100px" }}
                      >
                        {settings.real_time ? "Enabled" : "Disabled"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h3>Alerts</h3>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={settings.alerts ? "success" : "error"}
                        onClick={() => toggleButton("alerts")}
                        sx={{ width: "100px" }}
                      >
                        {settings.alerts ? "Enabled" : "Disabled"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h3>Analysis</h3>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={settings.analysis ? "success" : "error"}
                        onClick={() => toggleButton("analysis")}
                        sx={{ width: "100px" }}
                      >
                        {settings.analysis ? "Enabled" : "Disabled"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h3>Yield</h3>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={settings.yield ? "success" : "error"}
                        onClick={() => toggleButton("yield")}
                        sx={{ width: "100px" }}
                      >
                        {settings.yield ? "Enabled" : "Disabled"}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={confirmToggleButton}
        settingName={`change ${confirmationSetting}`}
      />
    </Box>
  );
}
