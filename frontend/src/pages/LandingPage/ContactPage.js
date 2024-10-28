import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import axios from "axios";

const ContactPage = () => {
  const [loading, setLoading] = useState(false); //loading for submit button
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Regular expression for validating an email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    // Regular expression for validating phone numbers (adjust as needed)
    const phonePattern = /^\d{10}$/; // Example: 10 digit phone number
    return phonePattern.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First Name is required";
    if (!formData.last_name) newErrors.last_name = "Last Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email is not valid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number is not valid.";
    }
    if (!formData.company) newErrors.company = "Company Name is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setErrors({});
    } else {
      setErrors(formErrors);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios.post("/api/landing-page/submit-form", formData, config);

      setSnackbarOpen(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Submission failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #25382c, #25382c)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems={"center"}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: {
                xs: "20px",  // 20px for extra small screens
                sm: "40px",  // 40px for small screens and above
              },
              color: "white",
            }}
          >
            <Typography variant="h2" fontWeight="bold"   gutterBottom sx={{ 
    marginTop: { xs: 5, sm: 2 } 
  }}>
              Reach out to us!
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom textAlign={"justify"}>
              To elevate your farm management with our advanced IoT and
              AI-driven Fazenda Smart Agro Solutions, please complete the form
              below. Our team will get in touch with you to discuss how we can
              help optimize your farming practices for enhanced productivity and
              efficiency.
            </Typography>
            <Box mt={4}>
              <Grid container spacing={2}>
                <Grid item xs={12} container alignItems="center">
                  <Avatar
                    src="/Images/phone.png" // Replace with your phone icon path
                    sx={{
                      width: 40,
                      height: 40,
                      marginRight: 2,
                      marginLeft: 0.5,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Contact Number
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href="tel:0112430010"
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        011-2430010
                      </a>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" mt={2}>
                  <Avatar
                    src="/Images/map.png" // Replace with your location icon path
                    sx={{ width: 45, height: 45, marginRight: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href="https://www.google.com/maps/dir//Colombo+01,+Colombo/@6.9346141,79.764498,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3ae25923f7fe1cf7:0x1d831ab969d751dc!2m2!1d79.8468999!2d6.9346212?entry=ttu"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        Digital Lab, <br />
                        Sri Lanka Telecom PLC,
                        <br /> Lotus Road, Colombo 01, <br /> Sri Lanka.
                      </a>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" mt={2}>
                  <Avatar
                    src="/Images/mail.png" // Replace with your email icon path
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      <a
                        href="mailto:info@sltdigitallab.lk"
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        info@sltdigitallab.lk
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Follow us:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <IconButton
                      href="https://www.facebook.com/profile.php?id=100091483773665" // Replace with your Facebook profile URL
                      target="_blank"
                      sx={{ color: "white" }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <IconButton
                      href="https://www.instagram.com/theembryoinnovation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" // Replace with your Instagram profile URL
                      target="_blank"
                      sx={{ color: "white" }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <IconButton
                      href="https://www.linkedin.com/company/the-embryo/" // Replace with your LinkedIn profile URL
                      target="_blank"
                      sx={{ color: "white" }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "40px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              color: "white",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.company}
                  helperText={errors.company}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.subject}
                  helperText={errors.subject}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={!!errors.message}
                  helperText={errors.message}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #38483e inset",
                        WebkitTextFillColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box mt={4} textAlign="right">
              <Button
                variant="contained"
                sx={{
                  width: "150px",
                  backgroundColor: "#61B44A",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#4E7F41",
                  },
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Submit"}{" "}
                {/* loading to show the user it's processing */}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Form successfully submitted!"
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#4CAF50", // Green color for success
          },
        }} />
    </Box>
  );
};
export default ContactPage;
