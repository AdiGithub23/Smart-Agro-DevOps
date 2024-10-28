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
  Fab,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Link,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  PersonAdd,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import NavBar7 from "../../Components/NavBar7";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DateTime from "../../Components/DateTime";
import Footer1 from "../../Components/Footer1";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Footer2 from "../../Components/Footer2";
// const inventoryDetails = [
//   { serialNo: 'S2565', modelName: 'Portable 15', secretCode: '0754689523', latitude: '', longitude: '', farmName: 'farm 01', farmId: 'F01', managerName: 'Silva', managerId: 'M01', status: 'Assigned' },
//   { serialNo: 'S5689', modelName: 'Portable 45', secretCode: '0758965412', latitude: '', longitude: '', farmName: 'farm 01', farmId: 'F01', managerName: 'Silva', managerId: 'M01', status: 'In Stock' },
// ];

const validationSchema = Yup.object().shape({
  managerName: Yup.string().required('Manager Name is required'),
  managerId: Yup.string().required('Manager ID is required'),
  latitude: Yup.number()
      .optional()
      .test('Latitude must be valid number', 'latitude must be a valid number', value =>
        value === undefined || value === null || (value + "").match(/^(-?\d+(\.\d+)?)$/)
      ),
    longitude: Yup.number()
      .optional()
      .test('is-decimal', 'Longitude must be a valid number', value =>
        value === undefined || value === null || (value + "").match(/^(-?\d+(\.\d+)?)$/)
      ),
});


