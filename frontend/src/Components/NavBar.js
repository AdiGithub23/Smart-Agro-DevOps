import React, { useState, useEffect } from "react"; // superadmin
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
import SideBar from "./SideBar"; // Import the SideBar component
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Avatar } from "@mui/material";

export default function NavBar() {
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

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "rgba(143, 186, 166, 1)", color: "#000", zIndex: 1100 }}
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
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={() => handleNavigation("/superadmin")}
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
      <SideBar open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <NotificationBox
        anchorEl={notificationAnchorEl}
        open={isNotificationBoxOpen}
        onClose={handleNotificationBoxClose}
      />
    </Box>
  );
}
