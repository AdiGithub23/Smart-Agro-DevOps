import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as XLSX from "xlsx";
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
  FormControl,
  InputLabel,
  Select,
  Link,
  DialogContentText,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import NavBar2 from "../../Components/NavBar2";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Footer1 from "../../Components/Footer1.js";
import DateTime from "../../Components/DateTime";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Footer2 from "../../Components/Footer2.js";



// const inventryDetails = [
//   { serialNo: 'SN001',deviceType:'Pole' ,modelName: 'Portable 15', package: 'Package A', secretCode: '0754689523', status: 'In Stock' },
//   { serialNo: 'SN002',deviceType:'Pole' , modelName: 'Portable 16', package: 'Package B', secretCode: '0758965412', status: 'Assigned' },
//   { serialNo: 'SN003',deviceType:'Portable' , modelName: 'Portable 17', package: 'Package C', secretCode: '0754689523', status: 'In Stock' },
//   { serialNo: 'SN004',deviceType:'Portable' , modelName: 'Portable 18', package: 'Package D', secretCode: '0758965412', status: 'Assigned' },
//   { serialNo: 'SN005',deviceType:'Pole' , modelName: 'Portable 19', package: 'Package E', secretCode: '0754689523', status: 'In Stock' },
//   { serialNo: 'SN006',deviceType:'Pole' , modelName: 'Portable 20', package: 'Package F', secretCode: '0758965412', status: 'Assigned' },
//   { serialNo: 'SN007',deviceType:'Portable' , modelName: 'Portable 21', package: 'Package G', secretCode: '0754689523', status: 'In Stock' },
//   { serialNo: 'SN008',deviceType:'Portable' , modelName: 'Portable 22', package: 'Package H', secretCode: '0758965412', status: 'Assigned' },
// ];

