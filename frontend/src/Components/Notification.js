// NotificationBox.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "Please provide me the package details with all the features and prices.",
      time: "June 03 09:20",
      unread: true,
    },
    {
      id: 2,
      message:
        "Please provide me the package details with all the features and prices.",
      time: "June 03 09:20",
      unread: true,
    },

    {
      id: 3,
      message:
        "Please provide me the package details with all the features and prices.",
      time: "June 03 09:20",
      unread: true,
    },

    {
      id: 4,
      message:
        "Please provide me the package details with all the features and prices.",
      time: "June 03 09:20",
      unread: true,
    },

    {
      id: 5,
      message:
        "Please provide me the package details with all the features and prices.",
      time: "June 03 09:20",
      unread: true,
    },

    // Add more initial notifications here if needed
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [topPosition, setTopPosition] = useState(70);

  useEffect(() => {
    const handleScroll = () => {
      setTopPosition(window.scrollY + 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Mock function to simulate receiving new notifications
    const fetchNotifications = () => {
      const newNotification = {
        id: notifications.length + 1,
        message: "New package details available. Here are the details: ...",
        time: new Date().toLocaleString(),
        unread: true,
      };

      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev];
        return updatedNotifications.length > 5
          ? updatedNotifications.slice(0, 5)
          : updatedNotifications;
      });
    };

    const interval = setInterval(fetchNotifications, 20000); // Fetch new notifications every 10 seconds
    return () => clearInterval(interval);
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notification.id ? { ...notif, unread: false } : notif
    );
    setNotifications(updatedNotifications);
  };

  const handleClose = () => {
    setSelectedNotification(null);
  };

  return (
    <Box
      sx={{
        width: "300px",
        position: "absolute",
        right: "20px",
        top: "130px",
        border: "2px solid black",
        backgroundColor: "rgba(199, 221, 211)",
        padding: "10px",
        zIndex: 1000,
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{ backgroundColor: notification.unread ? "#f0f0f0" : "#fff" }}
            onClick={() => handleNotificationClick(notification)}
          >
            <ListItemText
              primary={notification.message}
              secondary={notification.time}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={!!selectedNotification} onClose={handleClose}>
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          <Typography>{selectedNotification?.message}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
            {selectedNotification?.time}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notification;
