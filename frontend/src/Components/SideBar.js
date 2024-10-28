import React from "react"; //superadmin
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
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

export default function SideBar({ open, handleDrawerToggle }) {
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

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={handleDrawerToggle}
      sx={{
        width: isMobile ? "80px" : isTablet ? "150px" : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? "80px" : isTablet ? "150px" : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#A4D0AE",
          color: "white",
        },
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingBottom: 5,
        }}
      >
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
            to="/superadmin"
            sx={{
              "&:hover": {
                backgroundColor: "#61B44A",
              },
              backgroundColor:
                location.pathname === "/superadmin" ? "#61B44A" : "transparent",
              borderRadius: "20px",
              justifyContent: isMobile ? "center" : "flex-start",
              marginTop: isMobile ? "20px" : "4px",
              "& .MuiListItemIcon-root": {
                minWidth: isMobile ? 0 : 56,
              },
            }}
          >
            <ListItemIcon>
              <AccountCircle
                sx={{
                  color: "black",
                  fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                }}
              />
            </ListItemIcon>
            {!isMobile && (
              <ListItemText primary="Profile" sx={{ color: "black" }} />
            )}
          </ListItem>
          <br />

          <ListItem
            button
            component={Link}
            to="/superadminuser"
            sx={{
              "&:hover": {
                backgroundColor: "#61B44A",
              },
              backgroundColor:
                location.pathname === "/superadminuser"
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
              <GroupsIcon
                sx={{
                  color: "black",
                  fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                }}
              />
            </ListItemIcon>
            {!isMobile && (
              <ListItemText primary="Users" sx={{ color: "black" }} />
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
  );
}
