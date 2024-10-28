import React, { useState, useEffect } from "react"; // admin slt
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
import NotificationBox from "./NotificationBox"; // Import the NotificationBox component
import SideBar1 from "./SideBar1"; // Import the SideBar2 component
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Avatar } from "@mui/material";

export default function NavBar2() {

  const [user, setUser] = useState(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [admin_id, setAdminId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data);
        setAdminId(userId);
        console.log("User profile picture: ", response.data.profile_picture);
      } catch (error) {
        console.error("Failed to decode token:", error);
      };
    }
    fetchUserData();
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{  backgroundColor:"rgba(143, 186, 166, 0.7)", color: "#000", zIndex: 1100 }}
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
          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              aria-label="show new notifications"
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
              onClick={() => handleNavigation("/adminslt")}
              color="inherit"
            >
              <Avatar
                    src={user?.profile_picture ? user.profile_picture : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="Profile"
                    style={{
                      width: 30,
                      height:30,
                      borderRadius: "50%",
                    }}
                  />            </IconButton>
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
    </Box>
  );
}
