import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Grid } from "@mui/material";
import Header from "../../Components/InfoCard";
import ChartComponent from "../../Components/Graph";
import Footer2 from "../../Components/Footer2";
import DateTime from "../../Components/DateTime";
import NavBar6 from "../../Components/NavBar6";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const ManagerRealTime = () => {
 
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    padding: isMobile ? "0px 20px 100px 0px" : "0px 0px 100px 0px",
    minHeight: "100vh",
    width: "100%",
    position: "absolute",  
    top: 0,
    left: 0,
    zIndex: -1, 
  };
  return (
    <div style={backgroundStyle}>
     
      <Container
        component="main"
        maxWidth={false}
        sx={{
          width: { xs: "100%", sm: "95%", md: "95%", lg: "90%" },

          height: "auto",
          display: "flex",
          flexDirection: "column",
          marginRight: "0px",
          mt: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: { xs: "30px", sm: "130px", md: "120px", lg: "80px" },
          }}
        >
          {/*---------------------infomation card-----------------*/}
          <Header />

          
                {/*-----------------------Chart--------------*/}
          
                <ChartComponent />
                </Box>  
      </Container>
      <DateTime />
      <Footer2 />
    </div>
  );
};

export default ManagerRealTime;
