import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Container,
  Box,
  Fab,
  Pagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  TextField,
  Link,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import NavBar7 from "../../Components/NavBar7";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer1 from "../../Components/Footer1.js";
import DateTime from "../../Components/DateTime";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Footer2 from "../../Components/Footer2.js";
import { useFormik } from "formik";
import * as Yup from "yup";

// const initialFarms = [
//   { id: 'C001', device: "Device A1, Device A2, Device A3", name: 'John Dave', address: '23, 2nd Lane, Colombo 13', phone: '0754689523', email: 'john@gmail.com', designation: 'Badulla Plantations', profilePic: '', managerId: 'M001', managerName: 'Manager A' },
//   { id: 'C002', device: '', name: 'De Silva', address: '34, Kandy', phone: '0758965412', email: 'silva@gmail.com', designation: 'Haputale Plantations', profilePic: '', managerId: 'M002', managerName: 'Manager B' },
//   // more initial data...
// ];

export default function CustomerAdminFarms() {
  //const [farms, setFarms] = useState(initialFarms);
  const [farms, setFarms] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(4);
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [expandedUsers, setExpandedUsers] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;

  const validationSchema = Yup.object().shape({
    farm_name: Yup.string().required("Farm Name is required"),
    farmAddress: Yup.string().required("Address is required"),
    farmContactNo: Yup.string()
    .matches(/^[0-9]{10,}$/, "Contact No must contain at least 10 digits")
    .required("Contact No is required"),
    farmEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      farm_name: selectedFarm?.farm_name || "",
      farmAddress: selectedFarm?.farmAddress || "",
      farmContactNo: selectedFarm?.farmContactNo || "",
      farmEmail: selectedFarm?.farmEmail || "",
      managers: selectedFarm?.managers || [{ id: "", full_name: "" }],
    },
    validationSchema,
    onSubmit: (values) => {
      handleSaveEdit(values); // Pass the form values to the save function
      handleCloseEdit();
    },
    enableReinitialize: true, // Allows the form to reset when selectedFarm changes
  });


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      setErrorMessage(''); // Clear any previous error messages
    } else {
      setFile(null); // Clear the file state
      setErrorMessage('Please upload a valid Excel file (.xlsx).');
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
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

      const fetchFarms = async () => {
        try {
          const response = await axios.get(
            `/api/farm/${userId}`
          );
          setFarms(response.data);
        } catch (error) {
          console.error("Error fetching farms:", error);
        }
      };

      fetchFarms();
    }
  }, [userId]);

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the farm data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
          await axios.post(
            `/api/farm/upload/${userId}`,
            jsonData
          );

          handleCloseAdd();
          setFileName("");
          setFile(null);
          alert("Farms uploaded successfully!");
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
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    
  };

  const handleEdit = (farm) => {
    setSelectedFarm(farm);
    setOpenEdit(true);
  };
  const handleExpand = (farm) => {
    setExpandedUsers(expandedUsers === farm ? null : farm);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };


  
  const handleSaveEdit = async () => {
    if (!selectedFarm) return;
  
    try {
      // Send the PUT request to update the farm
      await axios.put(`/api/farm/${selectedFarm.id}`, selectedFarm);
  
      console.log("Farm updated successfully");
  
      // Update the table data state with the updated farm details
      setFarms((prevData) =>
        prevData.map((farm) => (farm.id === selectedFarm.id ? selectedFarm : farm))
      );
  
      setOpenEdit(false); // Close the dialog
      alert("Farm updated successfully");
    } catch (error) {
      console.error("Error updating farm:", error);
      alert("An unexpected error occurred.");
    }
  };
  
  const handleDelete = (farmId) => {
    setSelectedItemForDelete(farmId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const confirmDelete = async () => {
    if (selectedItemForDelete) {
      try {
        await axios.delete(
          `/api/farm/${selectedItemForDelete}`
        );
        alert("Farm deleted successfully");
        setFarms(farms.filter((farm) => farm.id !== selectedItemForDelete));
      } catch (error) {
        console.error("Error deleting farm:", error);
        alert("An unexpected error occurred.");
      }
    }
    setOpenDelete(false);
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setFileName(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    
  };

  const paginatedFarms = farms.slice(
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
       

        <Typography
          variant="h6"
          align="center"
          gutterBottom
          marginTop={11}
          fontWeight={600}
        >
          Company name: {companyName}
        </Typography>
        {(isMobile || isTablet) && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 140, sm: 130, md: 110, lg: 58 },
              right: { xs: 10, sm: 10, md: 16, lg: 16 },
              zIndex: 1000,
            }}
          >
            <Fab color="primary" aria-label="add" onClick={handleAdd}>
              <Add />
            </Fab>
          </Box>
        )}

        {isDesktop && (
          <Box position="absolute" top={110} right={16} zIndex={1000}>
            {" "}
            <Fab color="primary" aria-label="add" onClick={handleAdd}>
              <Add />
            </Fab>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "20px", sm: "20px", md: "2px", lg: "2px" },
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
                    <TableCell sx={{ fontWeight: "bold" }}>Farm ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Farm Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Devices</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Farm Address
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Farm Contact No
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Farm Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Manager ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Manager Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFarms.map((farm) => (
                    <TableRow key={farm.id}>
                      <TableCell>FID{farm.id}</TableCell>
                      <TableCell>{farm.farm_name}</TableCell>
                      <TableCell>
                        {" "}
                        <ul
                          style={{
                            listStyleType: "none",
                            paddingLeft: 0,
                            margin: 0,
                          }}
                        >
                          {farm.devices.map((device, index) => (
                            <li key={index}>Device {device.id}</li>
                          ))}
                        </ul>
                        {/* {(farm.device || '').split(', ').map((param, index) => (
                      <div key={index}>{param}</div>
                    ))} */}
                      </TableCell>
                      <TableCell>{farm.farmAddress}</TableCell>
                      <TableCell>{farm.farmContactNo}</TableCell>
                      <TableCell>{farm.farmEmail}</TableCell>
                      <TableCell>
                        {" "}
                        <ul
                          style={{
                            listStyleType: "none",
                            paddingLeft: 0,
                            margin: 0,
                          }}
                        >
                          {farm.managers.map((manager, index) => (
                            <li key={index}>UID{manager.id}</li>
                          ))}
                        </ul>
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
                          {farm.managers.map((manager, index) => (
                            <li key={index}>{manager.full_name}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(farm)}
                            color="success"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={() => handleDelete(farm.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={2}>
              {paginatedFarms.map((farm) => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={farm.id}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "rgba(199, 221, 211)" }}
                  >
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>Farm ID</strong>
                          </TableCell>{" "}
                          <TableCell>FID{farm.id}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Farm Name</strong>{" "}
                          </TableCell>
                          <TableCell>{farm.farm_name}</TableCell>
                        </TableRow>

                        {expandedUsers === farm.id || !isTablet ? (
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>Devices</strong>
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
                                  {farm.devices.map((device, index) => (
                                    <li key={index}>Device {device.id}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong> Farm Address</strong>{" "}
                              </TableCell>
                              <TableCell>{farm.farmAddress}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Farm Contact No</strong>{" "}
                              </TableCell>
                              <TableCell>{farm.farmContactNo}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong>Farm Email</strong>
                              </TableCell>
                              <TableCell>{farm.farmEmail}</TableCell>
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
                                  {farm.managers.map((manager, index) => (
                                    <li key={index}>UID{manager.id}</li>
                                  ))}
                                </ul>
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
                                  {farm.managers.map((manager, index) => (
                                    <li key={index}>{manager.full_name}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(farm)}
                          color="success"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleDelete(farm.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                      {isTablet && (
                        <IconButton onClick={() => handleExpand(farm.id)}>
                          {expandedUsers === farm.id ? (
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
              count={Math.ceil(farms.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>

        {/*--------------------------------Edit farm--------------------*/}

        <Dialog
      open={openEdit}
      onClose={handleCloseEdit}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          backgroundColor: "rgba(199, 221, 211)",
        },
      }}
    >
      <DialogTitle>Edit Farm Details</DialogTitle>
      <br />
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Farm Name"
                name="farm_name"
                value={selectedFarm?.farm_name || ""}
                onChange={(e) => {
                  setSelectedFarm({ ...selectedFarm, farm_name: e.target.value });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.farm_name && Boolean(formik.errors.farm_name)}
                helperText={formik.touched.farm_name && formik.errors.farm_name}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="farmAddress"
                value={selectedFarm?.farmAddress || ""}
                onChange={(e) => {
                  setSelectedFarm({ ...selectedFarm, farmAddress: e.target.value });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.farmAddress && Boolean(formik.errors.farmAddress)}
                helperText={formik.touched.farmAddress && formik.errors.farmAddress}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact No"
                name="farmContactNo"
                value={selectedFarm?.farmContactNo || ""}
                onChange={(e) => {
                  setSelectedFarm({ ...selectedFarm, farmContactNo: e.target.value });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.farmContactNo && Boolean(formik.errors.farmContactNo)}
                helperText={formik.touched.farmContactNo && formik.errors.farmContactNo}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="farmEmail"
                value={selectedFarm?.farmEmail || ""}
                onChange={(e) => {
                  setSelectedFarm({ ...selectedFarm, farmEmail: e.target.value });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.farmEmail && Boolean(formik.errors.farmEmail)}
                helperText={formik.touched.farmEmail && formik.errors.farmEmail}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager IDs"
                name="managers"
                value={
                  selectedFarm?.managers.map((manager) => manager.id).join("\n") || ""
                }
                onChange={(e) => {
                  const ids = e.target.value.split("\n");
                  setSelectedFarm({
                    ...selectedFarm,
                    managers: ids.map((id, index) => ({
                      id,
                      full_name: selectedFarm.managers[index]?.full_name || "",
                    })),
                  });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.managers && Boolean(formik.errors.managers)}
                helperText={formik.touched.managers && formik.errors.managers}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager Names"
                name="managerNames"
                value={
                  selectedFarm?.managers.map((manager) => manager.full_name).join("\n") ||
                  ""
                }
                onChange={(e) => {
                  const names = e.target.value.split("\n");
                  setSelectedFarm({
                    ...selectedFarm,
                    managers: names.map((full_name, index) => ({
                      id: selectedFarm.managers[index]?.id || "",
                      full_name,
                    })),
                  });
                  formik.handleChange(e); // Update Formik value
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.managers && Boolean(formik.errors.managers)}
                helperText={formik.touched.managers && formik.errors.managers}
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
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow:
                      "0 0 0 1000px rgba(199, 221, 211) inset",
                    WebkitTextFillColor: "black",
                    transition:
                      "background-color 5000s ease-in-out 0s",
                  },
                }}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEdit} color="primary">
          Cancel
        </Button>
        <Button onClick={formik.handleSubmit} color="success">
          Save
        </Button>
      </DialogActions>
    </Dialog>

        {/*--------------------------------Delete farm--------------------*/}
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete farm"}</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this farm?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              No
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/*--------------------------------Add farm--------------------*/}
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
              Click {" "} <Link 
                variant="contained"
                color="primary"
                href="/Sample_Farms.xlsx"
                download="Sample_Farms.xlsx">here</Link>{" "} to download the template file.
            </DialogTitle>
          </center>
          <div
            style={{
              border: "2px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              margin: "20px auto",
              backgroundColor: dragActive ? "#e6f7ff" : "#fff",
            }}
            onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
          >
            <center>
              <DialogContent>
                <p>
                  Choose a file or drag & drop it here
                  <br />
                  Excel format (.xlsx), up to 50MB
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
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {fileName && (
                  <p style={{ marginTop: "10px" }}>Selected File: {fileName}</p>
                )}
                {errorMessage && (
          <p style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</p>
        )}
              </DialogContent>
            </center>
          </div>
          <DialogActions>
            <Button onClick={handleCloseAdd} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="success">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer2 />
      <DateTime />
    </div>
  );
}
