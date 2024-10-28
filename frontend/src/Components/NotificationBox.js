import React, { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Collapse from "@mui/material/Collapse";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const NotificationBox = ({ anchorEl, open, onClose }) => {
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message: "Notification 1",
  //     fullMessage: "Full message for Notification 1",
  //     receivedAt: new Date(),
  //     isRead: false,
  //   },
  //   {
  //     id: 2,
  //     message: "Notification 2",
  //     fullMessage: "Full message for Notification 2",
  //     receivedAt: new Date(),
  //     isRead: true,
  //   },
  //   {
  //     id: 3,
  //     message: "Notification 3",
  //     fullMessage: "Full message for Notification 3",
  //     receivedAt: new Date(),
  //     isRead: false,
  //   },
  //   {
  //     id: 4,
  //     message: "Notification 4",
  //     fullMessage: "Full message for Notification 4",
  //     receivedAt: new Date(),
  //     isRead: true,
  //   },
  //   {
  //     id: 5,
  //     message: "Notification 5",
  //     fullMessage: "Full message for Notification 5",
  //     receivedAt: new Date(),
  //     isRead: false,
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
          .slice(0, 5);

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

  
  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );

    const clickedNotification = notifications.find(notification => notification.id === id);

  if (clickedNotification && !clickedNotification.isRead) {
    // Mark notification as read in the backend
    markNotificationAsRead(id, userId, clickedNotification.notificationType);
  }
  
    setExpandedNotificationId(expandedNotificationId === id ? null : id);
    
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          width: 300,
          maxHeight: "80vh",
          overflowY: "auto",
        },
      }}
    >
      <Paper sx={{ padding: 2, backgroundColor: "rgba(199, 221, 211)" }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
      <Typography
      sx={{
        fontSize: "18px",
        color: "gray",
        textAlign: "center",  
      }}
      >No notifications to display</Typography>
    ) : (
        <List>
          {notifications.map((notification) => (
            <Box key={notification.id}>
              <ListItem
                button
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  bgcolor: notification.isRead
                    ? "inherit"
                    : "rgba(0, 0, 255, 0.1)",
                }}
              >
                <ListItemText
                  primary={notification.notificationTitle}
                  // primary={notification.notificationType}
                  secondary={new Date(notification.createdAt).toLocaleString()} 
                />
              </ListItem>
              <Collapse
                in={expandedNotificationId === notification.id}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 2 }}>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                </Box>
              </Collapse>
              <Divider />
            </Box>
          ))}
        </List>
    )}
      </Paper>
    </Popover>
  );
};

export default NotificationBox;
