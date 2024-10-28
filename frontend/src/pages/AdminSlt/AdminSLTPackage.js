import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Fab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import NavBar2 from "../../Components/NavBar2";
import Footer1 from "../../Components/Footer1.js";
import { Edit, Delete, Add } from "@mui/icons-material";
import DateTime from "../../Components/DateTime";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Footer2 from "../../Components/Footer2.js";

export default function AdminSLTPackage() {
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [parameterError, setParameterError] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [allParameters, setAllParameters] = useState([]);
  const [latestID, setLatestID] = useState(null);
  const [newPackage, setNewPackage] = useState({
    id: "",
    packageName: "",
    connectivityType: [],
    monthlyRental: "",
    features: [],
    poleOrPortable: "",
    landingPageVisibility: false,
    parameters: [],
    fixedCharge: "",
  });
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [errors, setErrors] = useState({
    packageName: "",
    connectivityType: "",
    poleOrPortable: "",
    fixedCharge: "",
    monthlyRental: "",
    parameters: "",
  });

  const validateParameters = () => {
    if (newPackage.parameters.length === 0) {
      setParameterError(true);
      return false;
    } else {
      setParameterError(false);
      return true;
    }
  };

  const [monthlyRentalError, setMonthlyRentalError] = useState("");
  useEffect(() => {
    // Reset error when the dialog opens
    if (openEdit) {
      setMonthlyRentalError("");
    }
  }, [openEdit]);

  const validateMonthlyRental = (value) => {
    // Check if the value is empty
    if (!value) {
      setMonthlyRentalError("Monthly Rental is required.");
      return false;
    }
    // Check if the value is a valid number
    if (isNaN(value) || parseFloat(value) <= 0) {
      setMonthlyRentalError(
        "Monthly Rental must be a valid number greater than 0."
      );
      return false;
    }
    // If valid, reset the error
    setMonthlyRentalError("");
    return true;
  };

  const handleMonthlyRentalChange = (event) => {
    const { value } = event.target;
    handleEditChange(event); // Call the existing change handler
    validateMonthlyRental(value); // Validate the new value
  };

  const handleSave = () => {
    const isValid = validateMonthlyRental(selectedPackage.monthlyRental);
    if (isValid) {
      handleSaveEdit(); // Call the save function if valid
    }
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  useEffect(() => {
    if (isMobile) {
      setRowsPerPage(4); // Set 4 rows for mobile view
    } else if (isTablet) {
      setRowsPerPage(6); // Set 6 rows for tablet view
    } else if (isDesktop) {
      setRowsPerPage(2); // Set 2 rows for desktop view
    }
  }, [isMobile, isTablet, isDesktop]);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("/api/packages", config);
      setPackages(response.data);
    } catch (error) {
      alert("Error fetching packages:", error);
    }
  };

  const fetchLatestPackages = async () => {
    try {
      const response = await axios.get("/api/packages/latest_id");
      setLatestID(response.data);
    } catch (error) {
      alert("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await axios.get(`/api/parameters`);
        setAllParameters(response.data);
      } catch (err) {
        alert(err);
      }
    };

    fetchPackages();
    fetchParameters();
    fetchLatestPackages();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      packageName: "",
      connectivityType: "",
      poleOrPortable: "",
    };

    if (!newPackage.packageName) {
      newErrors.packageName = "Package Name is required";
      isValid = false;
    }

    if (!newPackage.fixedCharge) {
      newErrors.fixedCharge = "Fixed Charge is required";
      isValid = false;
    } else if (isNaN(newPackage.fixedCharge)) {
      newErrors.fixedCharge = "Fixed Charge must be a number";
      isValid = false;
    } else if (newPackage.fixedCharge < 0) {
      newErrors.fixedCharge = "Fixed Charge must be a positive number";
      isValid = false;
    }

    if (!newPackage.monthlyRental) {
      newErrors.monthlyRental = "This field is required";
      isValid = false;
    } else if (isNaN(newPackage.monthlyRental)) {
      newErrors.monthlyRental = "This field must be a number";
      isValid = false;
    } else if (newPackage.monthlyRental < 0) {
      newErrors.monthlyRental = "This field must be a positive number";
      isValid = false;
    }
    if (newPackage.connectivityType.length === 0) {
      newErrors.connectivityType = "This field is required";
      isValid = false;
    }

    if (!newPackage.poleOrPortable) {
      newErrors.poleOrPortable = "Pole/Portable selection is required";
      isValid = false;
    }
    if (!newPackage.parameters.length) {
      newErrors.parameters = "At least one parameter needs to be selected";
    }

    setErrors(newErrors);
    return isValid;
  };

  const postPackageData = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");
      const packageData = {
        ...newPackage,
        parameters: newPackage.parameters,
        monthlyRental: parseFloat(newPackage.monthlyRental),
        fixedCharge: parseFloat(newPackage.fixedCharge),
      };
      const response = await axios.post(`/api/packages`, packageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackages((prev) => [...prev, response.data]);
      alert("Package added successfully!")
      handleCloseAdd();
    } catch (error) {}
  };

  const handleAddParameterChange = (event) => {
    const { value, checked } = event.target;

    setNewPackage((prev) => {
      const currentParameters = prev.parameters || [];

      // Add the parameter if checked, otherwise remove it
      const updatedParameters = checked
        ? [...new Set([...currentParameters, value])] // Prevent duplicates
        : currentParameters.filter((param) => param !== value);

      return {
        ...prev,
        parameters: updatedParameters,
      };
    });
  };
  const handleExpand = (pkg) => {
    setExpandedPackage(expandedPackage === pkg ? null : pkg);
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setNewPackage((prev) => ({
      ...prev,
      connectivityType: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const poleOptions = ["Pole", "Portable"];

  const handleChangePoleAdd = (event) => {
    const { value } = event.target;
    setNewPackage((prev) => ({ ...prev, poleOrPortable: value }));
  };

  const handleNewPackageChange = (event) => {
    const { name, value } = event.target;
    setNewPackage((prev) => ({
      ...prev,
      [name]:
        name === "features"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedPackage(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewPackage({
      id: "",
      packageName: "",
      connectivityType: [],
      monthlyRental: "",
      features: [],
      poleOrPortable: "",
      landingPageVisibility: false,
      parameters: [],
      fixedCharge: "",
    });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "parameters") {
      setSelectedPackage((prev) => {
        const updatedParameters = checked
          ? [...prev.parameters, value]
          : prev.parameters.filter((param) => param !== value);

        return { ...prev, parameters: updatedParameters };
      });
    } else {
      setSelectedPackage((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedItemForDelete(null);
  };

  const confirmDelete = async () => {
    if (selectedItemForDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/packages/${selectedItemForDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPackages((prevPackages) =>
          prevPackages.filter((pkg) => pkg.id !== selectedItemForDelete)
        );
      } catch (error) {
        alert("Error deleting package:", error);
      }
    }
    handleCloseDelete();
  };

  const handleSaveEdit = async () => {
    if (selectedPackage) {
      try {
        const token = localStorage.getItem("token");
        const updatedPackage = {
          ...selectedPackage,
          parameters: selectedPackage.parameters,
          monthlyRental: parseFloat(selectedPackage.monthlyRental),
          fixedCharge: parseFloat(selectedPackage.fixedCharge),
          landingPageVisibility: selectedPackage.landingPageVisibility,
        };
        await axios.put(`/api/packages/${selectedPackage.id}`, updatedPackage, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPackages((prevPackages) =>
          prevPackages.map((pkg) =>
            pkg.id === selectedPackage.id ? updatedPackage : pkg
          )
        );
        alert("Package updated successfully");
        handleCloseEdit();
      } catch (error) {}
    }
  };

  const handleCheckboxChange = async (event, id) => {
    const { checked } = event.target;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/packages/${id}`,
        { landingPageVisibility: checked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === id ? { ...pkg, landingPageVisibility: checked } : pkg
        )
      );
    } catch (error) {
      alert("Error updating landing page visibility:", error);
    }
  };

  const paginatedPackages = packages.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    padding: "0px 0px 90px 0px",
    minHeight: "100vh",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  const formatCurrency = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }
    return value;
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
              position: "absolute",
              top: { xs: 60, sm: 70, md: 68, lg: 58 },
              right: { xs: 10, sm: 10, md: 16, lg: 16 },
              zIndex: 1000,
            }}
          >
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpenAdd(true)}
            >
              <Add />
            </Fab>
          </Box>
        )}

        {isDesktop && (
          <Box position="absolute" top={69} right={16} zIndex={1000}>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpenAdd(true)}
            >
              <Add />
            </Fab>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "110px", sm: "100px", md: "96px", lg: "90px" },
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
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Package ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                      Parameters
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Connectivity type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 120 }}>
                      Fixed Charge (LKR)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 90 }}>
                      Monthly Rental (LKR)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Features</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Pole/Portable
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Landing Page Visibility
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>PID{pkg.id}</TableCell>
                      <TableCell>{pkg.packageName}</TableCell>
                      <TableCell sx={{ width: "200px" }}>
                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                          {pkg.parameters.map((param, index) => (
                            <li key={index} style={{ listStyleType: "disc" }}>
                              {param}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {pkg.connectivityType.map((param, index) => (
                          <div key={index}>{param}</div>
                        ))}
                      </TableCell>{" "}
                      <TableCell>Rs {formatCurrency(pkg.fixedCharge)}</TableCell>
                      <TableCell>Rs {formatCurrency(pkg.monthlyRental)}</TableCell>
                      <TableCell>
                        {pkg.features.map((param, index) => (
                          <div key={index}>{param}</div>
                        ))}
                      </TableCell>{" "}
                      <TableCell>{pkg.poleOrPortable}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={pkg.landingPageVisibility}
                          onChange={(event) =>
                            handleCheckboxChange(event, pkg.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(pkg)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setSelectedItemForDelete(pkg.id);
                              setOpenDelete(true);
                            }}
                            color="error"
                          >
                            <Delete />
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
              {paginatedPackages.map((pkg) => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={pkg.id}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "rgba(199, 221, 211)" }}
                  >
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>Package ID:</strong>
                          </TableCell>
                          <TableCell>PID{pkg.id}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Name:</strong>
                          </TableCell>
                          <TableCell>{pkg.packageName}</TableCell>
                        </TableRow>

                        {expandedPackage === pkg.id || !isTablet ? (
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>Parameters:</strong>
                              </TableCell>
                              <TableCell sx={{ width: "200px" }}>
                                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                  {pkg.parameters.map((param, index) => (
                                    <li
                                      key={index}
                                      style={{ listStyleType: "disc" }}
                                    >
                                      {param}
                                    </li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Connectivity type:</strong>
                              </TableCell>
                              <TableCell>
                                {pkg.connectivityType.map((type, index) => (
                                  <Typography key={index}>{type}</Typography>
                                ))}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Fixed Charge (LKR):</strong>
                              </TableCell>
                              <TableCell>{pkg.fixedCharge}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Monthly Rental (LKR):</strong>
                              </TableCell>
                              <TableCell>{pkg.monthlyRental}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Features:</strong>
                              </TableCell>
                              <TableCell>
                                {pkg.features.map((feature, index) => (
                                  <Typography key={index}>{feature}</Typography>
                                ))}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong> Pole/Portable:</strong>
                              </TableCell>
                              <TableCell>{pkg.poleOrPortable}</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <strong>Landing Page Visibility:</strong>
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={pkg.landingPageVisibility}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, pkg.id)
                                  }
                                />
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(pkg)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setSelectedItemForDelete(pkg.id);
                            setOpenDelete(true);
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {isTablet && (
                        <IconButton onClick={() => handleExpand(pkg.id)}>
                          {expandedPackage === pkg.id ? (
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
              count={Math.ceil(packages.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>

        {/*--------------------------------Add package--------------------*/}

        <Dialog
          open={openAdd}
          onClose={handleCloseAdd}
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle>Add New Package</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Grid container spacing={1}>
                <Grid item xs={6} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="id"
                    label="Package ID"
                    value={`PID${latestID}`}
                    onChange={handleNewPackageChange}
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
                    disabled
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="packageName"
                    label="Package Name"
                    value={newPackage.packageName}
                    onChange={handleNewPackageChange}
                    error={Boolean(errors.packageName)}
                    helperText={errors.packageName}
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& .MuiFormLabel-root": {
                        color: "gray", // Set label color to gray
                      },
                      "& .MuiFormLabel-root.Mui-error": {
                        color: "gray", // Ensure error state also uses gray
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Parameters</p>
                  {errors.parameters && (
                    <FormHelperText error>{errors.parameters}</FormHelperText>
                  )}
                </Grid>

                <Box
                  display="flex"
                  sx={{ marginLeft: { xs: "0px", sm: "50px", md: "90px" } }}
                >
                  <Box flex={1} sx={{ maxWidth: "100%", marginRight: 0 }}>
                    <FormGroup>
                      {allParameters
                        .slice(0, Math.ceil(allParameters.length / 2))
                        .map((param) => (
                          <FormControlLabel
                            key={param}
                            control={
                              <Checkbox
                                checked={newPackage.parameters.includes(param)}
                                onChange={handleAddParameterChange}
                                value={param}
                              />
                            }
                            label={param}
                          />
                        ))}
                    </FormGroup>
                  </Box>
                  <FormGroup>
                    {allParameters
                      .slice(Math.ceil(allParameters.length / 2))
                      .map((param) => (
                        <FormControlLabel
                          key={param}
                          control={
                            <Checkbox
                              checked={newPackage.parameters.includes(param)}
                              onChange={handleAddParameterChange}
                              value={param}
                            />
                          }
                          label={param}
                        />
                      ))}
                  </FormGroup>
                </Box>

                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.connectivityType)}
                    sx={{
                      "& .MuiInputLabel-root.Mui-error": {
                        color: "gray", // Set label color to gray when there is an error
                      },
                      "& .MuiSelect-root.Mui-error": {
                        color: "gray", // Ensure select text color is gray when there is an error
                      },
                    }}
                  >
                    <InputLabel>Connectivity Type</InputLabel>
                    <Select
                      multiple
                      value={newPackage.connectivityType}
                      onChange={handleChange}
                      label="Connectivity Type"
                      renderValue={(selected) => selected.join(", ")}
                      sx={{
                        "& .MuiSelect-select": {
                          color: (theme) => theme.palette.text.primary, // Default text color for select
                        },
                        "& .MuiSelect-select.Mui-error": {
                          color: "gray", // Text color for select when there is an error
                        },
                      }}
                    >
                      <MenuItem value="WIFI">WIFI</MenuItem>
                      <MenuItem value="4G">4G</MenuItem>
                      <MenuItem value="NBIOT">NBIOT</MenuItem>
                    </Select>
                    <FormHelperText>{errors.connectivityType}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="fixedCharge"
                    label="Fixed Charge"
                    value={newPackage.fixedCharge}
                    onChange={handleNewPackageChange}
                    error={Boolean(errors.fixedCharge)}
                    helperText={errors.fixedCharge}
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& .MuiFormLabel-root": {
                        color: "gray", // Set label color to gray
                      },
                      "& .MuiFormLabel-root.Mui-error": {
                        color: "gray", // Ensure error state also uses gray
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
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="monthlyRental"
                    label="Monthly Rental"
                    value={newPackage.monthlyRental}
                    onChange={handleNewPackageChange}
                    error={Boolean(errors.monthlyRental)}
                    helperText={errors.monthlyRental}
                    sx={{
                      "& .MuiInputBase-root": {
                        "&:after": {
                          borderBottomColor: "green",
                        },
                      },
                      "& .MuiFormLabel-root": {
                        color: "gray", // Set label color to gray
                      },
                      "& .MuiFormLabel-root.Mui-error": {
                        color: "gray", // Ensure error state also uses gray
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
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    maxRows={25}
                    name="features"
                    label="Features"
                    value={newPackage.features.join(",")}
                    onChange={handleNewPackageChange}
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
                </Grid>

                <Grid item xs={6} sm={6}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.poleOrPortable)}
                    sx={{
                      "& .MuiInputLabel-root.Mui-error": {
                        color: "gray", // Set label color to gray when there is an error
                      },
                      "& .MuiSelect-root.Mui-error": {
                        color: "gray", // Ensure select text color is gray when there is an error
                      },
                    }}
                  >
                    <InputLabel>Pole/Portable</InputLabel>
                    <Select
                      value={newPackage.poleOrPortable}
                      onChange={handleChangePoleAdd}
                      label="Pole/Portable"
                      sx={{
                        "& .MuiSelect-select": {
                          color: (theme) => theme.palette.text.primary, // Default text color for select
                        },
                        "& .MuiSelect-select.Mui-error": {
                          color: "gray", // Text color for select when there is an error
                        },
                      }}
                    >
                      {poleOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.poleOrPortable}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd}>Cancel</Button>
            <Button onClick={postPackageData}>Add</Button>
          </DialogActions>
        </Dialog>

        {/*--------------------------------Edit Package--------------------*/}
        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="edit-dialog-title"
          aria-describedby="edit-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
              width: "500px",
            },
          }}
        >
          <DialogTitle id="edit-dialog-title">
            {selectedPackage?.name}
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h3>Edit Package</h3>
            </Box>

            <p>Select Parameters</p>
            {selectedPackage && (
              <Box display="flex">
                <Box flex={1} sx={{ maxWidth: "50%", paddingRight: 1 }}>
                  <FormGroup>
                    {allParameters
                      .slice(0, Math.ceil(allParameters.length / 2))
                      .map((param) => (
                        <FormControlLabel
                          key={param}
                          control={
                            <Checkbox
                              name="parameters"
                              value={param}
                              checked={selectedPackage.parameters.includes(
                                param
                              )}
                              onChange={handleEditChange}
                            />
                          }
                          label={param}
                        />
                      ))}
                  </FormGroup>
                </Box>
                <Box flex={1} sx={{ maxWidth: "50%" }}>
                  <FormGroup>
                    {allParameters
                      .slice(Math.ceil(allParameters.length / 2))
                      .map((param) => (
                        <FormControlLabel
                          key={param}
                          control={
                            <Checkbox
                              name="parameters"
                              value={param}
                              checked={selectedPackage.parameters.includes(
                                param
                              )}
                              onChange={handleEditChange}
                            />
                          }
                          label={param}
                        />
                      ))}
                  </FormGroup>
                </Box>
              </Box>
            )}
            <TextField
              margin="normal"
              fullWidth
              name="monthlyRental"
              label="Monthly Rental (LKR)"
              value={selectedPackage?.monthlyRental || ""}
              onChange={handleMonthlyRentalChange}
              error={!!monthlyRentalError} // Show error state if there is an error
              helperText={monthlyRentalError}
              sx={{
                "& .MuiInputBase-root": {
                  "&:after": {
                    borderBottomColor: "green",
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px rgba(199, 221, 211) inset",
                  WebkitTextFillColor: "black",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px rgba(199, 221, 211) inset",
                  WebkitTextFillColor: "black",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/*--------------------------------Delete package--------------------*/}
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
          <DialogTitle id="alert-dialog-title">{"Delete package"}</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this package?</p>
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
      </Container>
      <Footer2 />
      <DateTime />
    </div>
  );
}