// const customerDetails = [
//   { id: 1, userName: 'User1', companyName: 'Company1' },
//   { id: 2, userName: 'User2', companyName: 'Company2' },
// ];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AdminSLTInventry() {
  // const [users, setUsers] = useState(inventryDetails);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPackage, setCurrentPackage] = useState("");
  const [editPackageName, setEditPackageName] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [visibleSecretCodes, setVisibleSecretCodes] = useState({});
  const navigate = useNavigate();
  // const packageIds = ["P001", "P002", "P003"];
  const [packageIds, setPackages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [expandedItems, setExpandedItems] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
 
  const [error, setError] = useState('');

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;

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

  const validationSchema = Yup.object().shape({
    customer: Yup.string()
    .required('Customer ID is required'),
  latitude: Yup.number()
    .typeError('Latitude must be a number')
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: Yup.number()
    .typeError('Longitude must be a number')
    
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
    editPackageName: Yup.string().required("Package ID is required"),
  });

  const initialValues = {
    editPackageName: ''
  };
  

  const handleFormSubmit = () => {
    if (!file) {
      setErrorMessage('Please select a file before submitting.');
    } else {
      handleSubmit();
    }
  };

  const downloadSample = () => {
    const excelUrl = "Sample/Sample_Inventory.xlsx";
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "Sample_Inventory.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(
        "/api/inventory"
      );
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  
  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        "/api/packages"
      );
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching package ids:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "/api/user/customer-admins"
      );
      setCustomerDetails(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchInventoryItems();
      fetchPackages();
      fetchCustomers();
    }
  }, [userId]);

  const handleExpand = (id) => {
    setExpandedItems(expandedItems === id ? null : id);
  };

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

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the inventory data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
          const response = await axios.post(
            "/api/inventory",
            jsonData
          );
          handleCloseAdd();
          setFileName("");
          setFile(null);
          alert("Inventory uploaded successfully!");
          fetchInventoryItems();
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


  const handleUpdate = () => {
    // Validate the field
    if (!editPackageName) {
      setError('Package ID is required');
      return; // Prevent submission if validation fails
    }

    setError(''); // Clear error if validation passes
    handleSubmitEdit(editPackageName); // Call the submit function with the selected value
  };

  const handleEdit = (id) => {
    const item = inventoryItems.find((item) => item.id === id);
    setSelectedItem(id);
    setCurrentPackage(item.package_id);
    setOpenEdit(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // const confirmDelete = () => {
  //   if (selectedItemForDelete) {
  //     setInventoryItems(inventoryItems.filter(item => item.serial_no !== selectedItemForDelete));
  //   }
  //   setOpenDelete(false);
  // };

  const confirmDelete = () => {
    if (selectedItemForDelete) {
      try {
        axios.delete(
          `/api/inventory/${selectedItemForDelete}`
        );
        alert("Inventory deleted successfully!");

        setInventoryItems(
          inventoryItems.filter((item) => item.id !== selectedItemForDelete)
        );
      } catch (error) {
        console.error("Error deleting inventory item:", error);
        alert("An unexpected error occurred.");
      }
    }
    setOpenDelete(false);
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAssign = (id) => {
    setSelectedItem(id);
    setOpenAssign(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(droppedFile);
      setErrorMessage('');
    } else {
      setErrorMessage('Please upload a valid Excel file (.xlsx).');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior to allow drop
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseAssign = () => {
    setOpenAssign(false);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSubmitAssign = async () => {
    if (selectedItem) {
      try {
        const assignmentDetails = {
          customer_id: selectedCustomer,
          assigned_SLT_admin: userId,
          latitude: latitude.trim() === "" ? null : latitude,
          longitude: longitude.trim() === "" ? null : longitude,
        };
  
        await axios.post(`/api/inventory/assign/${selectedItem}`, assignmentDetails);
        console.log("asssign",assignmentDetails);
        setInventoryItems(
          inventoryItems.map((item) =>
            item.id === selectedItem ? { ...item, status: "Assigned" } : item
          )
        );
  
        setOpenAssign(false);
        alert("Inventory Assigned to Customer Successfully!");
        setSelectedCustomer(''); 
        setLatitude('');  
        setLongitude('');   
        fetchInventoryItems();
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };


  const handleSubmitEdit = async () => {
    if (selectedItem) {
      try {
        const updatedItem = {
          package_id: editPackageName,
        };

        const response = await axios.put(
          `/api/inventory/${selectedItem}`,
          updatedItem
        );

        if (response && response.data) {
          setInventoryItems(
            inventoryItems.map((item) =>
              item.id === selectedItem
                ? { ...item, package_id: editPackageName }
                : item
            )
          );

          setOpenEdit(false);
          alert(response.data.message || "Inventory updated successfully!"); 
        }
      } catch (error) {
        console.error("Error updating inventory item:", error);

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
    } else {
      console.log("No item selected for editing.");
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDelete = (id) => {
    setSelectedItemForDelete(id);
    setOpenDelete(true);
  };

  const toggleSecretCodeVisibility = (serial_no) => {
    setVisibleSecretCodes((prevState) => ({
      ...prevState,
      [serial_no]: !prevState[serial_no],
    }));
  };

  const filteredItems = filterStatus
    ? inventoryItems.filter((item) => item.status === filterStatus)
    : inventoryItems;

  const paginatedItems = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const dialogContentStyle = {
    minHeight: "200px",
    maxHeight: "400px",
    padding: "50px",
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
              top: { xs: 65, sm: 72, md: 75, lg: 58 },
              right: { xs: 10, sm: 10, md: 16, lg: 16 },
              zIndex: 1000,
            }}
          >
            <Fab color="primary" aria-label="add" onClick={handleAdd}>
              <Add />
            </Fab>

            <Box
              sx={{
                width: { xs: 150, sm: 200, md: 250, lg: 250 },
                top: { xs: 10, sm: 10, md: 10, lg: 58 },
                right: { xs: 198, sm: 212, md: 350, lg: 250 },
                zIndex: 1000,
                position: "absolute",
              }}
            >
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
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="In Stock">In Stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {isDesktop && (
          <Box position="fixed" top={69} right={16} zIndex={1000}>
            <Fab color="primary" aria-label="add" onClick={handleAdd}>
              <Add />
            </Fab>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            padding: { xs: "4px", sm: "4px", md: "4px", lg: "2px" },
            marginTop: { xs: "140px", sm: "150px", md: "160px", lg: "90px" },
            marginLeft: { xs: "0px", sm: "110px", md: "80px", lg: "100px" },
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {" "}
          {isDesktop ? (
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "rgba(199, 221, 211)" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <center>Serial Number</center>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Device Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Model Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", marginLeft:"16px"}}>
                      Package Id
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Secret Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box sx={{ minWidth: 100 }}>
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
                            <MenuItem value="Assigned">Assigned</MenuItem>
                            <MenuItem value="In Stock">In Stock</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}><center>Action</center></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell><center>{item.serial_no}</center></TableCell>
                      <TableCell>{item.device_type}</TableCell>
                      <TableCell>{item.model_name}</TableCell>
                      <TableCell>PID{item.package_id}</TableCell>
                      <TableCell sx={{ padding: 1, width: "15%" }}>
    <Box display="flex" alignItems="center">
        <input
            type={visibleSecretCodes[item.id] ? "text" : "password"}
            value={item.secret_code}
            readOnly
            style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "inherit",
                fontFamily: "inherit",
                color: "inherit",
                width: "70%", // Adjust this as needed
            }}
        />
        <IconButton onClick={() => toggleSecretCodeVisibility(item.id)}>
            {visibleSecretCodes[item.id] ? (
                <Visibility />
            ) : (
                <VisibilityOff />
            )}
        </IconButton>
    </Box>
</TableCell>
                      <TableCell ><center>{item.status}</center></TableCell>
                      <TableCell><center>
                        <Tooltip title="Assign to customer">
                          <span>
                            <IconButton
                              onClick={() => handleAssign(item.id)}
                              aria-label="assign"
                              color="primary"
                              disabled={item.status === "Assigned"}
                            >
                              <PersonAddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(item.id)}
                            aria-label="edit"
                            color="success"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(item.id)}
                            aria-label="delete"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        </center>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={2}>
              {paginatedItems.map((item) => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={item.id}>
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "rgba(199, 221, 211)" }}
                  >
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell >
                            <strong>Serial Number</strong>
                          </TableCell>
                          <TableCell>{item.serial_no}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Device Type</strong>
                          </TableCell>
                          <TableCell>{item.device_type}</TableCell>
                        </TableRow>

                        {expandedItems === item.id || !isTablet ? (
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>Model Name</strong>
                              </TableCell>
                              <TableCell>{item.model_name}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Package Id</strong>
                              </TableCell>
                              <TableCell>PID{item.package_id}</TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell >
                                <strong>Secret Code</strong>
                              </TableCell>
                              <TableCell>
                                {" "}
                                
                                <input
                                  type={
                                    visibleSecretCodes[item.id]
                                      ? "text"
                                      : "password"
                                  }
                                  value={item.secret_code}
                                  readOnly
                                  style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    fontSize: "inherit",
                                    fontFamily: "inherit",
                                    color: "inherit",
                                    width: "70%", // Adjust this as needed
                                }}
                          
                                />
                                <IconButton
                                  onClick={() =>
                                    toggleSecretCodeVisibility(item.id)
                                  }
                                >
                                  {visibleSecretCodes[item.id] ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>Status</strong>
                              </TableCell>
                              <TableCell>{item.status}</TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Assign to customer">
                        <span>
                          <IconButton
                            onClick={() => handleAssign(item.id)}
                            aria-label="assign"
                            color="primary"
                            disabled={item.status === "Assigned"}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(item.id)}
                          aria-label="edit"
                          color="success"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(item.id)}
                          aria-label="delete"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {isTablet && (
                        <IconButton onClick={() => handleExpand(item.id)}>
                          {expandedItems === item.id ? (
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
              count={Math.ceil(filteredItems.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Paper>
      </Container>

      {/*--------------------------------Assign inventory--------------------*/}

      <Dialog
  open={openAssign}
  onClose={handleCloseAssign}
  sx={{
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      backgroundColor: "rgba(199, 221, 211)",
    },
  }}
>
  <DialogTitle>Assign Inventory</DialogTitle>
  <DialogContent>
    <Formik
      initialValues={{
        customer: '',
        latitude: '',
        longitude: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitAssign}
    >
      {({ isSubmitting, setFieldValue, resetForm, errors, touched }) => (
        <Form>
          <Box display="flex" justifyContent="space-between" marginBottom={2} width="xs: 300, sm: 500, md: 500, lg: 500">
          <FormControl fullWidth margin="dense" sx={{ marginRight: 1 }}>
  <InputLabel id="customer-id-label">Customer ID</InputLabel>
  <Select
    labelId="customer-id-label"
    label="Customer ID"
    value={selectedCustomer}
    onChange={(e) => {
      setSelectedCustomer(e.target.value);
      setFieldValue('customer', e.target.value); // Clear the error by updating Formik state
    }}
    error={Boolean(errors.customer && touched.customer)}
  >
    {customerDetails.map((customer) => (
      <MenuItem key={customer.id} value={customer.id}>
        UID{customer.id}
      </MenuItem>
    ))}
  </Select>
  {errors.customer && touched.customer && (
    <div style={{ color: 'red' }}>{errors.customer}</div>
  )}
</FormControl>

            <FormControl fullWidth margin="dense" sx={{ marginRight: 1 }}>
              <InputLabel id="user-name-label">User Name</InputLabel>
              <Select
                labelId="user-name-label"
                label="User Name"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                {customerDetails.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="company-name-label">Company Name</InputLabel>
              <Select
                labelId="company-name-label"
                label="Company Name"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                {customerDetails.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Field
              as={TextField}
              margin="dense"
              label="Latitude"
              name="latitude"
              fullWidth
              error={Boolean(errors.latitude && touched.latitude)}
              helperText={<ErrorMessage name="latitude" component="div" style={{ color: 'red' }} />}
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
                marginRight: 1,
              }}
            />

            <Field
              as={TextField}
              margin="dense"
              label="Longitude"
              name="longitude"
              fullWidth
              error={Boolean(errors.longitude && touched.longitude)}
              helperText={<ErrorMessage name="longitude" component="div" style={{ color: 'red' }} />}
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
                marginRight: 1,
              }}
            />
          </Box>

          <DialogActions>
            <Button
              onClick={() => {
                setSelectedCustomer('');
                setLatitude('');
                setLongitude('');
                handleCloseAssign();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitAssign} type="submit" color="success">
              Assign
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  </DialogContent>
</Dialog>

      {/*--------------------------------Add inventory--------------------*/}
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
          Click <Link
            variant="contained"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={downloadSample}
          >
            here
          </Link> to download the template file.  <br />
          After completing the template, upload your file
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
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Browse file
              <input type="file" hidden onChange={handleFileChange} accept=".xlsx" />
            </Button>
            {file && (
              <p style={{ marginTop: "20px" }}>Selected File: {file.name}</p>
            )}
            {errorMessage && (
              <p style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</p>
            )}
          </DialogContent>
        </center>
      </div>
      <DialogActions>
        <Button
          onClick={() => {
            setFile(null); // Clear the selected file
            setErrorMessage(''); // Clear any error messages
            handleCloseAdd(); // Close the dialog
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="success">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
    
      {/*--------------------------------Edit inventory--------------------*/}
       <Dialog
      open={openEdit}
      onClose={handleCloseEdit}
      sx={{
        "& .MuiDialog-paper": {
          width: "400px",
          borderRadius: "20px",
          backgroundColor: "rgba(199, 221, 211)",
        },
      }}
    >
      <DialogTitle>Edit Inventory</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ marginTop: "16px" }} error={!!error}>
          <InputLabel>Package ID</InputLabel>
          <Select
            value={editPackageName}
            onChange={(e) => {
              setEditPackageName(e.target.value);
              if (e.target.value) {
                setError(''); // Clear error on change
              }
            }}
            label="Package ID"
            sx={{
              "& .MuiInputLabel-root.Mui-error": {
                color: "gray", // Set label color to gray when there is an error
              },
              "& .MuiSelect-root.Mui-error": {
                color: "gray", // Ensure select text color is gray when there is an error
              },
            }}
          >
            {packageIds.map((pack) => (
              <MenuItem key={pack.id} value={pack.id}>
                PID{pack.id}
              </MenuItem>
            ))}
          </Select>
          {/* Display error message */}
          {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEdit}>Cancel</Button>
        <Button onClick={handleUpdate} color="success">
          Update
        </Button>
      </DialogActions>
    </Dialog>
      {/*--------------------------------Delete inventory--------------------*/}
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
        <DialogTitle id="alert-dialog-title">{"Delete inventory"}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this inventory?</p>
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
      <Footer2 />
      <DateTime />
    </div>
  );
}
