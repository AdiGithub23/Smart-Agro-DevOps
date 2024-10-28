import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Box,
  Avatar,
  CssBaseline,
} from "@mui/material";
import DateTime from "../Components/DateTime";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setCodeError("");

    try {
      const response = await axios.post("/api/auth/verify-code", { code });
      const { message, redirectUrl } = response.data;

      setMessage(message);

      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (error) {
      setCodeError("Verification failed. Please try again.");
    }
  };

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Reset the error message before starting the email verification
    setError("");
  
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      setIsEmailSubmitted(true);
    } catch (error) {
      setError("User is not registered with the system");
    } finally {
      setLoading(false);
    }
  };
  

  return (
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
      <Container maxWidth="sm">
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
          <Link href="/">
                  <Avatar
                    src="/Images/logo.png"
                    sx={{ width: 56, height: 56 }}
                    variant="rounded"
                  />
                </Link>
          <Box sx={{ marginTop: 4, marginLeft: 1 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Enter Your Email Address
            </Typography>
            <form onSubmit={handleEmailVerify}>
              <TextField
                label="Email"
                variant="standard"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: "20px" }}
                error={!!error}
                helperText={error}
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
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={loading}
              >
                {loading ? "PLEASE WAIT..." : "Submit"}
              </Button>
              <Box sx={{ marginTop: 3 }}>
                <Typography>
                  Didn't get verification email?
                  <Box component="span" sx={{ marginLeft: 1 }}>
                    <Link href="#" className="links" underline="hover">
                      Resend
                    </Link>
                  </Box>
                </Typography>
              </Box>
            </form>
            {message && (
              <Alert severity="success" style={{ marginTop: "20px" }}>
                {message}
              </Alert>
            )}
            {isEmailSubmitted && (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Enter Verification Code
                </Typography>
                <form onSubmit={handleVerify}>
                  <TextField
                    label="Verification Code"
                    variant="standard"
                    fullWidth
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ marginBottom: "20px" }}
                    error={!!codeError}
                    helperText={codeError}
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                  >
                    Verify
                  </Button>
                </form>
              </Box>
            )}
            <br />
            <br />
          </Box>
        </Box>
      </Container>
      <DateTime />
    </Box>
  );
};

export default ForgetPassword;
