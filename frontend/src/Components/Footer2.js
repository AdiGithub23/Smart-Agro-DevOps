import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Slide, Box } from '@mui/material';
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";


function Footer2() {
  const [showFooter, setShowFooter] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");

  const footerStyle = {
    position: "fixed", // Fix the footer at the bottom
    bottom: {
      xs: "0", // margin for extra-small screens
      sm: "0", // margin for small screens
      md: "0", // margin for medium screens
      lg: "0",
    },
    width: "100%", // Make the footer full width
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    
    overflow: "hidden",
    padding: "0px",
    marginBottom: "0px",
    zIndex: 10,
    backgroundColor:"rgba(143, 186, 166, 0.7)",
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
    <Slide direction="up" in={showFooter} mountOnEnter unmountOnExit>
      <AppBar sx={{ ...footerStyle, top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <center>
          <img
        src="/Images/logo.png"
        alt="Logo"
        style={{ width: "40px", height: "auto",  }}
      />
      
            <Typography
        sx={{
          fontSize: isMobile ? "0.6rem" : "0.8rem",
          color: "#000000",
          marginLeft: {
            xs: "2px", // margin for extra-small screens
            sm: "120px", // margin for small screens
            md: "20px", // margin for medium screens
            lg: "0px", // margin for large screens
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
  );
}

export default Footer2;
