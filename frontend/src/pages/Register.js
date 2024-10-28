import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  CssBaseline,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import DateTime from "../Components/DateTime";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { WindowSharp } from "@mui/icons-material";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const inventoryVerification = async (serial_no, secret_code) => {
    try {
      const response = await fetch("/api/auth/register/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_no,
          secret_code,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }
  
      const data = await response.json();
  
      sessionStorage.setItem("serial_no", serial_no);
      sessionStorage.setItem("secret_code", secret_code);
      sessionStorage.setItem("validationToken", data.validationToken);
      window.location.href = data.redirectURL;
  
    } catch (error) {
      alert(error.message);
    }
  };  

  const schema = yup.object().shape({
    serial_no: yup.string().required("Serial Number is required"),
    secret_code: yup
      .string()
      .required("Secret Code is required")
      .min(4, "Secret Code must be at least 4 characters"),
  });

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
            inventoryVerification(values.serial_no, values.secret_code);
            resetForm();
          }}
          initialValues={{
            serial_no: "",
            secret_code: "",
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
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                <Link to="/">
                  <Avatar
                    src="/Images/logo.png"
                    sx={{ width: 70, height: 70 }}
                    variant="rounded"
                  />
                </Link>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="serial_no"
                        label="Serial Number*"
                        name="serial_no"
                        variant="standard"
                        value={values.serial_no}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.serial_no && !!errors.serial_no}
                        helperText={touched.serial_no && errors.serial_no}
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
                              "0 0 0 1000px rgba(177, 207, 193, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(177, 207, 193, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="secret_code"
                        label="Secret Code*"
                        name="secret_code"
                        variant="standard"
                        value={values.secret_code}
                        type={showPassword ? "text" : "password"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.secret_code && !!errors.secret_code}
                        helperText={touched.secret_code && errors.secret_code}
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
                              "0 0 0 1000px rgba(177, 207, 193, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(177, 207, 193, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
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
