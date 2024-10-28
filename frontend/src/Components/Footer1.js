import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Slide, Box } from '@mui/material';
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";

function Footer1() {
  const [showFooter, setShowFooter] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const footerStyle = {
    width: "100%", // Make the footer full width
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    padding: "0px",
   
    marginTop:"10px",
    zIndex: 10,
    backgroundColor: "rgba(143, 186, 166, 0.7)",
    boxShadow: "none",
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowFooter(scrollTop > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "13vh",
      }}
    >
     
      <Slide direction="up" in={showFooter} mountOnEnter unmountOnExit>
        <AppBar sx={{ ...footerStyle, position: "sticky", top: "auto", bottom: 0 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <center>
                <img
                  src="/Images/logo.png"
                  alt="Logo"
                  style={{ width: "40px", height: "auto" }}
                />
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.6rem" : "0.8rem",
                    color: "#000000",
                    marginLeft: {
                      xs: "2px",
                      sm: "120px",
                      md: "20px",
                      lg: "0px",
                    },
                  }}
                >
                  Copyright © 2024 Fazenda. All Rights Reserved. Designed by{" "}
                  <Link
                    href="https://www.sltdigitallab.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                  >
                    SLT Digital Lab
                  </Link>
                </Typography>
              </center>
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
    </Box>
  );
}

export default Footer1;
