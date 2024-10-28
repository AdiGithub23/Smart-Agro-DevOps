import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import BuildIcon from "@mui/icons-material/Build";
import MessageIcon from "@mui/icons-material/Message";
import LogoutIcon from "@mui/icons-material/Logout";
import ConstructionIcon from "@mui/icons-material/Construction";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
const drawerWidth = 240;

export default function SideBar1({ open, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1250px)");
  const isDesktop = !isMobile && !isTablet;
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: isMobile ? "80px" : isTablet ? "170px" : "215px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "80px" : isTablet ? "170px" : "215px",
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

          <List>
            <ListItem
              button
              component={Link}
              to="/adminsltdashboard"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltdashboard"
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

            <ListItem
              button
              component={Link}
              to="/adminsltuser"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltuser"
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
              component={Link}
              to="/adminsltinventry"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltinventry"
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
                <ConstructionIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Inventory" sx={{ color: "black" }} />
              )}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/adminsltdevices"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltdevices"
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
                <BuildIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Devices" sx={{ color: "black" }} />
              )}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/adminsltpackage"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltpackage"
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
                <RssFeedIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Packages" sx={{ color: "black" }} />
              )}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/adminsltmessages"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltmessages"
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
                <MessageIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
              </ListItemIcon>
              {!isMobile && (
                <ListItemText primary="Messages" sx={{ color: "black" }} />
              )}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/adminsltdistrictselection"
              sx={{
                "&:hover": {
                  backgroundColor: "#61B44A",
                },
                backgroundColor:
                  location.pathname === "/adminsltdistrictselection"
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
                <TravelExploreIcon
                  sx={{
                    color: "black",
                    fontSize: isMobile ? 24 : isTablet ? 28 : 24,
                  }}
                />
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
