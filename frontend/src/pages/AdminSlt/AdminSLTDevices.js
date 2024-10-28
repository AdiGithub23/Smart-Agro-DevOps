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
  IconButton,
  Tooltip,
  Container,
  Box,
  Pagination,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Typography,
} from "@mui/material";
import NavBar2 from "../../Components/NavBar2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Footer1 from "../../Components/Footer1.js";
import DateTime from "../../Components/DateTime";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import Footer2 from "../../Components/Footer2.js";
// const initialDevices = [
//   {
//     "serialNo": "SN001",
//     "modalName": "Modal A",
//     "package": "Package A",
//     "secretCode": "1234",
//     "deviceType": "Type 1",
//     "customerName": "John Doe",
//     "companyName": "Acme Corp",
//     "active": "Active",
//     "sltAdmin":"Admin 01",
//     "latitude": "37.7749",
//     "longitude": "-122.4194"
//   },
//   {
//     "serialNo": "SN002",
//     "modalName": "Modal B",
//     "package": "Package B",
//     "secretCode": "5678",
//     "deviceType": "Type 2",
//     "customerName": "Jane Smith",
//     "companyName": "Beta LLC",
//     "active": "Inactive",
//     "sltAdmin":"Admin 01",
//     "latitude": "34.0522",
//     "longitude": "-118.2437"
//   },
//   {
//     "serialNo": "SN003",
//     "modalName": "Modal C",
//     "package": "Package C",
//     "secretCode": "9101",
//     "deviceType": "Type 3",
//     "customerName": "Alice Johnson",
//     "companyName": "Gamma Inc",
//     "active": "Active",
//     "sltAdmin":"Admin 01",
//     "latitude": "40.7128",
//     "longitude": "-74.0060"
//   },
//   {
//     "serialNo": "SN004",
//     "modalName": "Modal D",
//     "package": "Package D",
//     "secretCode": "1122",
//     "deviceType": "Type 4",
//     "customerName": "Bob Brown",
//     "companyName": "Delta Ltd",
//     "active": "Active",
//     "sltAdmin":"Admin 01",
//     "latitude": "51.5074",
//     "longitude": "-0.1278"
//   },
//   {
//     "serialNo": "SN005",
//     "modalName": "Modal E",
//     "package": "Package E",
//     "secretCode": "3344",
//     "deviceType": "Type 5",
//     "customerName": "Carol White",
//     "companyName": "Epsilon Co",
//     "active": "Active",
//     "sltAdmin":"Admin 01",
//     "latitude": "48.8566",
//     "longitude": "2.3522"
//   },
//     {
//       "serialNo": "SN006",
//       "modalName": "Modal A",
//       "package": "Package F",
//       "secretCode": "1234",
//       "deviceType": "Type 1",
//       "customerName": "John Doe",
//       "companyName": "Acme Corp",
//       "active": "Active",
//       "sltAdmin":"Admin 01",
//       "latitude": "37.7749",
//       "longitude": "-122.4194"
//     },
//     {
//       "serialNo": "SN007",
//       "modalName": "Modal B",
//       "package": "Package G",
//       "secretCode": "5678",
//       "deviceType": "Type 2",
//       "customerName": "Jane Smith",
//       "companyName": "Beta LLC",
//       "active": "Active",
//       "sltAdmin":"Admin 01",
//       "latitude": "34.0522",
//       "longitude": "-118.2437"
//     },
//     {
//       "serialNo": "SN008",
//       "modalName": "Modal C",
//       "package": "Package H",
//       "secretCode": "9101",
//       "deviceType": "Type 3",
//       "customerName": "Alice Johnson",
//       "companyName": "Gamma Inc",
//       "active": "Inactive",
//       "sltAdmin":"Admin 01",
//       "latitude": "40.7128",
//       "longitude": "-74.0060"
//     },

//
// ];

