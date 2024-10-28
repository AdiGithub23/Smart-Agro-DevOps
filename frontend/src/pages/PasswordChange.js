import React from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  InputAdornment,
  CssBaseline,
  IconButton,
} from "@mui/material";
import  { useState } from 'react';
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DateTime from "../Components/DateTime";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must be at most 12 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const codeSearch = new URLSearchParams(location.search);
    const code = codeSearch.get("code");

    if (!code) {
      alert("Invalid or missing code.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        code,
        password: values.newPassword,
      });

      alert(response.data.message);
      resetForm();
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
      );
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
            backgroundColor:"#8FBAA6",
            filter: "blur(2px)", // Add blur effect here
            zIndex: -1,
          },
        }}
      >
        <Formik
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
          initialValues={{
            newPassword: "",
            confirmPassword: "",
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
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent background
                  backdropFilter: "blur(10px)", // Blur effect
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.5)", // Optional subtle border
                }}
              >
                <Avatar
                  src="/Images/logo.png"
                  sx={{ width: 56, height: 56 }}
                  variant="rounded"
                />
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="newPassword"
                        label="New Password*"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        variant="standard"
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.newPassword && !!errors.newPassword}
                        helperText={touched.newPassword && errors.newPassword}
                        InputLabelProps={{
                          
                          style: { color: "black" }, // Change label color to black
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowNewPassword}
                                edge="end"
                                aria-label="toggle new password visibility"
                              >
                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            "&:after": {
                              borderBottomColor: "green",
                            },
                          },
                          "& input:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(177, 207, 193,0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(177, 207, 193,0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password*"
                        name="confirmPassword"
                        variant="standard"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        error={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
                        helperText={
                          touched.confirmPassword && errors.confirmPassword
                        }
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
                              "0 0 0 1000px rgba(177, 207, 193,0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(177, 207, 193,0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <br />
                      <br />
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        className="submit"
                        fullWidth
                      >
                        Proceed
                      </Button>
                      <br />
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
