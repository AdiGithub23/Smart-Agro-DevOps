import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Container,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import NavBar6 from "../../Components/NavBar6.js";
import Footer1 from "../../Components/Footer1.js";
import DateTime from "../../Components/DateTime.js";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import SourceIcon from "@mui/icons-material/Source";
import CreateIcon from "@mui/icons-material/Create";
import { Formik } from "formik";
import * as Yup from "yup";
import ChatBox from "../../Components/ChatBox.js";
import axios from "axios";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Footer2 from "../../Components/Footer2.js";

const availableUserIds = ["CA 01", "CA 02", "CA 03", "CA 04"];

const availableUserRoles = ["Customer Admin"];
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  address: Yup.string(),
  subject: Yup.string(),
  message: Yup.string().required("Message is required"),
});
const textFieldStyles = {
  
};

export default function ManagerMessage() {
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [users, setUsers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [openCompose, setOpenCompose] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const [composeData, setComposeData] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    userID: "",
    userRole: "Customer Admin", // Default to the first user role
  });
  const handleDelete = (userId) => {
    setSelectedItemForDelete(userId);
    setOpenDelete(true);
  };
  const confirmDelete = () => {
    if (selectedItemForDelete) {
      setUsers(users.filter((user) => user.id !== selectedItemForDelete));
    }
    setOpenDelete(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleExpand = (userId) => {
    setExpandedMessage(expandedMessage === userId ? null : userId);
  };
  const handleView = (user) => {
    console.log("User Messages being viewed:", user);
    setSelectedMessage(user);
    setOpenView(true);
  };
  const handleCloseView = () => {
    setOpenView(false);
    setReply("");
    fetchUserAndMessages();
  };
  const handleSendReply = () => {
    if (reply.trim()) {
      console.log(`Reply to ${selectedMessage.name}: ${reply}`);
      setReply("");
      handleCloseView();
    }
  };


  // useEffect(() => {
  //   console.log("composeData updated: ", composeData);
  // }, [composeData]);
  const fetchUserAndMessages = async () => {
    try {
      // Fetch Me
      const token = localStorage.getItem("token");
      const userResponse = await axios.get(
        "/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Current User: ", userResponse.data);
      const userId = userResponse.data.id;
      const createdBy = userResponse.data.createdById;
      setCurrentUserId(userId);

      // Fetch All Conversations with Unique Users
      const messagesResponse = await axios.get(
        "/api/messages/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Messengers: ", messagesResponse.data);
      setUsers(messagesResponse.data);

      // Fetch Customer-Admin Users
      const customerAdmins = await axios.get(
        "/api/user/customer-admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("All Customer-Admins: ", customerAdmins.data);

      // Filter Customer-Admins whose id matches createdById
      const createdCustomer = customerAdmins.data.filter(
        (admin) => admin.id === createdBy
      );
      console.log("Filtered Created Customer-Admin: ", createdCustomer);
      setAllCustomers(createdCustomer);

      // Reset fetch trigger
      setShouldFetchData(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };
  useEffect(() => {
    // const fetchUserAndMessages = async () => {
    //   try {
    //     // Fetch Me
    //     const token = localStorage.getItem("token");
    //     const userResponse = await axios.get(
    //       "/api/user/me",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     console.log("Current User: ", userResponse.data);
    //     const userId = userResponse.data.id;
    //     const createdBy = userResponse.data.createdById;
    //     setCurrentUserId(userId);

    //     // Fetch All Conversations with Unique Users
    //     const messagesResponse = await axios.get(
    //       "/api/messages/conversations",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     console.log("Messengers: ", messagesResponse.data);
    //     setUsers(messagesResponse.data);

    //     // Fetch Customer-Admin Users
    //     const customerAdmins = await axios.get(
    //       "/api/user/customer-admins",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     console.log("All Customer-Admins: ", customerAdmins.data);

    //     // Filter Customer-Admins whose id matches createdById
    //     const createdCustomer = customerAdmins.data.filter(
    //       (admin) => admin.id === createdBy
    //     );
    //     console.log("Filtered Created Customer-Admin: ", createdCustomer);
    //     setAllCustomers(createdCustomer);

    //     // Reset fetch trigger
    //     setShouldFetchData(false);
    //   } catch (err) {
    //     console.error("Failed to fetch data:", err);
    //   }
    // };

    fetchUserAndMessages();
  }, [shouldFetchData]);


  const handleComposeClick = () => {
    const nextId = `C${String(users.length + 1).padStart(3, "0")}`; // Calculate next ID based on the sequence
    setComposeData((prevState) => ({
      ...prevState,
      id: nextId, // Set the new ID for the compose data
    }));
    setOpenCompose(true);
  };
  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(name, value);

    // If the userID is changed, fetch the corresponding user data
    if (name === "userID") {
      fetchUserData(value);
    }
  };
  const fetchUserData = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = response.data;
      console.log("Selected User data fetched: ", userData);

      // Update form fields with the fetched user data
      setComposeData((prevState) => ({
        ...prevState,
        name: userData.full_name || "",
        phone: userData.phone_number || "",
        email: userData.email || "",
        address: userData.address || "",
      }));
      console.log("composeData: ", composeData);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };
  // const handleSendCompose = async () => {
  //   try {
  //     const { userID: receiverId, message: content } = composeData;
  //     // Ensure userID and message are set
  //     if (!receiverId || !content) {
  //       console.error("Receiver ID and message are required.");
  //       return;
  //     }

  //     const token = localStorage.getItem("token");
  //     const response = await axios.post(
  //       "/api/messages",
  //       { receiverId, content },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setUsers((prevUsers) => [...prevUsers, response.data]);
  //     console.log("handleSendCompose Okay: ", composeData);
  //     setOpenCompose(false);

  //     // Trigger data re-fetch
  //     setShouldFetchData(true);
  //   } catch (err) {
  //     console.log("handleSendCompose Error:", composeData);
  //     console.error("Failed to send message:", err);
  //     // alert('Failed to send message');
  //   }
  // };
  const handleSendCompose = async (formValues) => {
    try {
      // Get values from form submission
      const receiverId = composeData.userID;
      const content = formValues.message;

      if (!receiverId) {
        alert('Please select a receiver');
        return false;
      }
      if (!content) {
        alert('Please enter a message');
        return false;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return false;
      }
      const response = await axios.post(
        '/api/messages',
        { receiverId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Message sent successfully!');
      alert('Message sent successfully!');
      
      // Update UI and close dialog
      // setUsers(prevUsers => {
      //   const userExists = prevUsers.some(user => user.id === response.data.id);
      //   return userExists ? prevUsers : [...prevUsers, response.data];
      // });      
      handleCloseCompose();
      setShouldFetchData(true);
      return true;

    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response) {
        alert(`Failed to send message: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        alert('Network error. Please check your connection.');
      } else {
        alert('Failed to send message. Please try again.');
      }
      return false;
    }
  };

  const handleCloseCompose = () => {
    setOpenCompose(false);
    setComposeData({
      id: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
      userID: availableUserIds[0],
      userRole: availableUserRoles[0],
    });
    fetchUserAndMessages();
  };
  

  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div
      style={{
        backgroundColor: "#8FBAA6",
        padding: "0px 0px 100px 0px",
        minHeight: "100vh",
        width: "100%",
        position: "absolute",  
        top: 0,
        left: 0,
        zIndex: -1, 
      }}
    >
      <Container
        component="main"
        maxWidth={false}
        sx={{
          width: { xs: "100%", sm: "90%" },
          height: "auto",
          display: "flex",
          flexDirection: "column",
          marginRight: "0px",
        }}
      >
        
        {(isMobile || isTablet) && (
          <Box
            sx={{
              position: "absolute",
              marginTop: { xs: 12, sm: 12, md: 13, lg: 78 }, 
              right: { xs: 10, sm: 10, md: 16, lg: 16 },
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={handleComposeClick}
            >
              Compose
            </Button>
          </Box>
        )}
        {isDesktop && (
          <Box
            display="flex"
            justifyContent="flex-end"
            marginBottom={1}
            marginTop={13}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={handleComposeClick}
            >
              Compose
            </Button>
          </Box>
        )}       
        {/* Message Table - Done */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "160px", sm: "150px", md: "160px", lg: "5px" },
            marginLeft: { xs: "0px", sm: "110px", md: "80px", lg: "100px" },
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {" "}
          {isDesktop ? (
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "rgba(199, 221, 211)" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Customer-Admin
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Phone No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Customer Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Last Message
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{"UID"+user.id}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.messages && user.messages.length > 0
                          ? user.messages.at(-1).content
                          : "No messages"}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="View Message">
                          <IconButton
                            variant="contained"
                            marginRight="2px"
                            onClick={() => handleView(user)}
                            color="success"
                          >
                            <SourceIcon />
                          </IconButton>
                        </Tooltip>
                        {/*----<Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => handleDelete(user.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>----*/}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={2}>
              {paginatedUsers.map((user) => (
                <Grid item xs={12} sm={12} md={12} lg={4} key={user.id}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "rgba(199, 221, 211)" }}
                  >
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>User ID</strong>
                          </TableCell>{" "}
                          <TableCell>{"UID"+user.id}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong> Customer-Admin</strong>{" "}
                          </TableCell>
                          <TableCell>{user.full_name}</TableCell>
                        </TableRow>

                    <>
                            <TableRow>
                              <TableCell>
                                <strong>Address</strong>
                              </TableCell>
                              <TableCell>{user.address}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong>Phone No</strong>
                              </TableCell>{" "}
                              <TableCell>{user.phone_number}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong> Customer Email</strong>
                              </TableCell>{" "}
                              <TableCell>{user.email}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong> Last Message</strong>
                              </TableCell>{" "}
                              <TableCell>
                                {" "}
                                {user.messages && user.messages.length > 0
                                  ? user.messages.at(-1).content
                                  : "No messages"}
                              </TableCell>
                            </TableRow>
                          </>
                        
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="View Message">
                        <IconButton
                          variant="contained"
                          marginRight="2px"
                          onClick={() => handleView(user)}
                          color="success"
                        >
                          <SourceIcon />
                        </IconButton>
                      </Tooltip>
                      {/*<Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={() => handleDelete(user.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>-----*/}
                      
                    </Box>
                  </TableContainer>
                </Grid>
              ))}
            </Grid>
          )}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(users.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>
        {/* View Message - Done */}
        <div style={{ borderRadius: "20px" }}>
          <Dialog
            open={openView}
            onClose={handleCloseView}
            maxWidth="xs"
            fullWidth
            padding="20px"
            borderRadius="10px"
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "20px",
                backgroundColor: "rgba(199, 221, 211)",
              },
            }}
          >
            <DialogContent dividers>
              {selectedMessage ? (
                <>
                  <strong> {selectedMessage.email}</strong>
                  <p>
                    User ID: <strong>{"UID"+selectedMessage.id}</strong>
                  </p>
                  <p>
                    User Name:<strong> {selectedMessage.full_name}</strong>
                  </p>
                  <p>
                    User Role:<strong> {selectedMessage.user_role}</strong>
                  </p>
                  <p>
                    Company:<strong> {selectedMessage.company}</strong>
                  </p>
                  <ChatBox userId={selectedMessage.id} />
                  {/* <ChatBox user={selectedMessage} />             */}
                </>
              ) : (
                <Typography>No message selected.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseView} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        
        {/* Message Compose */}
        <Dialog
          open={openCompose}
          onClose={handleCloseCompose}
          sx={{
            "& .MuiDialog-paper": {
              width: { xs: "90%", sm: "90%", md: "70%", lg: "40%" }, // Adjust the percentage or use specific units like '600px'
              maxWidth: "none",

              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <Formik
            initialValues={composeData}
            enableReinitialize={true}
            validationSchema={schema}
            // onSubmit={(values, { resetForm }) => {
              
            //   setComposeData((prevState) => ({
            //     ...prevState,
            //     ...values,
            //   }));
            //   handleSendCompose();
            // }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const success = await handleSendCompose(values);
              if (success) {
                handleCloseCompose();
              }
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <DialogTitle>Compose Message</DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sm={2} md={2}>
                      <Typography gutterBottom sx={{ mt: { xs: "10px" } }}>
                        User ID
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={4} md={4}>
                      <FormControl fullWidth error={touched.userID && Boolean(errors.userID)}>
                        <Select
                          name="userID"
                          value={values.userID}
                          onChange={handleComposeChange}
                          // onChange={handleChange}
                        >
                          {allCustomers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                              {"UID"+customer.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={2} md={2}>
                      <Typography gutterBottom sx={{ mt: { xs: "10px" } }}>
                        user Role
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={4} md={4}>
                      <FormControl fullWidth>
                        <Select
                          name="userRole"
                          value={values.userRole}
                          // onChange={handleComposeChange}
                          onChange={handleChange}
                        >
                          {availableUserRoles.map((userRole) => (
                            <MenuItem key={userRole} value={userRole}>
                              {userRole}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom sx={{ mt: { xs: "8px" } }}>
                        Name*
                      </Typography>
                      <TextField
                        name="name"
                        variant="outlined"
                        fullWidth
                        value={values.name}
                        onChange={handleChange}
                        InputProps={{ readOnly: true }} 
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom sx={{ mt: { xs: "8px" } }}>
                        Phone Number*
                      </Typography>
                      <TextField
                        name="phone"
                        variant="outlined"
                        fullWidth
                        value={values.phone}
                        onChange={handleChange}
                        InputProps={{ readOnly: true }} 
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom sx={{ mt: { xs: "8px" } }}>
                        Email*
                      </Typography>
                      <TextField
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={values.email}
                        onChange={handleChange}
                        InputProps={{ readOnly: true }} 
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom>Address</Typography>
                      <TextField
                        name="address"
                        variant="outlined"
                        fullWidth
                        value={values.address}
                        onChange={handleChange}
                        InputProps={{ readOnly: true }} 
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom>Subject</Typography>

                      <TextField
                        name="subject"
                        variant="outlined"
                        fullWidth
                        value={values.subject}
                        onChange={handleChange}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography gutterBottom>Message*</Typography>
                      <TextField
                        name="message"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={values.message}
                        onChange={handleChange}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(199, 221, 211) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                      Send
                    </Button>
                  </DialogActions>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCompose} color="secondary">
                    Cancel
                  </Button>
                  {/* <Button type="submit" color="primary">Send</Button> */}
                </DialogActions>
              </form>
            )}
          </Formik>
        </Dialog>
                      {/*--------------------------------Delete message--------------------*/}

        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete message"}</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this message?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              No
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <DateTime />
      <Footer2 />
    </div>
  );
}