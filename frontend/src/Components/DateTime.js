import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";

export default function DateTime() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Box
      position="fixed"
      bottom={isMobile ? 30 : isTablet ? 30 : 20}
      right={isMobile ? 10 : isTablet ? 15 : 20}
      sx={{
        backgroundColor: "rgba(143, 186, 166, 1)",
        padding: isMobile ? "4px 8px" : "8px 16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
        zIndex: 9999,
      }}
    >
      {currentDateTime.toLocaleString()}
    </Box>
  );
}
