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
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const NotificationCA = () => {

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
        const token = localStorage.getItem('token');

        // Fetch from the first API
        const api1Response = await axios.get(`/api/notifications/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch from the second API
        const api2Response = await axios.get(`/api/notifications/receiver/${userId}`);

        const api1Notifications = api1Response.data.success ? api1Response.data.notifications : [];
        const api2Notifications = api2Response.data;

        const combinedNotifications = [...api1Notifications, ...api2Notifications];

        const sortedNotifications = combinedNotifications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          .slice(0, 6);

        setNotifications(sortedNotifications);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 60 seconds
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [userId]);

  // Update the notification to mark it as read
  const markNotificationAsRead = async (notificationId, userId, notificationType) => {
    try {
      if(notificationType=="Message"){
        await axios.put(`/api/notifications/message-read/${userId}/${notificationId}`);
      }else{
        await axios.put(`/api/notifications/read/${userId}/${notificationId}`);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

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
  //   {
  //     id: 6,
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
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const isNestHubMax = useMediaQuery(
    "(max-width: 1500px) and (min-width: 980px)"
  );

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
  //       return updatedNotifications.length > 6
  //         ? updatedNotifications.slice(0, 6)
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
      markNotificationAsRead(notification.id, userId, notification.notificationType);

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
        right: isMobile ? "1px" : isTablet ? "8PX" : "50px",
        top: isMobile ? "85px" :isNestHubMax ? "130px" : "120px",
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
                {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                  <ListItem
                    key={notification.id}
                    sx={{
                      backgroundColor: notification.isRead ?"inherit" :  "rgba(0, 0, 255, 0.1)",
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
                  {index < notifications.length - 1 && <Divider />} {/* Add horizontal line */}
                  </React.Fragment>
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
          maxWidth: "500px",
          backgroundColor: "rgba(199, 221, 211)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          padding: "10px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 20px)",
          borderRadius: "15px",
         // Light, semi-transparent border
  backdropFilter: "blur(10px)", 
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
        width: "230px",
      }}     
      >No notifications to display</Typography>
    ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
              <ListItem
                key={notification.id}
                sx={{
                  backgroundColor: notification.isRead
                    ?"inherit !important"
                    : "rgba(0, 0, 255, 0.1) !important",
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemText
                  primary={
                    isNestHubMax
                      ? `${notification.message.slice(0, 25)}...`
                      : notification.message.length > 25
                      ? `${notification.message.slice(0, 50)}...`
                      : notification.message
                  }
                  secondary={new Date(notification.createdAt).toLocaleString()}
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />} {/* Add horizontal line */}
                </React.Fragment>
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

export default NotificationCA;
