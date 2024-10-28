import React, { useState } from "react";
import { Box, Paper, Typography, Button, Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer1 from "../../Components/Footer1";
import DateTime from "../../Components/DateTime";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NavBar6 from "../../Components/NavBar6";

export default function AdminCustomerRecomandation() {
  const [showSecondImage, setShowSecondImage] = useState(false);
  const { state } = useLocation();
  const { district, area, gramaNiladhariArea } = state || {
    district: " ",
    area: " ",
    gramaNiladhariArea: " ",
  };

  const handleButtonClick = () => {
    setShowSecondImage(true);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#2E7D32",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: "50%",
    color: "#ffffff",
  }));

  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    padding: "0px 0px 100px 0px",
    minHeight: "100vh",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
     
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          mt: "14px",
          minHeight: "100vh",
          flexDirection: "column",
          padding: 2,

          backgroundPosition: "center",
          backgroundSize: "cover",
          ml: { xs: "0px", sm: "170px", md: "140px", lg: "150px" },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, md: 3 },
            textAlign: "center",
            mb: "20px",
            mt: 15,
            width: { xs: "95%", sm: "90%", md: "80%", lg: "60%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            flexDirection: "column",
          }}
        >
          {/* Button Labels */}
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                දිස්ත්‍රික්කය
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                ප්‍රාදේශීය ලේකම් කොට්ඨාසය
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                ග්‍රාම නිලධාරී කොට්ඨාසය
              </Typography>
            </Grid>
          </Grid>

          {/* Button Values */}
          <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={4} sm={4} md={4}>
              <Item
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                {district}
              </Item>
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Item
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                {area}
              </Item>
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Item
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                }}
              >
                {gramaNiladhariArea}
              </Item>
            </Grid>
          </Grid>

          <img
            src="/Images/Table1.png"
            alt="Sample"
            style={{ width: "100%", height: "auto", marginTop: "20px" }}
          />
        </Paper>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            mb: 4,
            width: { xs: "80%", sm: "200px" },
            backgroundColor: "#61B44A",
            "&:hover": { backgroundColor: "darkgreen" },
            fontSize: { xs: "16px", sm: "20px" },
            color: "black",
          }}
          onClick={handleButtonClick}
        >
          වී වගාව
        </Button>

        {showSecondImage && (
          <>
            <Paper
              elevation={3}
              sx={{
                padding: { xs: 2, md: 3 },
                textAlign: "center",
                mb: "20px",
                width: { xs: "95%", sm: "90%", md: "80%", lg: "60%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                flexDirection: "column",
              }}
            >
              <img
                src="/Images/Table2.png"
                alt="Sample"
                style={{ width: "100%", height: "auto" }}
              />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: { xs: 2, md: 3 },
                textAlign: "center",
                mb: "20px",
                width: { xs: "95%", sm: "90%", md: "80%", lg: "60%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                flexDirection: "column",
              }}
            >
              <TableContainer component={Paper} style={{ maxWidth: "100%" }}>
                <Table
                  aria-label="custom table"
                  sx={{ border: "2px solid black" }}
                >
                  <TableHead>
                    <TableRow sx={{ border: "2px solid black" }}>
                      <TableCell
                        align="center"
                        colSpan={7}
                        sx={{ border: "2px solid black", padding: "6px" }}
                      >
                        <Typography variant="subtitle2" component="span" sx={{
                          
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}>
                          පොහොර නිර්දේශය අක්කර
                        </Typography>
                        <TextField
                          type="number"
                          InputProps={{
                            inputProps: { min: 0 }, // You can set min/max if needed
                            sx: {
                              padding: "2px 8px", // Adjust padding to reduce height
                            },
                          }}
                          
                          size="small"
                          sx={{
                            width: { xs: "40px", sm: "55px", md: "55px", lg: "60px" },
                            bgcolor: "#fff", // Grey background
                            borderRadius: 1,
                            
                            marginLeft: 1,
                            marginRight: 1,
                            fontSize: "0.8rem", // Adjust font size to reduce overall size
                            "& .MuiOutlinedInput-root": {
                              height: { xs: "20px", sm: "20px", md: "25px", lg: "30px" }, // Explicitly set the height
                              padding: 0, // Remove any extra padding
                            },
                          }}
                        />

                        <Typography variant="subtitle2" component="span" sx={{
                          
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}>
                          ක්‌ සඳහා
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ border: "1px solid black" }}>
                      <TableCell
                        align="center"
                        rowSpan={2}
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        යොදන අවස්ථාව
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={3}
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        වාරි ජලයෙන්
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={3}
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        අහස් දියෙන්
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ border: "1px solid black" }}>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        යූරියා
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        ටී. එස්. පී.
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        එම්. ඕ. පී.
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        යූරියා
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        ටී. එස්. පී.
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        ටී. එස්. පී.
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* First Data Row */}
                    <TableRow sx={{ border: "1px solid black" }}>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        මූලික පොහොර
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                    </TableRow>

                    {/* Add Data Rows */}
                    {[
                      {
                        label: "වපුරා සති 3 ත් හෝ සිටුවා සති 2 ත්",
                        values1: [20, "-", "-", 12, "-", "-"],
                      },
                      {
                        label: "වපුරා සති 5 ත් හෝ සිටුවා සති 4 ත්",
                        values1: [30, "-", "-", 26, "-", "-"],
                      },
                      {
                        label: "වපුරා සති 7 න් හෝ සිටුවා සති 6 ත්",
                        values1: [26, "-", "-", 20, "-", "-"],
                      },
                      {
                        label: "වපුරා සති 8 ත් හෝ සිටුවා සති 7ත්",
                        values1: [14, "-", "-", 12, "-", "-"],
                      },
                    ].map((row, idx) => (
                      <TableRow key={idx} sx={{ border: "1px solid black" }}>
                        <TableCell
                          align="center"
                          sx={{
                            border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                          }}
                        >
                          {row.label}
                        </TableCell>
                        {row.values1.map((val, index) => (
                          <TableCell
                            align="center"
                            key={index}
                            sx={{
                              border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                            }}
                          >
                            {val}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* Final Sum Row */}
                    <TableRow sx={{ border: "1px solid black" }}>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        මුළු පොහොර අවශ්‍යතාව
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        90
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        70
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          border: "1px solid black",
                          padding: "3px",
                          fontSize: { xs: "0.5rem", sm: "0.6rem", md: "0.7rem", lg: "0.7rem" },
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: { xs: 1, md: 2 },
                textAlign: "center",
                width: { xs: "100%", sm: "92%", md: "82%", lg: "61%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <img
                src="/Images/Details.png"
                alt="Sample"
                style={{ width: "100%", height: "auto" }}
              />
            </Paper>
          </>
        )}
      </Box>
      <DateTime />
      <Footer1 />
    </div>
  );
}
