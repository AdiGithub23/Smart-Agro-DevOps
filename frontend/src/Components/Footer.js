import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// Function component for the footer
function Footer() {
  // Styles for the footer container
  const footerStyle = {
    position: "relative", // Allows positioning of children relative to this element
    backgroundImage: "url(/Images/footer.png)", // Background image for the footer
    backgroundSize: "cover", // Ensures the background image covers the entire container
    backgroundPosition: "center", // Centers the background image
    backgroundRepeat: "no-repeat", // Prevents the background image from repeating
    minHeight: "400px", // Minimum height of the footer
    display: "flex", // Uses flexbox for child element alignment
    flexDirection: "column", // Aligns children in a column
    justifyContent: "center", // Centers children vertically
    alignItems: "center", // Centers children horizontally
    overflow: "hidden", // Hides any overflow content
    backdropFilter: "blur(1000px)", // Adds a blur effect to the background
    WebkitBackdropFilter: "blur(1000px)", // Adds the same blur effect for Safari
    padding: "20px", // Adds padding around the content
  };

  // Styles for the gradient overlay
  const gradientOverlayStyle = {
    position: "absolute", // Positions the overlay absolutely within the container
    top: 0, // Aligns the overlay to the top
    left: 0, // Aligns the overlay to the left
    width: "100%", // Makes the overlay span the entire width
    height: "100%", // Makes the overlay span the entire height
    background: "linear-gradient(to bottom, #25382c, transparent)", // Gradient from dark green to transparent
    zIndex: 1, // Ensures the gradient is above the background but below the text
  };

  // Styles for the "FAZENDA" text
  const textStyle = {
    position: "relative", // Positions the text relative to its container
    fontWeight: "bold", // Makes the text bold
    fontSize: {xs:"4rem",sm:"10rem",md:"12rem"}, // Large font size for the text
    color: "transparent", // Makes the text color transparent
    backgroundImage: "url(/Images/footer.png)", // Uses the background image for the text
    backgroundClip: "text", // Clips the background to the text
    WebkitBackgroundClip: "text", // Ensures background clip works in Safari
    backgroundSize: "cover", // Ensures the background image covers the text
    backgroundPosition: "center", // Centers the background image within the text
    zIndex: 2, // Ensures the text is above the gradient and background
    overflow: "hidden", // Hides any overflow content
    marginTop: "40px", // Adds margin to the top of the text
  };

  // Styles for the logo image
  const logoStyle = {
    marginTop: "20px", // Adds margin to the top of the logo
    zIndex: 2, // Ensures the logo is above the gradient
    width: "150px", // Sets the width of the logo
    height: "auto", // Maintains the aspect ratio of the logo
  };

  // Styles for the copyright text
  const copyrightStyle = {
    marginTop: "10px", // Adds margin to the top of the copyright text
    fontSize: "1rem", // Sets the font size of the copyright text
    color: "#ffffff", // Sets the color of the text to white
    zIndex: 2, // Ensures the text is above the gradient
  };

  // The JSX structure of the footer component
  return (
    <Box sx={footerStyle}>
      <Box sx={gradientOverlayStyle} />
      <Typography variant="h2" sx={textStyle}>
        FAZENDA
      </Typography>
      <img src="/Images/logo.png" alt="Logo" style={logoStyle} />
      <Typography sx={copyrightStyle}>
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
    </Box>
  );
}

export default Footer;