export default function AdminCustomerDevice() {
  // const [users, setUsers] = useState(inventoryDetails.map(user => ({ ...user, showSecretCode: false })));
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [openAdd, setOpenAdd] = useState(false); // State for Add dialog
  const [selectedDevice, setSelectedDevice] = useState(null); // Track the selected device
  const [device_label, setDeviceLabel] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [farmDetails, setFarmDetails] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState([]);
  const [managerDetails, setManagerDetails] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  
  // const [farmName, setFarmName] = useState('');
  // const [farmId, setFarmId] = useState('');
  const [managerName, setManagerName] = useState("");
  const [managerId, setManagerId] = useState("");
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [userId, setUserId] = useState(null);
  const [expandedDevice, setExpandedDevice] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
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

    // const fetchFarms = async () => {
    //   try {
    //     const response = await axios.get("/api/farm");
    //     setFarmDetails(response.data);
    //   } catch (error) {
    //     console.error("Error fetching farm details:", error);
    //   }
    // };

    // fetchFarms();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserCompany = async () => {
        try {
          const response = await axios.get(
            `/api/user/${userId}`
          );
          setCompanyName(response.data.company);
        } catch (error) {
          console.error("Failed to fetch company:", error);
        }
      };
      fetchUserCompany();

      const fetchDevices = async () => {
        try {
          const response = await axios.get(
            `/api/device/customer/${userId}`
          );
          setDevices(response.data);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };

      fetchDevices();

      const fetchFarms = async () => {
        try {
          const response = await axios.get(
            `/api/farm/${userId}`
          );
          setFarmDetails(response.data);
        } catch (error) {
          console.error("Error fetching farms:", error);
        }
      };

      fetchFarms();

      const fetchManagers = async () => {
        try {
          const response = await axios.get(
            "/api/user/customer-managers"
          );
          // setManagerDetails(response.data);
          const allManagers = response.data;

          const filteredManagers = allManagers.filter(
            (manager) => manager.createdById === userId
          );

          setManagerDetails(filteredManagers);
        } catch (error) {
          console.error("Error fetching manager details:", error);
        }
      };

      fetchManagers();
    }
  }, [userId]);
  const handleExpand = (id) => {
    setExpandedDevice(expandedDevice === id ? null : id);
  };

  const handleEdit = (id) => {
    navigate(`/Edit/${id}`);
  };

  const handleDelete = (id) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAssign = (device) => {
    setSelectedDevice(device);
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpen(false);
    setDeviceLabel(null);
    setLatitude(null);
    setLongitude(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  // const handleSubmit = () => {
  //   if (selectedDevice) {
  //     // setDevices(devices.map(device =>
  //     //   device.id === selectedDevice.id
  //     //   ? { ...device, status: 'Assigned' }
  //     //   : device
  //     // ));
  //   }
  //   setOpen(false);
  // };

  const handleSubmit = async () => {
    if (selectedDevice) {
      try {
        const deviceId = selectedDevice.id;
        const assignmentDetails = {
          managers: [
            {
              manager_id: selectedManager,
              //manager_name: selectedManagerName,
              farm_id: selectedDevice.farm_id || selectedFarm,
              //farm_name: selectedFarmName,
              device_label: device_label || selectedDevice.device_label,
              longitude: longitude || selectedDevice.longitude,
              latitude: latitude || selectedDevice.latitude,
            },
          ],
        };

        try {
          await axios.post(
            `/api/device/assign-manager/${deviceId}`,
            assignmentDetails
          );

          // const updatedDevices = devices.map(device =>
          //   device.id === selectedDevice.id
          //     ? { ...device, latitude, longitude }
          //     : device
          // );

          // setDevices(devices.map(device =>
          //   device.id === selectedDevice ? { ...device, status: 'Assigned' } : item
          // ));

          setOpen(false);
          alert("Device assigned to manager successfully!");
          window.location.reload();
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(error.response.data.error);
          } else {
            alert("An unexpected error occurred.");
          }
        }
      } catch (error) {
        console.error("Error assigning device:", error);
      }
    }
  };

  // const filteredDevices = filterStatus
  //   ? devices.filter(device => device.status === filterStatus)
  //   : devices;

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredDevices = devices.filter(
    (device) => filterStatus === "" || device.active_status === filterStatus
  );

  const paginatedDevices = filteredDevices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  //const paginatedDevices = devices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleSecretCodeVisibility = (id) => {
    setDevices(
      devices.map((device) =>
        device.id === id
          ? { ...device, showSecretCode: !device.showSecretCode }
          : device
      )
    );
  };

  const dialogContentStyle = {
    minHeight: "200px",
    maxHeight: "400px",
    padding: "50px",
  };
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
      
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          marginTop={12}
          fontWeight={600}
        >
          Company name: {companyName}
        </Typography>
        {(isMobile || isTablet) && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 145, sm: 135, md: 130, lg: 58 },
              right: { xs: 10, sm: 10, md: 16, lg: 16 },
              zIndex: 1000,
            }}
          >
            
            <Box
              sx={{
                width: { xs: 150, sm: 200, md: 250, lg: 250 },
                top: { xs: 15, sm: 2, md: 10, lg: 58 },
                right: { xs: 175, sm: 352, md: 462, lg: 250 },
                zIndex: 1000,
                position: "absolute", // Ensure the button's position is absolute
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
          </Box>
        )}

        {/* {isDesktop && (
          <Box position="fixed" top={130} left={1450} zIndex={1000}>
            <Fab color="primary" aria-label="add" onClick={handleAdd}>
              <Add />
            </Fab>
          </Box>
        )} */}

        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "85px", sm: "70px", md: "75px", lg: "0px" },
            marginLeft: { xs: "0px", sm: "110px", md: "80px", lg: "90px" },
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
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Serial Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Device Label
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Model Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Secret Code
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>Latitude</TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "7px" }}>Longitude</TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>Farm Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>Farm ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Manager Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
                    Manager ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", padding: "4px" }}>
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
                  <TableCell sx={{ fontWeight: "bold", padding: "none" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell sx={{ padding: "4px" }}>{device.serial_no} </TableCell>
                    <TableCell sx={{ padding: "4px" }}>{device.device_label}</TableCell>
                    <TableCell sx={{ padding: "4px" }}>{device.model_name}</TableCell>
                    <TableCell sx={{ padding: "4px",width: "120px" }}>
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
                        size="small"
                        onClick={() => toggleSecretCodeVisibility(device.id)}
                      >
                        {device.showSecretCode ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ padding: "6px" }}>{device.latitude}</TableCell>
                    <TableCell sx={{ padding: "7px" }}>{device.longitude}</TableCell>
                    <TableCell sx={{ padding: "4px" }}>{device.farm_name}</TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      {device.farm_id !== null ? `FID${device.farm_id}` : null}
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingLeft: 0,
                          margin: 0,
                        }}
                      >
                        {device.deviceManagers.map((manager, index) => (
                          <li key={index}>{manager.manager_name}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingLeft: 0,
                          margin: 0,
                        }}
                      >
                        {device.deviceManagers.map((manager, index) => (
                          <li key={index}>UID{manager.manager_id}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      <IconButton>
                        <CircleIcon
                          sx={{ fontSize: 10 }}
                          style={{
                            color:
                              device.active_status === "Active" ? green[500] : red[500],
                          }}
                        />
                      </IconButton>
                      {device.active_status}
                    </TableCell>
                    <TableCell sx={{ padding: "none" }}>
                      <Tooltip title="Assign To Manager">
                        <span>
                          <IconButton
                            aria-label="assign to customer"
                            size="large"
                            onClick={() => handleAssign(device)}
                            color="primary"
                          >
                            <PersonAdd fontSize="inherit" />
                          </IconButton>
                        </span>
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
                            <strong>Serial No</strong>
                          </TableCell>{" "}
                          <TableCell>{device.serial_no}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Device Label</strong>{" "}
                          </TableCell>
                          <TableCell>{device.device_label}</TableCell>
                        </TableRow>
                       
                        {expandedDevice === device.id || !isTablet ? (
                          <>
                           <TableRow>
                          <TableCell>
                            <strong>Model Name</strong>{" "}
                          </TableCell>
                          <TableCell>{device.model_name}</TableCell>
                        </TableRow>

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
                                    width: "60%",
                                    marginRight: "10px",
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
                                <strong>Latitude</strong>{" "}
                              </TableCell>
                              <TableCell>{device.latitude}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Longitude</strong>{" "}
                              </TableCell>
                              <TableCell>{device.longitude}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong>Farm Name</strong>
                              </TableCell>
                              <TableCell>{device.farm_name}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Farm ID</strong>{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                {device.farm_id !== null
                                  ? `FID${device.farm_id}`
                                  : null}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Manager Name</strong>{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    margin: 0,
                                  }}
                                >
                                  {device.deviceManagers.map(
                                    (manager, index) => (
                                      <li key={index}>
                                        {manager.manager_name}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Manager ID</strong>{" "}
                              </TableCell>
                              <TableCell>
                                {" "}
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    margin: 0,
                                  }}
                                >
                                  {device.deviceManagers.map(
                                    (manager, index) => (
                                      <li key={index}>
                                        UID{manager.manager_id}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Status</strong>
                              </TableCell>
                              <TableCell>{device.active_status}</TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Assign To Manager">
                        <span>
                          <IconButton
                            aria-label="assign to customer"
                            size="large"
                            onClick={() => handleAssign(device)}
                            color="primary"
                            // disabled={device.status === 'Assigned'}
                          >
                            <PersonAdd fontSize="inherit" />
                          </IconButton>
                        </span>
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
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(filteredDevices.length / rowsPerPage)}
              // count={Math.ceil(devices.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>




        
        {/*---------------------Assign Device-------------------------------*/}
        <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  sx={{
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      backgroundColor: "rgba(199, 221, 211)",
    },
  }}
>
  <Formik
    initialValues={{
      manager_name: "",
      managerId: '',
      latitude: '',
      longitude: '',
      device_label: '',
    }}
    validationSchema={Yup.object({
      manager_name: Yup.string().required('Manager Name is required'),
      managerId: Yup.string().required('Manager ID is required'),
      latitude: Yup.string().required('Latitude is required'),
      longitude: Yup.string().required('Longitude is required'),
      device_label: Yup.string().required('Device label is required'),
    })}
    onSubmit={handleSubmit}
  >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
          <DialogTitle>Assign To Manager</DialogTitle>
          <br />
          <DialogContent sx={dialogContentStyle}>
            {selectedDevice && (
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" gap={1}>
                  <TextField
                    // select
                    label="Serial Number"
                    value={selectedDevice.serial_no || ""}
                    // value={selectedDevice?.id || ''}
                    // onChange={(e) => setSelectedDevice(devices.find(device => device.id === e.target.value))}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    {/* {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.serial_no}
                  </MenuItem>
                ))} */}
                  </TextField>
                  <Field
                  as={TextField}
                  label="Device Label"
                  name="device_label"
                    // value={device_label || selectedDevice.device_label || null}
                    // onChange={(e) => setDeviceLabel(e.target.value)} 
                    value={selectedDevice.device_label}
                    onChange={(e) =>
                      setSelectedDevice({ ...selectedDevice, device_label: e.target.value })
                    }
                    onBlur={handleBlur}
                  error={touched.device_label && Boolean(errors.device_label)}
                  helperText={touched.device_label && errors.device_label}
                    // value={selectedDevice.device_label || device_label}
                    // // value={selectedDevice?.model_name || ''}
                    // onChange={(e) => device_label===(e.target.value)}
                    // onChange={(e) => setSelectedDevice(devices.find(device => device.device_label === e.target.value))}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  />
                    {/* {devices.map((device) => (
                  <MenuItem key={device.id} value={device.model_name}>
                    {device.model_name}
                  </MenuItem>
                ))} */}
                  
                  <TextField
                    // select
                    label="Model Name"
                    value={selectedDevice.model_name || ""}
                    // value={selectedDevice?.model_name || ''}
                    // onChange={(e) => setSelectedDevice(devices.find(device => device.model_name === e.target.value))}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    {/* {devices.map((device) => (
                  <MenuItem key={device.id} value={device.model_name}>
                    {device.model_name}
                  </MenuItem>
                ))} */}
                  </TextField>
                </Box>

                <Box display="flex" gap={2}>
                <Field
                    as={TextField}
                    margin="dense"
                    label="Latitude"
                    name="latitude"
                    // value={latitude || selectedDevice.latitude || null}
                    // onChange={(e) => setLatitude(e.target.value)}
                    value={selectedDevice.latitude}
                    onChange={(e) =>
                      setSelectedDevice({ ...selectedDevice, latitude: e.target.value })
                    }
                    onBlur={handleBlur}
                error={touched.latitude && Boolean(errors.latitude)}
                helperText={touched.latitude && errors.latitude}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                    />
                 <Field
                    as={TextField}
                  
                   margin="dense"
                    label="Longitude" 
                    name="longitude"
                    // value={longitude || selectedDevice.longitude || null}
                    // onChange={(e) => setLongitude(e.target.value)}
                    value={selectedDevice.longitude}
                    onChange={(e) =>
                      setSelectedDevice({ ...selectedDevice, longitude: e.target.value })
                    }
                    onBlur={handleBlur}
                error={touched.longitude && Boolean(errors.longitude)}
                helperText={touched.longitude && errors.longitude}
                    
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  />
                </Box>
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    label="Farm Name"
                    value={selectedDevice.farm_id || selectedFarm}
                    // value={selectedDevice?.id || ''}
                    onChange={(e) => setSelectedFarm(e.target.value)}
                    // onChange={(e) => setFarmName(e.target.value)}
                    
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    
                    {farmDetails.map((farm) => (
                      <MenuItem key={farm.id} value={farm.id}>
                        {farm.farm_name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Farm ID"
                    value={selectedDevice.farm_id || selectedFarm}
                    onChange={(e) => setSelectedFarm(e.target.value)}
                    // onChange={(e) => setFarmId(e.target.value)}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    {farmDetails.map((farm) => (
                      <MenuItem key={farm.id} value={farm.id}>
                        FID{farm.id}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box display="flex" gap={2}>
                <Field
                    as={TextField}
                    select
                    label="Manager Name"
                    name="manager_name" 
                    value={selectedManager}
                   
                    fullWidth
                    
                    onChange={(e) => setSelectedManager(e.target.value)}
                    // value={managerName}
                    // onChange={(e) => setManagerName(e.target.value)}
                    onBlur={handleBlur}
        error={touched.manager_name && Boolean(errors.manager_name)}
        helperText={touched.manager_name && errors.manager_name}
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    
                    {managerDetails.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.full_name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    select
                    label="Manager ID"
                    name="managerId"
                    value={selectedManager}
                    fullWidth
                    onBlur={handleBlur}
              error={touched.managerId && Boolean(errors.managerId)}
              helperText={touched.managerId && errors.managerId}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    // value={managerId}
                    // onChange={(e) => setManagerId(e.target.value)}
                    
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                      "&:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0 1000px rgba(199, 221, 211) inset",
                        WebkitTextFillColor: "black",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  >
                    {managerDetails.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        UID{manager.id}
                      </MenuItem>
                    ))}
                                    </Field>

                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="success" variant="contained" disabled={isSubmitting} >
              Assign
            </Button>
          </DialogActions>
          </Form>
        )}
      </Formik>
        </Dialog>

        {/* ---------------------------Add Device--------------------------------------
        <Dialog
          open={openAdd}
          onClose={handleCloseAdd}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <center>
            <DialogTitle>
              After completing the template, upload your file
              <br />
              Click <Link href="#">here</Link> to download the template file.
            </DialogTitle>
          </center>
          <div
            style={{
              border: "2px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              margin: "20px auto",
            }}
          >
            <center>
              <DialogContent>
                <p>
                  Choose a file or drag & drop it here
                  <br />
                  JPEG, PNG, PDF, and MP4 formats, up to 50MB
                </p>
                <br />
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Browse file
                  <input type="file" hidden />
                </Button>
              </DialogContent>
            </center>
          </div>
          <DialogActions>
            <Button onClick={handleCloseAdd} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCloseAdd} color="success">
              Submit
            </Button>
          </DialogActions>
        </Dialog> */}
      </Container>
      <Footer2 />
      <DateTime />
      
    </div>
  );
}