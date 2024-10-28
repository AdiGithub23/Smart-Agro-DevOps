// NotificationBox.js
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
  IconButton,
  useMediaQuery,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const NotificationDAnalysis = () => {
  const device_id = localStorage.getItem("DeviceID");
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.id);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const response = await axios.get(`/api/notifications/device/${device_id}`);
        const response = await axios.get(`/api/notifications/device/${device_id}/receiver/${userId}`);
        const filteredNotifications = response.data
        .filter(notification => 
          notification.notificationType === 'Analyse Alert'
        ) 
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        .slice(0, 6); 
      setNotifications(filteredNotifications);  
      } catch (err) {
        console.error("Error deleting device:", err);
      }
    };

    fetchNotifications();  

    const interval = setInterval(fetchNotifications, 20000); // Fetch new notifications every 20 seconds

  return () => clearInterval(interval);
  }, [device_id, userId]);

  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message:
  //       "Please provide me the package details with all the features and prices.",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 2,
  //     message:
  //       "Please provide me the package details with all the features and prices.",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },

  //   {
  //     id: 3,
  //     message:
  //       "Please provide me the package details with all the features and prices.",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },

  //   {
  //     id: 4,
  //     message:
  //       "Please provide me the package details with all the features and prices.",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },

  //   {
  //     id: 5,
  //     message:
  //       "Please provide me the package details with all the features and prices.",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },

  //   // Add more initial notifications here if needed
  // ]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [topPosition, setTopPosition] = useState(70);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1275px)");
  const isDesktop = !isMobile && !isTablet;
  const isNestHubMax = useMediaQuery(
    "(max-width: 1500px) and (min-width: 1020px)"
  );

   // Update the notification to mark it as read
   const markNotificationAsRead = async (notificationId, userId) => {
    try {
      await axios.put(`/api/notifications/read/${userId}/${notificationId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setTopPosition(window.scrollY + 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   // Mock function to simulate receiving new notifications
  //   const fetchNotifications = () => {
  //     const newNotification = {
  //       id: notifications.length + 1,
  //       message: "New package details available. Here are the details: ...",
  //       time: new Date().toLocaleString(),
  //       unread: true,
  //     };

  //     setNotifications((prev) => {
  //       const updatedNotifications = [newNotification, ...prev];
  //       const maxLength = isNestHubMax ? 7 : 5;
  //       return updatedNotifications.length > maxLength
  //         ? updatedNotifications.slice(0, maxLength)
  //         : updatedNotifications;
  //     });
  //   };

  //   const interval = setInterval(fetchNotifications, 20000); // Fetch new notifications every 10 seconds
  //   return () => clearInterval(interval);
  // }, [notifications]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      // Mark notification as read in the backend
      markNotificationAsRead(notification.id, userId);

    const updatedNotifications = notifications.map((notif) =>
      notif.id === notification.id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
  }
  };

  const handleClose = () => {
    setSelectedNotification(null);
  };

  const toggleNotificationList = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: isMobile ? "13px" : isTablet ? "10PX" : "30px",
        top: isMobile ? "100px" : isNestHubMax ? "105px" : "110px",
      }}
    >
      {isMobile || isTablet ? (
        <>
          <IconButton onClick={toggleNotificationList}>
            <NotificationsActiveIcon />
          </IconButton>

          <Dialog open={isNotificationOpen} onClose={toggleNotificationList}>
            <DialogTitle>Notifications</DialogTitle>
            <DialogContent>
            {notifications.length === 0 ? (
      <Typography>No notifications to display</Typography>
    ) : (
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      backgroundColor: notification.isRead ? "inherit"
                    : "rgba(0, 0, 255, 0.1)",
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemText
                      primary={
                        notification.message.length > 30
                          ? `${notification.message.slice(0, 30)}...`
                          : notification.message
                      }
                      secondary={new Date(notification.createdAt).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
    )}
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: "rgba(199, 221, 211)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            overflowY: "auto",
            borderRadius: "15px",
            maxHeight: "calc(100vh - 20px)",
            "@media (max-width: 1280px)": {
              maxWidth: "300px",
            },
          }}
        >
          {notifications.length === 0 ? (
      <Typography
      sx={{
        fontSize: "18px",
        color: "gray",
        textAlign: "center",
        width: "250px",
      }}
      >No notifications to display</Typography>
    ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  backgroundColor: notification.isRead
                    ? "inherit !important"
                    : "rgba(0, 0, 255, 0.1) !important",
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemText
                  primary={
                    isNestHubMax
                      ? `${notification.message.slice(0, 25)}...`
                      : notification.message.length > 25
                      ? `${notification.message.slice(0, 30)}.....`
                      : notification.message
                  }
                  secondary={new Date(notification.createdAt).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
    )}
        </Box>
      )}

      <Dialog open={!!selectedNotification} onClose={handleClose}>
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          <Typography>{selectedNotification?.message}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
          {selectedNotification?.createdAt && new Date(selectedNotification.createdAt).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationDAnalysis;
