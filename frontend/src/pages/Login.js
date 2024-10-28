import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import DateTime from "../Components/DateTime";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (!decodedToken.exp) {
            navigate("/login");
            return;
          }

          if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token");
            navigate("/login");
          } else {
            const isAuthenticated = decodedToken.role;

            if (isAuthenticated) {
              switch (decodedToken.role) {
                case "super-admin":
                  navigate("/superadmin");
                  break;
                case "slt-admin":
                  navigate("/adminsltdashboard");
                  break;
                case "customer-admin":
                  navigate("/admincoustomerdashboard");
                  break;
                case "customer-manager":
                  navigate("/managerdashboard");
                  break;
                default:
                  navigate("/");
              }
            } else {
              navigate("/login");
            }
          }
        } catch (error) {
          navigate("/login");
        }
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate(data.redirectUrl || "/");
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      alert("Login failed: An unexpected error occurred.");
    }
  };

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
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
            login(values.email, values.password);
            resetForm();
          }}
          initialValues={{ email: "", password: "" }}
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
                <Link component={RouterLink} to="/">
                  <Avatar
                    src="/Images/logo.png"
                    sx={{ width: 56, height: 56 }}
                    variant="rounded"
                  />
                </Link>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                  <Grid container spacing={5}>
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
                        id="password"
                        label="Password*"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
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
                              "0 0 0 1000px rgba(204, 240, 217, 0.7) inset",
                            WebkitTextFillColor: "black",
                            transition: "background-color 5000s ease-in-out 0s",
                          },
                          "&:-webkit-autofill": {
                            WebkitBoxShadow:
                              "0 0 0 1000px rgba(204, 240, 217, 0.7) inset",
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
                    <Grid item xs={12}>
                      <Link
                      component={RouterLink}
                        to="/forgetPassword"
                        className="links"
                        color="inherit"
                        underline="hover"
                      >
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                        >
                          Forgot Password?
                        </Typography>
                      </Link>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        className="submit"
                      >
                        LOGIN
                      </Button>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Have a Fazenda SmartAgro device?
                        <Box component="span" sx={{ marginLeft: 1 }}>
                          <Link
                          component={RouterLink}
                            to="/register"
                            className="links"
                            underline="hover"
                          >
                            Register Here
                          </Link>
                        </Box>
                      </Typography>
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
