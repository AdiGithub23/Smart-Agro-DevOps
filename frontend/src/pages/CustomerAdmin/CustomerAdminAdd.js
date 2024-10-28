import React, { useState, useRef, useEffect } from "react";
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
import NavBar7 from "../../Components/NavBar7";
import DateTime from "../../Components/DateTime";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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
  adminId: yup.string(),
  // .required('Admin Id is required'),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters"),
  fullName: yup.string().required("Full Name is required"),
  companyName: yup.string(),
  // companyName: yup.string().required('Company Name is required'),
  assignedDevices: yup.string(),
  // assignedDevices: yup.string().required('Assigned devices is required'),
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

export default function CustomerAdminAdd() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nextUserId, setNextUserId] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    const fetchNextUserId = async () => {
      try {
        const response = await axios.get(
          "/api/user/next-id"
        );
        console.log("Next User: ", response.data.nextUserId);
        setNextUserId("UID" + response.data.nextUserId);
      } catch (error) {
        console.error("Error fetching next user ID:", error);
      }
    };

    const fetchCurrentUser = async () => {
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
        const userData = userResponse.data;
        setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchNextUserId();
    fetchCurrentUser();
  }, []);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size is too large. Maximum allowed size is 5MB.")
        // setSuccessMessage("Image size is too large. Maximum allowed size is 5MB.");
        // setTimeout(() => {
        //   setSuccessMessage("");
        // }, 2000);
        setSelectedFile(null); // Reset the selected file
      } else {
        setSelectedFile(file);
      }
    }
  };
  const handleResetForm = (resetForm) => {
    resetForm();
    setSelectedFile(null); 
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    console.log("handleSubmitForm function triggered !!!");
    console.log("currentUser.companyName: ", currentUser.company);
    try {
      const allUsers = await axios.get(`/api/user/`);
      console.log("allUsers data fetched: ", allUsers.data);
      const allEmails = allUsers.data.map(user => user.email);
      console.log("allEmails: ", allEmails);
      const currentEmail = values.email; 
      console.log("values.email: ", values.email);
      console.log("currentEmail: ", currentEmail);
      if (allEmails.includes(currentEmail)) {
        alert("This email is already registered. Please use a different email.")
        // setSuccessMessage("This email is already registered. Please use another!");
        // setTimeout(() => {
        //   setSuccessMessage("");
        // }, 2000);
        return; 
      }


      const formData = {
        full_name: values.fullName,
        address: values.address,
        email: values.email,
        password: values.password,
        phone_number: values.phoneNumber,
        user_role: "customer-manager",
        company: currentUser.company,
        // company: values.companyName,
        profile_picture: selectedFile,
      };
      console.log("Try Block Values  : ", values);
      console.log("Try Block formData: ", formData);
      console.log("Matched Properties");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/user/",
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
      alert("User added successfully");
      // setSuccessMessage("User added successfully ");
      // setTimeout(() => {
      //   setSuccessMessage("");
      // }, 3000);
      resetForm();
      setSelectedFile(null);
      navigate("/customeradminuser");
    } catch (error) {
      // const formData = {
      //   full_name: values.fullName,
      //   address: values.address,
      //   email: values.email,
      //   password: values.temporaryPassword,
      //   phone_number: values.phoneNumber,
      //   user_role: "customer-manager",
      //   company: values.companyName,
      //   profile_picture: selectedFile,
      // };
      // console.log("Catch Block Values  : ", values);
      // console.log("Catch Block formData: ", formData);
      console.error("Error creating user:", error);
      alert("Failed to add user");
    }
  };

  return (
    <div style={backgroundStyle}>
      

      <Box sx={{ display: "flex" }}>
        <Box
          component="form"
          noValidate
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: { xs: "32px", sm: "125px", md: "125px", lg: "140px" },
            padding: { xs: "0px", sm: "10px", md: "10px", lg: "5px" },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              marginLeft: { xs: "0px", sm: "170px", md: "170px", lg: "200px" },
              width: "100%",
              maxWidth: 800,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Formik
                validationSchema={schema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmitForm}
                initialValues={{
                  email: "",
                  phoneNumber: "",
                  password: "",
                  fullName: "",
                  companyName: "",
                  assignedDevices: "",
                  adminId: nextUserId,
                  address: "",
                }}
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
                          xs: "80px",
                          sm: "22px",
                          md: "5px",
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
                                  // : "/Images/profile_pic.jpg"
                                  : "/broken-image.jpg"
                              }
                              sx={{ width: 100, height: 100 }}
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
                            <IconButton
                              aria-label="delete"
                              onClick={() => setSelectedFile(null)}
                            >
                            {/* <IconButton aria-label="delete" onClick={() => handleDeleteClick(setFieldValue)} > */}
                              <DeleteIcon />
                            </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          // onChange={(e) => {
                          //   console.log(e.target.files[0]);
                          // }}
                          accept="image/*"
                          // accept="image/png, image/jpeg, image/jpg"
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
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
                            },
                          }}
                        >
                          <Typography gutterBottom>User ID</Typography>
                          <TextField
                            fullWidth
                            id="adminId"
                            name="adminId"
                            variant="outlined"
                            value={nextUserId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.adminId && !!errors.adminId}
                            helperText={touched.adminId && errors.adminId}
                            placeholder="UID 01"
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
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
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

                        {/*------// <Grid item xs={12} sm={12} md={4} lg={6} sx={{ marginTop: { xs: '10px', sm: '10px', md: '5px', lg: '15px' }, }}>
                        // <Typography gutterBottom>Company Name*</Typography>
                        //   <TextField
                        //     fullWidth
                        //     id="companyName"
                        //     name="companyName"
                        //     variant="outlined"
                        //     value={values.companyName}
                        //     onChange={handleChange}
                        //     onBlur={handleBlur}
                        //     error={touched.companyName && !!errors.companyName}
                        //     helperText={touched.companyName && errors.companyName}
                        //     placeholder='Company Name'
                        //     sx={{
                        //       "& .MuiInputBase-root": {
                        //         "&:after": {
                        //           borderBottomColor: "green",
                        //         },
                        //       },
                        //       "& input:-webkit-autofill": {
                        //         WebkitBoxShadow:
                        //           "0 0 0 1000px rgba(199, 221, 211) inset",
                        //         WebkitTextFillColor: "black",
                        //         transition: "background-color 5000s ease-in-out 0s",
                        //       },
                        //       "&:-webkit-autofill": {
                        //         WebkitBoxShadow:
                        //           "0 0 0 1000px rgba(199, 221, 211) inset",
                        //         WebkitTextFillColor: "black",
                        //         transition: "background-color 5000s ease-in-out 0s",
                        //       },
                        //     }}
                        //   />
                        // </Grid>

                        // <Grid item xs={12} sm={12} md={4} lg={6} sx={{ marginTop: { xs: '10px', sm: '10px', md: '5px', lg: '15px' }, }}>
                        // <Typography gutterBottom>Assigned Devices*</Typography>
                        //   <TextField
                        //     fullWidth
                        //     id="assignedDevices"
                        //     name="assignedDevices"
                        //     variant="outlined"
                        //     value={values.assignedDevices}
                        //     onChange={handleChange}
                        //     onBlur={handleBlur}
                        //     error={touched.assignedDevices && !!errors.assignedDevices}
                        //     helperText={touched.assignedDevices && errors.assignedDevices}
                        //     placeholder='Assigned Devices'
                        //     sx={{
                        //       "& .MuiInputBase-root": {
                        //         "&:after": {
                        //           borderBottomColor: "green",
                        //         },
                        //       },
                        //       "& input:-webkit-autofill": {
                        //         WebkitBoxShadow:
                        //           "0 0 0 1000px rgba(199, 221, 211) inset",
                        //         WebkitTextFillColor: "black",
                        //         transition: "background-color 5000s ease-in-out 0s",
                        //       },
                        //       "&:-webkit-autofill": {
                        //         WebkitBoxShadow:
                        //           "0 0 0 1000px rgba(199, 221, 211) inset",
                        //         WebkitTextFillColor: "black",
                        //         transition: "background-color 5000s ease-in-out 0s",
                        //       },
                        //     }}
                        //   />
                        // </Grid>---*/}

                        <Grid
                          item
                          xs={12}
                          sm={5}
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
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
                          sm={7}
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Address*</Typography>
                          <TextField
                            fullWidth
                            id="address"
                            name="address"
                            multiline
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
                              "& .MuiInputBase-input": {
                                "&:-webkit-autofill": {
                                  WebkitBoxShadow:
                                    "0 0 0 1000px rgba(199, 221, 211) inset !important",
                                  WebkitTextFillColor: "black !important",
                                  transition:
                                    "background-color 5000s ease-in-out 0s !important",
                                },
                              },
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
                            },
                          }}
                        >
                          <Typography gutterBottom>Email*</Typography>
                          <TextField
                            fullWidth
                            id="email"
                            name="email"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
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
                          md={6}
                          lg={6}
                          sx={{
                            marginTop: {
                              xs: "10px",
                              sm: "10px",
                              md: "5px",
                              lg: "15px",
                            },
                          }}
                        >
                          <Typography gutterBottom>
                          Temporary Password*
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
                            placeholder="Temporary Password"
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

                        <Grid container justifyContent="flex-end" spacing={2}>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            md={3}
                            sx={{
                              marginTop: {
                                xs: "40px",
                                sm: "35px",
                                md: "20px",
                                lg: "30px",
                              },
                              ml: 2,
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={handleSubmit}
                            >
                              Add
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            md={3}
                            sx={{
                              marginTop: {
                                xs: "40px",
                                sm: "35px",
                                md: "20px",
                                lg: "30px",
                              },
                              ml: 2,
                              marginBottom: {
                                xs: "40px",
                                sm: "0px",
                                md: "10px",
                                lg: "0px",
                              },
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => {resetForm();
                                setSelectedFile(null);}}
                             fullWidth
                            >
                              Reset
                            </Button>
                          </Grid>

                          <Grid
                            item
                            xs={3}
                            sm={3}
                            md={3}
                            sx={{
                              marginTop: {
                                xs: "40px",
                                sm: "45px",
                                md: "20px",
                                lg: "30px",
                              },
                              ml: 2,
                              marginBottom: {
                                xs: "40px",
                                sm: "0px",
                                md: "10px",
                                lg: "0px",
                              },
                            }}
                          >
                            <Link href="/customeradminuser">
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
