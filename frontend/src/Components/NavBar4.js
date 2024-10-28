import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Avatar } from "@mui/material";

const pages = ["Home", "Product", "About Us", "Contact Us"];

export default function NavBar4() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(""); // Use state to manage role

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);

      const fetchUserData = async (userId) => {
        try {
          const response = await axios.get(`/api/user/${userId}`);
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      };

      const getUserFromToken = () => {
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setRole(decodedToken.role); // Update role in state

            if (userId) {
              fetchUserData(userId);
            } else {
              console.error("User ID not found in token");
            }
          } catch (error) {
            console.error("Failed to decode token:", error);
          }
        } else {
          console.error("No token found in localStorage");
        }
      };

      getUserFromToken();
    }
  }, []);

  const getRedirectURL = () => {
    switch (role) {
      case "super-admin":
        return "/superadmin";
      case "slt-admin":
        return "/adminsltdashboard";
      case "customer-admin":
        return "/admincoustomerdashboard";
      case "customer-manager":
        return "/managerdashboard";
      default:
        return "/login";
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navigateToPage = (page) => {
    let elementId = "";
    switch (page) {
      case "Home":
        elementId = "home";
        break;
      case "Product":
        elementId = "product";
        break;
      case "About Us":
        elementId = "about";
        break;
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
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <MenuItem>
              <img
                src="/Images/logo.png"
                alt="logo of sitemark"
                style={{
                  width: "45px",
                  height: "50px",
                  cursor: "pointer",
                  marginLeft: "20px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                onClick={() => navigateToPage("Home")}
              />
            </MenuItem>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => navigateToPage(page)}
                  sx={{
                    my: 2,
                    color: "#000000",
                    display: "block",
                    fontWeight: "bold",
                    fontSize: "16px",
                    mx: 5,
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {loggedIn ? (
                <Link to={getRedirectURL()}>
                  <Avatar
                    src={user?.profile_picture ? user.profile_picture : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="Profile"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                    }}
                  />
                </Link>
              ) : (
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#61B44A",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#4E7F41",
                      },
                      mr: 2, // margin-right for spacing
                    }}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </Box>

            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                ml: "auto",
                color: "black",
              }} // Ensure it aligns to the right
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} >
        <Box
          sx={{
            width: 150,
            height:"100%" ,// Adjust width if needed
            display: "flex",
            flexDirection: "column", // Stack items vertically
            justifyContent: "flex-start",
            alignItems: "flex-start", // Align items to the left
            p: 2,
            backgroundColor: "rgba(196, 218, 208, 1)" // Add padding if needed
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{
              width: "100%",
              mb: 2,
              display: "flex",
              justifyContent: "center",
              
            }}
          >
            <img
              src="/Images/logo.png"
              alt="logo of sitemark"
              style={{
                width: "45px",
                height: "50px",
                cursor: "pointer",
                marginTop: "20px",
                marginBottom: "20px",
              }}
              onClick={() => navigateToPage("Home")}
            />
          </Box>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => navigateToPage(page)}
              sx={{
                my: 1, // Adjust margin as needed
                color: "#000000",
                display: "block",
                fontWeight: "bold",
                fontSize: "16px",
                width: "100%",
                textAlign: "left", // Ensure text is aligned to the left
              }}
              style={{ cursor: "pointer" }}
            >
              {page}
            </Button>
          ))}
          <Box
            sx={{ display: { xs: "flex", md: "none" }, mt: 10, width: "100%" ,}}
          >
            {loggedIn ? (
              <Link to={getRedirectURL()}>
                <Avatar
                  src={user?.profile_picture || "/Images/profile_pic.jpg"}
                  alt="Profile"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                  }}
                />
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#61B44A",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#4E7F41",
                    },
                    width: "100%",
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
