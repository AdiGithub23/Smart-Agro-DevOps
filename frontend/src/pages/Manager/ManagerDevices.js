import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CircleIcon from "@mui/icons-material/Circle";
import { red, green } from "@mui/material/colors";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Container,
  Box,
  Pagination,
  IconButton,
  InputLabel,
  Select,
  FormControl,
  Grid,
  Typography
} from "@mui/material";
import NavBar6 from "../../Components/NavBar6";
import Footer1 from "../../Components/Footer1";
import DateTime from "../../Components/DateTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Footer2 from "../../Components/Footer2";

// const devicesDetails = [
//   { serialNo: 'S2565', modelName: 'Portable 15', package: 'Portable 15', secretCode: '0754689523', status: 'Active' },
//   { serialNo: 'S5689', modelName: 'Portable 45', package: 'Portable 15', secretCode: '0758965412', status: 'Inactive' },
// ];

export default function ManagerDevices() {
  // const [devices, setDevices] = useState(devicesDetails.map(device => ({ ...device, showSecretCode: false })));
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpand = (id) => {
    setExpandedDevice(expandedDevice === id ? null : id);
  };

  const toggleSecretCodeVisibility = (id) => {
    setDevices(
      devices.map((device) =>
        device.id === id
          ? { ...device, showSecretCode: !device.showSecretCode }
          : device
      )
    );
  };

  const filteredDevices = devices.filter(
    (device) => filterStatus === "" || device.active_status === filterStatus
  );

  const paginatedDevices = filteredDevices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.id);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
  
    fetchUserId();
  }, []);
  
  useEffect(() => {
    const fetchUserCompany = async () => {
      if (userId) {  
        try {
          const response = await axios.get(`/api/user/${userId}`);
          setCompanyName(response.data.company);
        } catch (error) {
          console.error("Failed to fetch company:", error);
        }
      }
    };
  
    fetchUserCompany();
  }, [userId]);
  

  useEffect(() => {
    if (userId) {
      const fetchDevices = async () => {
        try {
          const response = await axios.get(
            `/api/device-manager/manager/${userId}`
          );
          const flattenedDevices = response.data.flat();
          setDevices(flattenedDevices);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };

      fetchDevices();
    }
  }, [userId]);

  return (
    <div style={backgroundStyle}>
      <Container
        component="main"
        maxWidth={false}
        sx={{
          width: { xs: "100%", sm: "90%" },
          height: "auto",
          display: "flex",
          flexDirection: "column",
          marginRight: "0px",
        }}
      >
      
        {(isMobile || isTablet) && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 170, sm: 140, md: 150, lg: 58 },
              left: { xs: 80, sm: 350, md: 500, lg: 16 },
              zIndex: 1000,
              minWidth: 200,
            }}
          >
            <FormControl fullWidth>
              <InputLabel
                id="filter-status-label"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Status
              </InputLabel>
              <Select
                labelId="filter-status-label"
                id="filter-status-select"
                value={filterStatus}
                label="Filter by Status"
                onChange={handleFilterStatusChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
   <Typography
          variant="h6"
          align="center"
          gutterBottom
          marginTop={12}
          fontWeight={600}
        >
          Company name: {companyName}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "95px", sm: "90px", md: "100px", lg: "30px" },
            marginLeft: { xs: "0px", sm: "110px", md: "80px", lg: "100px" },
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {isDesktop ? ( 
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "rgba(199, 221, 211)" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: "150px" }}>
                      Serial Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "150px" }}>
                      Model Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "150px" }}>
                      Device No
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "150px" }}>
                      Secret Code
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", width: "100px" }}
                    ></TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "150px" }}>
                      <Box sx={{ minWidth: 100 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="filter-status-label"
                            sx={{ fontWeight: "bold", color: "black" }}
                          >
                            Status
                          </InputLabel>
                          <Select
                            labelId="filter-status-label"
                            id="filter-status-select"
                            value={filterStatus}
                            label="Filter by Status"
                            onChange={handleFilterStatusChange}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.serial_no}</TableCell>
                      <TableCell>{device.model_name}</TableCell>
                      <TableCell>Device {device.id}</TableCell>
                      <TableCell>
                        <input
                          type={device.showSecretCode ? "text" : "password"}
                          value={device.secret_code}
                          readOnly
                          style={{
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "inherit",
                            fontFamily: "inherit",
                            color: "inherit",
                            width: "60%",
                          }}
                        />
                        <IconButton
                          onClick={() => toggleSecretCodeVisibility(device.id)}
                        >
                          {device.showSecretCode ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          <CircleIcon
                            size={24}
                            style={{
                              color:
                                device.active_status === "Active"
                                  ? green[500]
                                  : red[500],
                            }}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell>{device.active_status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={2}>
              {paginatedDevices.map((device) => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={device.id}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "rgba(199, 221, 211)" }}
                  >
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>Serial Number</strong>
                          </TableCell>{" "}
                          <TableCell>{device.serial_no}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Model Name</strong>{" "}
                          </TableCell>
                          <TableCell>{device.model_name}</TableCell>
                        </TableRow>

                        {expandedDevice === device.id || !isTablet ? (
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>Secret Code</strong>
                              </TableCell>
                              <TableCell>
                                <input
                                  type={
                                    device.showSecretCode ? "text" : "password"
                                  }
                                  value={device.secret_code}
                                  readOnly
                                  style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    fontSize: "inherit",
                                    fontFamily: "inherit",
                                    color: "inherit",
                                    width: "50%",
                                  }}
                                />
                                <IconButton
                                  onClick={() =>
                                    toggleSecretCodeVisibility(device.id)
                                  }
                                >
                                  {device.showSecretCode ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong> Status</strong>{" "}
                              </TableCell>
                              <TableCell>{device.active_status} </TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      {isTablet && (
                        <IconButton onClick={() => handleExpand(device.id)}>
                          {expandedDevice === device.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                      )}
                    </Box>
                  </TableContainer>
                </Grid>
              ))}
            </Grid>
          )}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(filteredDevices.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>
      </Container>
      <DateTime />
      <Footer2 />
    </div>
  );
}
