import React, { useState, useEffect } from "react"; // superadmin
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationBox from "./NotificationBox"; // Import the NotificationBox component
import SideBar from "./SideBar"; // Import the SideBar component
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import {
  Container,

  Typography,
  Grid,
  
  CssBaseline,
  InputAdornment,
  TextField,
  Paper,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";

import { jwtDecode } from "jwt-decode";
import { Avatar } from "@mui/material";


const schema = yup.object().shape({
  email: yup
  .string()
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    "Invalid email"
  )
  .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone Number is required"),
  password: yup
    .string()
    // .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .test('password-match', 'Both password fields must be filled to change password', function(value) {
      return (!!value && !!this.parent.confirmPassword) || (!value && !this.parent.confirmPassword);
    }),
  confirmPassword: yup
    .string()
    // .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
    }),
});

export default function NavBar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const [initialValues, setInitialValues] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    adminId: 1,
    address: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setIsNotificationBoxOpen(!isNotificationBoxOpen);
  };

  const handleNotificationBoxClose = () => {
    setNotificationAnchorEl(null);
    setIsNotificationBoxOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleNavigation = (page) => {
    navigate(page);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to decode token:", error);
      };
    }
    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("user data fetched: ", response.data);

        const userData = response.data;
        setInitialValues({
          email: userData.email || "",
          phoneNumber: userData.phone_number || "",
          password: "",
          confirmPassword: "",
          fullName: userData.full_name || "",
          companyName: userData.company || "",
          adminId: userData.adminId || "",
          address: userData.address || "",
        });
        console.log("Initial Values: ", initialValues);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitForm = async (values, { resetForm }) => {
    console.log("handleSubmitForm function triggered !!!");
    // try {
    //   await schema.validate(values, { abortEarly: false });
    // } catch (validationError) {
    //   console.log("Validation errors: ", validationError.errors);
    //   setSuccessMessage(validationError.errors.join(". "));
    //   setTimeout(() => {
    //     setSuccessMessage("");
    //   }, 3000);
    //   return;
    // }
    try {
      const allUsers = await axios.get(`/api/user/`);
      console.log("allUsers data fetched: ", allUsers.data);
      const allEmails = allUsers.data.map(user => user.email);
      console.log("allEmails: ", allEmails);
      const currentEmail = initialValues.email; 
      if (allEmails.includes(values.email) && values.email !== currentEmail) {
        alert("This email is already registered. Please use a different email.")
        // setSuccessMessage("This email is already registered. Please use a different email.");
        // setTimeout(() => {
        //   setSuccessMessage("");
        // }, 2000);
        return; 
      }

      const formData = {
        full_name: values.fullName,
        address: values.address,
        email: values.email,
        // password: values.password,
        phone_number: values.phoneNumber,
        user_role: "super-admin",
        company: values.companyName,
        profile_picture: null,
      };
      // Include the password only if it has been provided
      if (values.password && values.confirmPassword) {
        formData.password = values.password;
      }
      console.log("Try Block Values  : ", values);
      console.log("Try Block FromData: ", formData);
      console.log("Matched Properties");

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/user/1`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sent Request");
      console.log("User created successfully:", response.data);
      // resetForm();
      
      const userData = response.data;
      setInitialValues({
        email: userData.email || "",
        phoneNumber: userData.phone_number || "",
        password: "",
        confirmPassword: "",
        fullName: userData.full_name || "",
        companyName: userData.company || "",
        adminId: userData.adminId || "",
        address: userData.address || "",
      });

      alert("The changes are saved successfully")
      // setSuccessMessage("The changes are saved successfully");
      // setTimeout(() => {
      //   setSuccessMessage("");
      // }, 3000);
    } catch (error) {
      // const formData = {
      //   full_name: values.fullName,
      //   address: values.address,
      //   email: values.email,
      //   password: values.password,
      //   phone_number: values.phoneNumber,
      //   user_role: "super-admin",
      //   company: values.companyName,
      //   profile_picture: null,
      // };
      // console.log("Catch Block FromData: ", values)
      // console.log("Catch Block FromData: ", formData)
      console.error("Error creating user:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "rgba(143, 186, 166, 1)", color: "#000", zIndex: 1100 }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                top: theme.spacing(2),
                left: theme.spacing(2),
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
           
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleClickOpen}
              color="inherit"
            >
              <Avatar
                    src={user?.profile_picture ? user.profile_picture : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                    alt="Profile"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                    }}
                  />
            </IconButton>
            <Dialog open={open} onClose={handleClose} maxWidth="sm"  sx={{
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      backgroundColor: "rgba(199, 221, 211)",
    },
  }} fullWidth>
        
        <DialogContent>


        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(143, 186, 166, 0.5)"
            
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              width: "100%",
             backgroundColor: "rgba(143, 186, 166, 0.0)"
            }}
          >
            {successMessage && (
              <div style={{ color: "green", fontWeight: "bold" }}>
                {successMessage}
              </div>
            )}
          
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ maxWidth: 800 }}
            >
              <Formik
                validationSchema={schema}
                validateOnChange={false}
                validateOnBlur={false}
                // onSubmit={(values, { resetForm }) => {
                //   console.log(values);
                //   resetForm();
                // }}
                onSubmit={handleSubmitForm}
                initialValues={initialValues}
                enableReinitialize={true}
                // initialValues={{
                //   email: '',
                //   phoneNumber: '',
                //   password: '',
                //   confirmPassword: '',
                // }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  resetForm,
                  touched,
                  handleBlur,
                }) => (
                  <Container component="main" maxWidth="xs">
                    <Box
                      sx={{
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255,)",
                      }}
                    >
                      <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                          marginTop: {
                            xs: "10px",
                            sm: "1px",
                            md: "5px",
                            lg: "1px",
                          },
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              marginTop: {
                                xs: "5px",
                                sm: "5px",
                                md: "5px",
                                lg: "5px",
                              },
                            }}
                          >
                            <Typography gutterBottom>Email*</Typography>
                            <TextField
                              fullWidth
                              id="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                              variant="outlined"
                              placeholder="Email"
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
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                                "&:-webkit-autofill": {
                                  WebkitBoxShadow:
                                    "0 0 0 1000px rgba(199, 221, 211) inset",
                                  WebkitTextFillColor: "black",
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{
                              marginTop: {
                                xs: "20px",
                                sm: "5px",
                                md: "5px",
                                lg: "5px",
                              },
                            }}
                          >
                            <Typography gutterBottom>Phone Number*</Typography>
                            <TextField
                              fullWidth
                              id="phoneNumber"
                              name="phoneNumber"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.phoneNumber && !!errors.phoneNumber
                              }
                              helperText={
                                touched.phoneNumber && errors.phoneNumber
                              }
                              variant="outlined"
                              placeholder="Phone Number"
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
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                                "&:-webkit-autofill": {
                                  WebkitBoxShadow:
                                    "0 0 0 1000px rgba(199, 221, 211) inset",
                                  WebkitTextFillColor: "black",
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{
                              marginTop: {
                                xs: "20px",
                                sm: "30px",
                                md: "5px",
                                lg: "10px",
                              },
                            }}
                          >
                            <Typography gutterBottom>
                              Change Password
                            </Typography>
                            <TextField
                              fullWidth
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.password && !!errors.password}
                              helperText={touched.password && errors.password}
                              variant="outlined"
                              placeholder="Change Password"
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
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                                "&:-webkit-autofill": {
                                  WebkitBoxShadow:
                                    "0 0 0 1000px rgba(199, 221, 211) inset",
                                  WebkitTextFillColor: "black",
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{
                              marginTop: {
                                xs: "20px",
                                sm: "30px",
                                md: "5px",
                                lg: "10px",
                              },
                            }}
                          >
                            <Typography gutterBottom>
                              Confirm Password
                            </Typography>
                            <TextField
                              fullWidth
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.confirmPassword &&
                                !!errors.confirmPassword
                              }
                              helperText={
                                touched.confirmPassword &&
                                errors.confirmPassword
                              }
                              variant="outlined"
                              placeholder="Confirm Password"
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
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                                "&:-webkit-autofill": {
                                  WebkitBoxShadow:
                                    "0 0 0 1000px rgba(199, 221, 211) inset",
                                  WebkitTextFillColor: "black",
                                  transition:
                                    "background-color 5000s ease-in-out 0s",
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle confirm password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                      edge="end"
                                    >
                                      {showConfirmPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            md={4}
                            sx={{
                              textAlign: "center",
                              marginTop: {
                                xs: "20px",
                                sm: "30px",
                                md: "10px",
                                lg: "30px",
                              },
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              style={{ width: "100%" }}
                              onClick={handleSubmit}
                            >
                              Save
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            md={4}
                            sx={{
                              textAlign: "center",
                              marginTop: {
                                xs: "20px",
                                sm: "30px",
                                md: "10px",
                                lg: "30px",
                              },
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => resetForm()}
                              style={{ width: "100%" }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Container>
                )}
              </Formik>
            </Grid>
          </Paper>
        </Box>



          {/* The profile content renders here */}
        </DialogContent>
      </Dialog>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <SideBar open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <NotificationBox
        anchorEl={notificationAnchorEl}
        open={isNotificationBoxOpen}
        onClose={handleNotificationBoxClose}
      />
    </Box>
  );
}
