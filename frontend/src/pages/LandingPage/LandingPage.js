import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import PackagePage from "./PackagePage";
import ContactPage from "./ContactPage";
import Footer from "../../Components/Footer";
import NavBar4 from "../../Components/NavBar4";
import AboutPage from "./AboutPage";
import EnginePage from "./EnginePage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DateTime from "../../Components/DateTime";

function LandingPage() {
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: "url(/Images/Landingpage.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  };

  const navigateToPage = (path) => {
    navigate(path);
  };

  return (
    <div style={backgroundStyle}>
      <NavBar4 />
      <div id="home" className="home">
        <Box sx={{ flexGrow: 1, padding: {xs:"10px",sm:"50px",md:"50px"}, textAlign: "left" }}>
          <Box
            sx={{
              marginTop: "70px",
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
              flexWrap: "wrap",
            }}
          >
            <img
              className="responsive-img"
              src="/Images/logo.png"
              alt="Fazenda Project"
            />
            <img
              className="responsive-img"
              src="/Images/sltlogo.png"
              alt="The EMBRYO Innovation Center"
            />

            <style jsx>
              {`
                .responsive-img {
                  height: auto;
                  max-height: 150px;
                  width: auto;
                  max-width: 100%;
                  margin-left: 25px;
                }

                @media (max-width: 768px) {
                  .responsive-img {
                    max-height: 100px; /* adjust as needed for smaller screens */
                    margin-left: 10px;
                  }
                }

                @media (max-width: 480px) {
                  .responsive-img {
                    max-height: 75px; /* adjust as needed for smaller screens */
                    margin-left: 5px;
                  }
                }
              `}
            </style>
          </Box>

          <Box sx={{ maxWidth: "80%", margin: "20px" }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                mt: 7,
                fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3.5rem" },
                "@media (max-width: 600px)": { fontSize: "1.8rem" },
                letterSpacing: { xs: "0.01rem", sm: "0.05rem", md: "0.02rem" },
                wordSpacing: "0.3rem",
              }}
            >
              Transform Your Farming with SLTMobitel Fazenda Smart Agro
              Solutions
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 3,
                fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              Revolutionize your farm management with cutting-edge IoT
              technology
              <br />
              for optimal productivity and efficiency.
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              marginTop: "50px",
              marginLeft: "21px",
              height: "20px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#61B44A",
                color: "#fff",
                width: "200px", // Custom width
                height: "50px",
                "&:hover": {
                  backgroundColor: "#4E7F41",
                },
              }}
              onClick={() => {
                document.getElementById("engine").scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <Typography varient="h6">Explore More</Typography>
              <ArrowForwardIcon />
            </Button>
          </Box>
        </Box>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            maxWidth: "90%",
            margin: { xs: "2px", sm: "25px", md: "63px" },
            marginTop: 10,
            marginBottom: "30px",
          }}
        >
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
            <Box
  component="img"
  src="/Images/image_1.png"
  alt="Image 3"
  sx={{
    width: "100%",
    height: { xs: "250px", sm: "150px", md: "210px", lg: "290px" },
    objectFit: "cover",
    borderRadius: {xs:"0px",sm:"0px",md:"10px",lg:"0px"}, // Adjust the value as needed
  }}
/>
              
              <br />
              <br />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                IOT Networks
              </Typography>
              <br />
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "justify" }}
              >
                IoT smart farming solutions is a system that is built for
                monitoring the crop field with the help of sensors (light,
                humidity, temperature, soil moisture, crop health, rainfall
                etc.) and automating the irrigation system. The farmers can
                monitor the field conditions from anywhere. They can also select
                between manual and automated options for taking necessary
                actions based on this data.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>

            <Box
            component="img"
            src="/Images/image_2.png"
            alt="Image 2"
            sx={{
             width: "100%", height: {xs:"280px",sm:"150px",md:"210px",lg:"290px"}, objectFit: "cover"
            }}
          />

              
              <br />
              <br />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Artificial Intelligence
              </Typography>
              <br />
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "justify" }}
              >
                Artificial Intelligence technology helps in detecting disease in
                plants, pests and poor nutrition of farms. AI sensors can detect
                and target weeds and then decide which herbicide to apply within
                the region. Artificial Intelligence in agriculture not only
                helps farmers to automate their farming but also shifts to
                precise cultivation for higher crop yield and better quality
                while using fewer resources.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
            <Box
            component="img"
            src="/Images/image_3.png"
            alt="Image 3"
            sx={{
             width: "100%", height: {xs:"280px",sm:"150px",md:"210px",lg:"290px"}, objectFit: "cover",
            }}
          />
              
              <br />
              <br />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Crop Analytics
              </Typography>
              <br />
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "justify" }}
              >
                Organic farming is picking up in Sri Lanka with the
                establishment of new rules and regulations regarding fertilizer
                usage. Hence it has become vital to monitor agriculture and
                apply organic fertilizers as needed. For monitoring, a digital
                solution can be implemented, providing farmers with historical
                crop yield records and forecasts, reducing risk management.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>

      <div id="engine" className="engine">
        <EnginePage />
      </div>

      <div id="product" className="package">
        <PackagePage />
      </div>

      <div id="about" className="about">
        <AboutPage />
      </div>

      <div id="contact" className="contact">
        <ContactPage />
      </div>

      <div>
        <Footer />
      </div>

      <DateTime />
    </div>
  );
}

export default LandingPage;