export default function AdminSLTDevices() {
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [filterStatus, setFilterStatus] = useState("");
  const [status, setStatus] = useState("");
  const [openReassign, setOpenReassign] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedItemForReassign, setSelectedItemForReaasign] = useState(null);
  const navigate = useNavigate();
  const [expandedDevice, setExpandedDevice] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (isMobile) {
      setRowsPerPage(4); // Set 4 rows for mobile view
    } else if (isTablet) {
      setRowsPerPage(6); // Set 6 rows for tablet view
    } else if (isDesktop) {
      setRowsPerPage(7); // Set 2 rows for desktop view
    }
  }, [isMobile, isTablet, isDesktop]);

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
    if (userId) {
      const fetchDevices = async () => {
        try {
          const response = await axios.get("/api/device");
          setDevices(response.data);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };

      fetchDevices();
    }
  }, [userId]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };
  const handleExpand = (id) => {
    setExpandedDevice(expandedDevice === id ? null : id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const handleReassignClick = (id) => {
    setSelectedItemForReaasign(id);
    setOpenReassign(true);
  };

  const handleCloseReassign = () => {
    setOpenReassign(false);
    setSelectedDevice(null);
  };

  // const confirmReassign = () => {
  //   // Implement reassignment logic here
  //   setOpenReassign(false);
  //   setSelectedDevice(null);
  // };

  const confirmReassign = () => {
    if (selectedItemForReassign) {
      try {
        axios.delete(`/api/inventory/assign/${selectedItemForReassign}`);

        setDevices(
          devices.filter((item) => item.id !== selectedItemForReassign)
        );
      } catch (error) {
        console.error("Error deleting device:", error);
        alert("An unexpected error occurred.");
      }
    }
    setOpenReassign(false);
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
        <NavBar2 />
        {(isMobile || isTablet) && (
          <Box
            sx={{
              width: { xs: 150, sm: 200, md: 250, lg: 250 },
              top: { xs: 70, sm: 80, md: 80, lg: 70 },
              left: { xs: 60, sm: 382, md: 450, lg: 250 },
              zIndex: 1000,
              position: "absolute",
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
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "130px", sm: "140px", md: "150px", lg: "80px" },
            marginLeft: { xs: "0px", sm: "110px", md: "80px", lg: "100px" },
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {isDesktop ? (
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "rgba(199, 221, 211)" }}
            >
              <Table sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Serial No
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Model Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Package Id
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                      {" "}
                      
                      Secret Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Device Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Assigned Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Assigned Company Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      <Box sx={{ minWidth: 94 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="status-label"
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
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      <center>Assigned SLTAdmin</center>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Latitude
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Longitude
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell sx={{ padding: "4px" }}>
                        <Link
                          component={RouterLink}
                          to={`/devicesrealtime/${device.id}`}
                          color="inherit"
                          underline="hover"
                          onClick={() => {
                            localStorage.setItem("DeviceID", device.id);
                          }}
                        >
                          {device.serial_no}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.model_name}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        PID{device.package_id}
                      </TableCell>
                      <TableCell sx={{ padding: "6px", width: "120px" }}>
                        <Box display="flex" alignItems="center">
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
                              width: "70%",
                            }}
                          />
                          <IconButton
                            onClick={() =>
                              toggleSecretCodeVisibility(device.id)
                            }
                          >
                            {device.showSecretCode ? (
                              <VisibilityOffIcon sx={{ fontSize: 17 }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: 17 }} />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.device_type}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.customer_name}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.company_name}
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          <CircleIcon
                            sx={{ fontSize: 8 }}
                            style={{
                              color:
                                device.active_status === "Active"
                                  ? green[500]
                                  : red[500],
                            }}
                          />
                        </IconButton>
                        {device.active_status}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
  <center>{device.assigned_SLT_admin ? `UID${device.assigned_SLT_admin}` : ""}</center>
</TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.latitude}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {device.longitude}
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        <Tooltip title="Reassign to Customer">
                          <IconButton
                            color="primary"
                            onClick={() => handleReassignClick(device.id)}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
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
                            <strong>Serial No:</strong>
                          </TableCell>{" "}
                          <TableCell>
                            {" "}
                            <Link
                              component={RouterLink}
                              to={`/devicesrealtime/${device.id}`}
                              color="inherit"
                              underline="hover"
                              onClick={() => {
                                localStorage.setItem("DeviceID", device.id);
                              }}
                            >
                              {device.serial_no}{" "}
                            </Link>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Model Name:</strong>{" "}
                          </TableCell>
                          <TableCell>{device.model_name}</TableCell>
                        </TableRow>

                        {expandedDevice === device.id || !isTablet ? (
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>Package Id:</strong>
                              </TableCell>
                              <TableCell> PID{device.package_id}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong>Secret Code:</strong>
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
                                    width: "60%",
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
                                <strong>Device Type:</strong>{" "}
                              </TableCell>
                              <TableCell>{device.device_type}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Assigned Customer Name:</strong>{" "}
                              </TableCell>
                              <TableCell>{device.customer_name}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Assigned Company Name:</strong>{" "}
                              </TableCell>
                              <TableCell> {device.company_name}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Status:</strong>
                              </TableCell>
                              <TableCell> {device.active_status}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Assigned SLTAdmin:</strong>{" "}
                              </TableCell>
                              <TableCell >
  <center>{device.assigned_SLT_admin ? `UID${device.assigned_SLT_admin}` : ""}</center>
</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Latitude:</strong>{" "}
                              </TableCell>
                              <TableCell>{device.latitude}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Longitude:</strong>{" "}
                              </TableCell>
                              <TableCell>{device.longitude}</TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Reassign to Customer">
                        <IconButton
                          // Disable if status is 'Inactive'
                          // disabled={device.active === 'Active'}
                          color="primary"
                          onClick={() => handleReassignClick(device.id)}
                        >
                          <PersonAddIcon />
                        </IconButton>
                      </Tooltip>
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
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(devices.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Paper>

        <Dialog
          open={openReassign}
          onClose={handleCloseReassign}
          aria-labelledby="reassign-dialog-title"
          aria-describedby="reassign-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle id="reassign-dialog-title">
            Reclaim this Device
          </DialogTitle>
          <DialogContent>
            <p>Are you sure you want to reclaim this device?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReassign} color="primary">
              No
            </Button>
            <Button onClick={confirmReassign} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer2 />
      <DateTime />
    </div>
  );
}
