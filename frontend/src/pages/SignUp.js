import React, { useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Box,
  Avatar,
  CssBaseline,
} from "@mui/material";
import { useState } from 'react';
import {
  
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from "formik";
import * as yup from "yup";
import DateTime from "../Components/DateTime";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const schema = yup.object().shape({
    full_name: yup.string().required("Full Name is required"),
    company: yup.string().required("Company Name is required"),
    email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email"
    )
    .required("Email is required"),
    phone_number: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number is not valid")
      .min(10, "Phone number must be at least 10 digits"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must be at most 12 characters"),
    confirm_password: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const Register = async (
    full_name,
    email,
    phone_number,
    company,
    password,
    confirm_password
  ) => {
    const serial_no = sessionStorage.getItem("serial_no");
    const secret_code = sessionStorage.getItem("secret_code");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name,
          email,
          phone_number,
          company,
          password,
          confirm_password,
          serial_no,
          secret_code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate(data.redirectURL);
        sessionStorage.clear();
      } else {
        alert("Registration error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
             backgroundColor:"#8FBAA6"
          },
        }}
      >
        <Formik
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { resetForm }) => {
            Register(
              values.full_name,
              values.email,
              values.phone_number,
              values.company,
              values.password,
              values.confirm_password
            );
            resetForm();
          }}
          initialValues={{
            full_name: "",
            email: "",
            phone_number: "",
            company: "",
            password: "",
            confirm_password: "",
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            handleBlur,
          }) => (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  padding: 3,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: 3,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Link href="/">
                  <Avatar
                    src="/Images/logo.png"
                    sx={{ width: 56, height: 56 }}
                    variant="rounded"
                  />
                </Link>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="full_name"
                        label="Full Name*"
                        name="full_name"
                        variant="standard"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.full_name && !!errors.full_name}
                        helperText={touched.full_name && errors.full_name}
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        label="Email*"
                        name="email"
                        variant="standard"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        InputLabelProps={{
                          style: { color: "black" }, // Change label color to black
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="phone_number"
                        label="Phone Number*"
                        name="phone_number"
                        variant="standard"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone_number && !!errors.phone_number}
                        helperText={touched.phone_number && errors.phone_number}
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="company"
                        label="Company Name*"
                        name="company"
                        variant="standard"
                        value={values.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.company && !!errors.company}
                        helperText={touched.company && errors.company}
                        InputLabelProps={{
                          style: { color: "black" }, // Change label color to black
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
        <TextField
          fullWidth
          id="password"
          label="Password*"
          name="password"
          type={showPassword ? 'text' : 'password'}
          variant="standard"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && !!errors.password}
          helperText={touched.password && errors.password}
          InputLabelProps={{
            style: { color: 'black' },
          }}
          sx={{
            "& .MuiInputBase-root": {
              "&:after": {
                borderBottomColor: 'green',
              },
            },
            "& input:-webkit-autofill": {
              WebkitBoxShadow:
                "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
              WebkitTextFillColor: 'black',
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="confirm_password"
          label="Confirm Password*"
          name="confirm_password"
          type={showConfirmPassword ? 'text' : 'password'}
          variant="standard"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirm_password && !!errors.confirm_password}
          helperText={touched.confirm_password && errors.confirm_password}
          InputLabelProps={{
            style: { color: 'black' },
          }}
          sx={{
            "& .MuiInputBase-root": {
              "&:after": {
                borderBottomColor: 'green',
              },
            },
            "& input:-webkit-autofill": {
              WebkitBoxShadow:
                "0 0 0 1000px rgba(154, 193, 175, 0.7) inset",
              WebkitTextFillColor: 'black',
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                  aria-label="toggle confirm password visibility"
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#4caf50",
                          color: "white",
                        }}
                      >
                        Register
                      </Button>
                    </Grid>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/login" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          )}
        </Formik>
      </Box>
      <DateTime />
    </div>
  );
}
