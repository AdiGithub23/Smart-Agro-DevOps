import React from "react";
import { Box, Container } from "@mui/material";
import Header from "../../Components/InfoCard";
import ChartComponent from "../../Components/Graph";
import NavBar7 from "../../Components/NavBar7";
import Footer2 from "../../Components/Footer2";
import DateTime from "../../Components/DateTime";
import useMediaQuery from "@mui/material/useMediaQuery";

const backgroundStyle = {
  backgroundColor: "#8FBAA6",
  padding: "0px 0px 100px 0px",
  minHeight: "100vh",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -1,
};

const AdminCustomerRealTime = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");

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
          mt: 1,
        }}
      >
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: { xs: "10px", sm: "115px", md: "110px", lg: "80px" },
          }}
        >
          {/* Information cards */}
          <Header />

          <ChartComponent />
        </Box>
      </Container>
      <Footer2 />
      <DateTime />
    </div>
  );
};

export default AdminCustomerRealTime;
