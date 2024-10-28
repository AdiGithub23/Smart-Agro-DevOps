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

const NotificationSLT = () => {
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message: "Please provide me the package details with all the features...",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 2,
  //     message: "Please provide me the package details with all the features...",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 3,
  //     message: "Please provide me the package details with all the features...",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 4,
  //     message: "Please provide me the package details with all the features...",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 5,
  //     message:
  //       "Please provide me the package details with all the features....",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 6,
  //     message: "Please provide me the package details with all the features...",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  //   {
  //     id: 7,
  //     message:
  //       "Please provide me the package details with all the features....",
  //     time: "June 03 09:20",
  //     unread: true,
  //   },
  // ]);

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
          .slice(0, 7);

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

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1275px)");
  const isDesktop = !isMobile && !isTablet;
  const isNestHubMax = useMediaQuery(
    "(max-width: 1500px) and (min-width: 1020px)"
  );
  const isNestHub = useMediaQuery("(max-width: 1024px) and (min-width: 980px)");
  const isSurfacePro7 = useMediaQuery(
    "(max-width: 1370px) and (min-width: 912px)"
  );

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

  // useEffect(() => {
  //   const fetchNotifications = () => {
  //     const newNotification = {
  //       id: notifications.length + 1,
  //       message: "New package details available. Here are the details: ...",
  //       time: new Date().toLocaleString(),
  //       unread: true,
  //     };

  //     setNotifications((prev) => {
  //       const updatedNotifications = [newNotification, ...prev];
  //       return updatedNotifications.length > 7
  //         ? updatedNotifications.slice(0, 7)
  //         : updatedNotifications;
  //     });
  //   };

  //   const interval = setInterval(fetchNotifications, 20000);
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
        right: isMobile ? 1 : isNestHub ? "40px" : "50px",
        top: isMobile ? "60px" :isTablet ? "70px" :isNestHub ? "71px" : "100px",
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
            maxWidth: "500px",
            backgroundColor: "rgba(199, 221, 211)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            overflowY: "auto",
            borderRadius: "15px",
            maxHeight: "calc(100vh - 20px)",
            "@media (max-width: 1280px)": {
              maxWidth: "270px",
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
                      ? `${notification.message.slice(0, 55)}...`
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

export default NotificationSLT;
