// src/components/Topbar.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Topbar = () => {
  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}></Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
