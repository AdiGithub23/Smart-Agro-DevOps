import React, { useEffect, useState, useRef } from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import {
  Avatar,
  IconButton,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import * as yup from "yup";
import NavBar2 from "../../Components/NavBar2";
import DateTime from "../../Components/DateTime";
import axios from "axios";
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
    //.required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .test('password-match', 'Both password fields must be filled to change password', function(value) {
      return (!!value && !!this.parent.confirmPassword) || (!value && !this.parent.confirmPassword);
    }),
  confirmPassword: yup
    .string()
    //.required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
    }),
  //adminId: yup.string().required("Admin Id is required"),
  fullName: yup.string().required("Full Name is required"),
  companyName: yup.string().required("Company Name is required"),
  address: yup.string().required("Address is required"),
});
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function AdminSLT() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [fileError, setFileError] = useState(""); 
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    profile_picture: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    adminId: "",
    address: "",
  });
  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    backgroundSize: "cover",
    minHeight: "100vh",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };
  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size is too large. Maximum allowed size is 5MB.")
        // setFileError("Image size is too large. Maximum allowed size is 5MB.");
        // setTimeout(() => {
        //   setFileError("");
        // }, 2000);
        setSelectedFile(null); // Reset the selected file
      } else {
        setFileError(""); // Clear any previous file error
        setSelectedFile(file);
      }
    }
  };
  const handleDeleteClick = (setFieldValue) => {
    setSelectedFile(null);  
    setFieldValue("profile_picture", "/Images/profile_pic.jpg");  
  };


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
          profile_picture: userData.profile_picture || "",
          email: userData.email || "",
          phoneNumber: userData.phone_number || "",
          password: "",
          confirmPassword: "",
          fullName: userData.full_name || "",
          companyName: userData.company || "",
          adminId: userData.id || "",
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

      // const formData = {
      //   full_name: values.fullName,
      //   address: values.address,
      //   email: values.email,
      //   // password: values.password,
      //   phone_number: values.phoneNumber,
      //   user_role: "slt-admin",
      //   company: values.companyName,
      //   profile_picture: null,
      // };
      // // Include the password only if it has been provided
      // if (values.password) {
      //   formData.password = values.password;
      // }
      
      const formData = new FormData();
      formData.append("full_name", values.fullName);
      formData.append("address", values.address);
      formData.append("email", values.email);
      formData.append("phone_number", values.phoneNumber);
      formData.append("user_role", "slt-admin");
      formData.append("company", values.companyName);
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      } else {
        formData.append("profile_picture", values.profile_picture); 
      }
      if (values.password && values.confirmPassword) {
        formData.append("password", values.password);
      }
      console.log("Try Block Values  : ", values);
      console.log("Try Block FromData: ", formData);
      console.log("Matched Properties");

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/user/${values.adminId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Sent Request");
      console.log("User created successfully:", response.data);
      // resetForm();
      
      const userData = response.data;
      setInitialValues({
        profile_picture: userData.profile_picture || "",
        email: userData.email || "",
        phoneNumber: userData.phone_number || "",
        password: "",
        confirmPassword: "",
        fullName: userData.full_name || "",
        companyName: userData.company || "",
        adminId: userData.id || "",
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
      //   user_role: "slt-admin",
      //   company: values.companyName,
      //   profile_picture: null,
      // };
      // console.log("Catch Block FromData: ", values)
      // console.log("Catch Block FromData: ", formData)
      console.error("Error creating user:", error);
    }
  };


  return (
    <div style={backgroundStyle}>
      <NavBar2 />
      <Box sx={{ display: "flex" }}>
        <Box
          component="form"
          noValidate
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: { xs: "32px", sm: "70px", md: "65px", lg: "120px" },
            padding: { xs: "0px", sm: "10px", md: "10px", lg: "5px" },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              marginLeft: { xs: "0px", sm: "170px", md: "170px", lg: "200px" },
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            {successMessage && (
              <div style={{ color: "green", fontWeight: "bold" }}>
                {successMessage}
              </div>
            )}          
            {fileError && <div style={{ color: "red" }}>{fileError}</div>}
          
        
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ maxWidth: 800, width: "100%" }}
            >
              <Formik
                validationSchema={schema}
                validateOnChange={false}
                validateOnBlur={false}
                // onSubmit={(values, { resetForm }) => {
                //   console.log(values);
                //   resetForm();
                // }}
                // initialValues={{
                //   email: '',
                //   phoneNumber: '',
                //   password: '',
                //   confirmPassword: '',
                //   fullName: '',
                //   companyName: '',
                //   adminId: '',
                //   address: '',
                // }}
                onSubmit={handleSubmitForm}
                initialValues={initialValues}
                enableReinitialize={true}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  resetForm,
                  touched,
                  handleBlur,
                  setFieldValue,
                }) => (
                  <Grid item xs={12}>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{
                        marginTop: {
                          xs: "20px",
                          sm: "20px",
                          md: "15px",
                          lg: "5px",
                        },
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          sm={5}
                          md={3}
                          lg={3}
                          display="flex"
                          justifyContent="center"
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            position="relative"
                          >
                            <Avatar
                              src={
                                selectedFile
                                  ? URL.createObjectURL(selectedFile)  
                                  : values.profile_picture           
                                    ? `/${values.profile_picture}`
                                    // : "/Images/profile_pic.jpg"
                                    : "/broken-image.jpg"
                              }
                              alt="User Profile Picture" 
                              sx={{
                                width: { xs: 80, sm: 100 },
                                height: { xs: 80, sm: 100 },
                              }}
                            />

                            <Box
                              position="absolute"
                              bottom={0}
                              display="flex"
                              justifyContent="center"
                              width="100%"
                            >
                              <IconButton
                                aria-label="edit"
                                onClick={handleEditClick}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton aria-label="delete" onClick={() => handleDeleteClick(setFieldValue)} >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/png, image/jpeg, image/jpg"
                          // onChange={(e) => {
                          //   console.log(e.target.files[0]);
                          //   const file = e.target.files[0];
                          //   setSelectedFile(file);
                          // }}
                          onChange={handleFileChange}
                        />
                        <Grid
                          item
                          xs={12}
                          sm={7}
                          md={3}
                          lg={3}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Admin ID</Typography>
                          <TextField
                            fullWidth
                            id="adminId"
                            name="adminId"
                            variant="outlined"
                            value={`UID ${values.adminId}`}
                            disabled
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.adminId && !!errors.adminId}
                            helperText={touched.adminId && errors.adminId}
                            placeholder="ADMIN 01"
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
                          sm={12}
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Full Name*</Typography>
                          <TextField
                            fullWidth
                            id="fullName"
                            name="fullName"
                            variant="outlined"
                            value={values.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.fullName && !!errors.fullName}
                            helperText={touched.fullName && errors.fullName}
                            placeholder="Full Name"
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
                          sm={12}
                          md={4}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
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
                          sm={6}
                          md={4}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Company Name*</Typography>
                          <TextField
                            fullWidth
                            id="companyName"
                            name="companyName"
                            variant="outlined"
                            value={values.companyName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.companyName && !!errors.companyName}
                            helperText={
                              touched.companyName && errors.companyName
                            }
                            placeholder="Company Name"
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
                          sm={6}
                          md={4}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
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
                            error={touched.phoneNumber && !!errors.phoneNumber}
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
                          sm={12}
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Address*</Typography>
                          <TextField
                            fullWidth
                            id="address"
                            name="address"
                            multiline
                            maxRows={5}
                            variant="outlined"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address && !!errors.address}
                            helperText={touched.address && errors.address}
                            placeholder="Address"
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
                          sm={6}
                          md={3}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Change Password</Typography>
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
                          sm={6}
                          md={3}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "15px",
                              md: "10px",
                              lg: "5px",
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
                              touched.confirmPassword && errors.confirmPassword
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

                        <Grid container justifyContent="flex-end" spacing={2}>
                          <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            sx={{
                              marginTop: {
                                xs: "30px",
                                sm: "55px",
                                md: "46px",
                                lg: "50px",
                              },
                              ml: 2,
                              marginBottom: {
                                xs: "40px",
                                sm: "0px",
                                md: "15px",
                                lg: "0px",
                              },
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={handleSubmit}
                            >
                              Save
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            sx={{
                              marginTop: {
                                xs: "30px",
                                sm: "55px",
                                md: "46px",
                                lg: "50px",
                              },
                              ml: 2,
                              marginBottom: {
                                xs: "40px",
                                sm: "0px",
                                md: "15px",
                                lg: "0px",
                              },
                            }}
                          >
                            <Link href="/adminsltdashboard">
                              <Button variant="outlined" fullWidth>
                                Cancel
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Formik>
            </Grid>
          </Paper>
        </Box>
      </Box>
      <DateTime />
    </div>
  );
}
