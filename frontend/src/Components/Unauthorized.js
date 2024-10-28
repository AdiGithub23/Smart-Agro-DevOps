import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {  useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Unauthorized = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const backgroundStyle = {
    backgroundColor: "#A6C5B7",
    padding: "10px 0px 100px 0px",
   minHeight: "95vh",
   position: "fixed", 
    width: "100%",
  };
  return (
    <div style={backgroundStyle}>
    <Container 
     
     sx={{ 
       display: 'flex', 
       flexDirection: 'column', 
       alignItems: 'center', 
       justifyContent: 'center', 
       height: {xs:'60vh',sm:"70vh",md:'70vh',lg:"75vh"}, 
       width:{xs:"70%",sm:"60%",md:"70%",lg:"70%"} ,
       mt:{xs:15,sm:15,md:10,lg:10},
       textAlign: 'center',
       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
       backgroundColor: "rgba(255, 255, 255, 0.7)",
     }}
    >
      
      <Box
    component="img"
    src="/Images/401.jpg"
    sx={{
      width: {
        xs: '150px',  // Mobile
        sm: '220px',  // Tablet
        md: '200px',
        lg:'250px'   // Desktop
      },
      height: {
        xs: '150px',  // Mobile
        sm: '220px',  // Tablet
        md: '200px',
        lg:'250px'  // Desktop
      },
    mb:{xs:4,sm:4,md:2,lg:4},          // MarginBottom
      opacity: 0.7    // Opacity
    }}
  />
<Typography
      variant="h1"
      component="h1"
      gutterBottom
      sx={{ fontSize:{xs:25,sm:35,md:40,lg:45} }}
    >
      401 Unauthorized
    </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ fontSize:{xs:15,sm:20,md:20,lg:20} }}>
        You do not have permission to view this page.
      </Typography>
      <Box mt={4}>
        <Button 
          variant="contained" 
          color="success" 
          sx={{size:{xs:"small",sm:"medium",md:"large",lg:'large'} }}
          
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
    </div>
  );
};

export default Unauthorized;





