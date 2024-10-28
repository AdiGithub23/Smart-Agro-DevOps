import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationBox from "./NotificationBox";
import SideBar2 from "./SideBar2";
import DeviceStatusButton from "./DeviceStatus";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { jwtDecode } from "jwt-decode";

const ScrollContainer = React.forwardRef(({ children }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: "flex",
      overflow: "hidden",
      width: "100%",
      padding: 2,
      position: "relative",
      margin: "0 20px",
    }}
  >
    {children}
  </Box>
));

const ArrowButton = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      [direction === "left" ? "left" : "right"]: 10,
      transform: "translateY(-50%)",
      backgroundColor: "#C4DAD0",
      color: "#000",
      "&:hover": { backgroundColor: "#B0BEB4" },
      zIndex: 1,
    }}
  >
    {direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  </IconButton>
);

export default function NavBar5() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); // Track selected device
  const [admin_id, setUserId] = useState(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const handleNavigation = (page) => {
    navigate(page);
  };
  
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

  const handleDeviceClick = (deviceName) => {
    setSelectedDevice(deviceName); // Update selected device
    navigate(`/admincustomeralerts/${encodeURIComponent(deviceName)}`);
  };

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

  const scroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = 300;
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const devices = [
    { status: "green", serialNumber: "S0345", deviceName: "Device - 01" },
    { status: "yellow", serialNumber: "S0346", deviceName: "Device - 02" },
    { status: "red", serialNumber: "S0347", deviceName: "Device - 03" },
    { status: "green", serialNumber: "S0348", deviceName: "Device - 04" },
    { status: "yellow", serialNumber: "S0349", deviceName: "Device - 05" },
    { status: "red", serialNumber: "S0350", deviceName: "Device - 06" },
    { status: "green", serialNumber: "S0351", deviceName: "Device - 07" },
    { status: "yellow", serialNumber: "S0352", deviceName: "Device - 08" },
    { status: "red", serialNumber: "S0353", deviceName: "Device - 09" },
    { status: "green", serialNumber: "S0354", deviceName: "Device - 10" },
  ];

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
      <MenuItem onClick={() => handleNavigation("/customeradmin")}>
        Profile
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#C4DAD0", color: "#000", zIndex: 1100 }}
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
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              width: "calc(100% - 300px)", // Adjust width to fit within AppBar
            }}
          >
            <ArrowButton direction="left" onClick={() => scroll("left")} />
            <ScrollContainer ref={containerRef}>
              {devices.map((device, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: 2,
                    margin: "0 10px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    minWidth: "200px",
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <DeviceStatusButton
                    status={device.status}
                    serialNumber={device.serialNumber}
                    deviceName={device.deviceName}
                    onClick={() => handleDeviceClick(device.deviceName)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#61B44A",
                      },
                      backgroundColor:
                        selectedDevice === device.deviceName
                          ? "#61B44A"
                          : "transparent", // Conditional styling
                    }}
                  />
                </Box>
              ))}
            </ScrollContainer>
            <ArrowButton direction="right" onClick={() => scroll("right")} />
          </Box>
          <Box sx={{ display: "flex" }}>
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
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <SideBar2 open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <NotificationBox
        anchorEl={notificationAnchorEl}
        open={isNotificationBoxOpen}
        onClose={handleNotificationBoxClose}
      />
    </Box>
  );
}
