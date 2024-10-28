import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const DeviceStatusButton = ({ status, serialNumber, deviceName, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(); // Call the passed in onClick handler if provided
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        textTransform: "none", // Prevent uppercase transformation
        justifyContent: "flex-start",
        height:"auto",
        width: "100%", // Full width or adjust as needed
        borderRadius: "4px",
        backgroundColor: "rgba(255, 255, 255,0.5)",
        "&:hover": {
          backgroundColor: "#709885", // Change background color to black on hover
        },
      }}
    >
      <CircleIcon style={{ color: status === "Active" ? "green" : "red" }} />
      <Box marginLeft="7px">
        <Typography variant="body1">{deviceName}</Typography>
        <Typography variant="caption">Serial number: {serialNumber}</Typography>
      </Box>
    </Button>
  );
};

export default DeviceStatusButton;
