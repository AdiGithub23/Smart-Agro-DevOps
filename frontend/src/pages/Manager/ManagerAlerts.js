import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Fab,
  Tooltip,
  Autocomplete,
  Slider,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DateTime from "../../Components/DateTime";
import Footer1 from "../../Components/Footer1";
import NotificationCA from "../../Components/NotificationCA";
import NavBar6 from "../../Components/NavBar6";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import NotificationTH from "../../Components/NotificationTHAlerts";

const stages = [
  "Nursery stage",
  "Vegetative stage",
  "Flowering stage",
  "Harvest stage",
];

const ManagerAlerts = () => {
  const [filteredThresholds, setFilteredThresholds] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentThreshold, setCurrentThreshold] = useState({
    id: null,
    CropName: "",
    name: "",
    parameters: [],
    deviceId: "",
  });

  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedStage, setSelectedStage] = useState(null);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedThresholdId, setSelectedThresholdId] = useState(null);
  const [deleteThresholdId, setDeleteThresholdId] = useState(null);
  const [parameterLookup, setParameterLookup] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isDesktop = !isMobile && !isTablet;
  const deviceId = localStorage.getItem("DeviceID");

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        if (!deviceId) {
          throw new Error("Please login");
        }

        const response = await axios.get(
          `/api/threshold/parameters/${deviceId}`
        );
        const data = response.data;

        const formattedParameters = data.map((param) => {
          const { name, unit, min, max } = param;
          return `${name} (${unit})`;
        });

        const lookup = data.reduce((acc, param) => {
          acc[`${param.name} (${param.unit})`] = {
            min: param.min,
            max: param.max,
          };
          return acc;
        }, {});

        setAvailableParameters(formattedParameters);
        setParameterLookup(lookup);
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    };

    fetchParameters();
    fetchThresholds();
  }, [deviceId]);

  const fetchThresholds = async () => {
    try {
      const response = await axios.get(`/api/threshold/view/${deviceId}`);
      setFilteredThresholds(response.data);
    } catch (error) {
      console.error("Error fetching thresholds:", error);
      setFilteredThresholds([]);
    }
  };

  const handleSubmitAdd = async () => {
    const data = {
      CropName: currentThreshold.CropName,
      deviceId: localStorage.getItem("DeviceID"),
      Stage: selectedStage,
      status: false,
    };

    const usedNames = {};

    currentThreshold.parameters.forEach((param) => {
      let paramName = param.name.split("(")[0].replace(/\s+/g, "").trim();

      if (usedNames[paramName]) {
        paramName = `${paramName}_${usedNames[paramName]}`;
        usedNames[paramName]++;
      } else {
        usedNames[paramName] = 1;
      }

      data[`min_${paramName}`] = param.min;
      data[`max_${paramName}`] = param.max;
    });

    try {
      const response = await fetch("/api/threshold/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setFilteredThresholds(result);
        alert("Threshold saved successfully!");
        handleDialogClose();
        window.location.reload();
      } else {
        console.error("Failed to submit data:", response.statusText);
        alert("Failed to submit data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit data");
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const data = {
        CropName: currentThreshold.CropName,
        Stage: selectedStage,
        status: currentThreshold.status,
      };

      const usedNames = {};

      currentThreshold.parameters.forEach((param) => {
        let paramName = param.name.split("(")[0].replace(/\s+/g, "").trim();
        if (usedNames[paramName]) {
          paramName = `${paramName}_${usedNames[paramName]}`;
          usedNames[paramName]++;
        } else {
          usedNames[paramName] = 1;
        }

        data[`min_${paramName}`] = param.min;
        data[`max_${paramName}`] = param.max;
      });

      const response = await axios.put(
        `/api/threshold/edit/${selectedThresholdId}`,
        data
      );

      if (response.status === 200) {
        setFilteredThresholds((prev) =>
          prev.map((threshold) =>
            threshold.id === selectedThresholdId
              ? { ...currentThreshold, id: selectedThresholdId }
              : threshold
          )
        );
        alert("Update successful!");
        fetchThresholds();
        handleEditClose();
      } else {
        console.error("Failed to update threshold:", response.statusText);
        alert("Please deactivate the threshold prior to update");
      }
    } catch (error) {
      console.error("Error updating threshold:", error);
      alert("Please deactivate the threshold prior to update");
    }
  };

  const confirmDelete = () => {
    axios
      .delete(`/api/threshold/delete/${deleteThresholdId}`)
      .then((response) => {
        alert("Threshold deleted successfully");
        fetchThresholds();
        handleDeleteClose();
      })
      .catch((error) => {
        alert("Error deleting threshold:", error);
      });
  };

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleDialogClose = () => {
    setCurrentThreshold({ id: null, CropName: "", name: "", parameters: [] });
    setSelectedStage(null);
  };

  const handleParameterChange = (index, key, value) => {
    setCurrentThreshold((prevState) => {
      const updatedParameters = [...prevState.parameters];
      updatedParameters[index] = {
        ...updatedParameters[index],
        [key]: value,
      };
      return {
        ...prevState,
        parameters: updatedParameters,
      };
    });
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setCurrentThreshold({ id: null, CropName: "", parameters: [] });
    setSelectedStage(null);
  };

  const handleEditOpen = (threshold) => {
    setCurrentThreshold(threshold);
    setSelectedThresholdId(threshold.id);
    setSelectedStage(threshold.Stage || null);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setCurrentThreshold({ id: null, CropName: "", parameters: [] });
    setSelectedStage(null);
  };

  const handleDeleteOpen = (id) => {
    setDeleteThresholdId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteThresholdId(null);
  };

  const handleAdd = () => {
    setCurrentThreshold({
      id: null,
      CropName: "",
      name: "",
      parameters: [],
    });
    setOpenAddDialog(true);
  };

  const handleAddParameter = () => {
    if (
      selectedParameter &&
      !currentThreshold.parameters.some(
        (param) => param.name === selectedParameter
      )
    ) {
      const selectedParamData = parameterLookup[selectedParameter];

      if (selectedParamData) {
        const { min, max } = selectedParamData;
        setCurrentThreshold({
          ...currentThreshold,
          parameters: [
            ...currentThreshold.parameters,
            { name: selectedParameter, min, max },
          ],
        });
        setSelectedParameter("");
      }
    }
  };

  const handleDeleteParameter = (index) => {
    const updatedParameters = [...currentThreshold.parameters];
    updatedParameters.splice(index, 1);
    setCurrentThreshold({ ...currentThreshold, parameters: updatedParameters });
  };

  const ValueLabelComponent = (props) => {
    const { children, open, value } = props;
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  };

  const handleToggle = async (index) => {
    const updatedThresholds = filteredThresholds.map((threshold, i) =>
      i === index ? { ...threshold, status: !threshold.status } : threshold
    );

    setFilteredThresholds(updatedThresholds);

    const updatedThreshold = updatedThresholds[index];

    try {
      const response = await fetch(
        `/api/threshold/edit/${updatedThreshold.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: updatedThreshold.deviceId,
            status: updatedThreshold.status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update threshold");
      }
      fetchThresholds();
      alert("Threshold updated successfully!");
    } catch (error) {
      fetchThresholds();
      alert(error.message || "Failed to update threshold");
    }
  };

  const backgroundStyle = {
    backgroundColor: "#8FBAA6",
    padding: "0px 0px 0px 0px",
    minHeight: "100vh",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
 
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          marginTop: { xs: 13, sm: 13, md: 13, lg: 12 },
          marginLeft: { xs: 3, sm: 25, md: 25, lg: 35 },
          fontWeight: 600,
        }}
      >
        Set Thresholds
      </Typography>
      {(isMobile || isTablet) && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: 95, sm: 95, md: 90, lg: 135 }, // Adjust top position for different screen sizes
            right: { xs: 65, sm: 65, md: 100, lg: 400 },
            zIndex: 1000,
          }}
        >
          <Fab color="primary" aria-label="add" onClick={handleAdd}>
            <AddIcon />
          </Fab>
        </Box>
      )}

      {isDesktop && (
        <Box position="fixed" top={90} right={400} zIndex={1000}>
          <Fab color="primary" aria-label="add" onClick={handleAdd}>
            <AddIcon />
          </Fab>
        </Box>
      )}

      <Box height="600px">
        <Paper
          sx={{
            marginTop: { xs: 1, sm: 1, md: 1, lg: 1 },
            marginLeft: { xs: 1, sm: 25, md: 25, lg: 35 },
            marginRight: { xs: 1, sm: 5, md: 10, lg: 45 },
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <TableContainer>
            <Table>
              <TableBody>
                {filteredThresholds &&
                  filteredThresholds.length > 0 &&
                  filteredThresholds.map((threshold, index) => (
                    <React.Fragment key={threshold.id}>
                      <TableRow>
                        {expanded === threshold.id ? (
                          <>
                            <TableCell colSpan={2}>
                              <b>
                                <p>{threshold.CropName}</p>
                              </b>
                            </TableCell>
                            <TableCell colSpan={1}>
                              <IconButton
                                onClick={() => handleEditOpen(threshold)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                onClick={() => handleDeleteOpen(threshold.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell colSpan={1}>
                              <IconButton
                                onClick={() => handleExpandClick(threshold.id)}
                              >
                                {expanded === threshold.id ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <b>
                                Device {deviceId} - {threshold.CropName} -{" "}
                                {threshold.Stage}
                              </b>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={threshold.status}
                                onChange={() => handleToggle(index)}
                                color="primary"
                              />

                              <IconButton
                                onClick={() => handleExpandClick(threshold.id)}
                              >
                                {expanded === threshold.id ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <Collapse
                            in={expanded === threshold.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Parameter</TableCell>
                                  <TableCell>Min</TableCell>
                                  <TableCell>Max</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {threshold.parameters.map((param, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{param.name}</TableCell>
                                    <TableCell>{param.min}</TableCell>
                                    <TableCell>{param.max}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/*--------------------------------Add Thresholds--------------------*/}

        <Dialog
          open={openAddDialog}
          onClose={handleAddClose}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              width: "90%",
              maxWidth: { xs: 400, sm: 900, md: 800, lg: 900 },
              padding: "2px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle>
            {/* {currentThreshold.id === "Add Threshold"} */}
          </DialogTitle>

          <DialogContent>
            <h2>Device {deviceId}</h2>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    label="Crop Name"
                    fullWidth
                    id="CropName"
                    value={currentThreshold.CropName}
                    onChange={(e) =>
                      setCurrentThreshold({
                        ...currentThreshold,
                        CropName: e.target.value,
                      })
                    }
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
                <Grid item xs={12} sm={3.5}>
                  <Autocomplete
                    value={selectedStage}
                    onChange={(event, newValue) => setSelectedStage(newValue)}
                    options={stages}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Stage"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={9} sm={4}>
                  <Autocomplete
                    value={selectedParameter}
                    onChange={(event, newValue) =>
                      setSelectedParameter(newValue)
                    }
                    options={availableParameters}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Parameter"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={3} sm={1}>
                  <Button
                    onClick={handleAddParameter}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
              {currentThreshold.parameters.map((param, index) => (
                <Box
                  key={index}
                  flex={1}
                  minWidth={300}
                  maxWidth={450}
                  style={{ marginBottom: 10 }}
                >
                  <Typography>{param.name}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Slider
                      value={[param.min, param.max]}
                      onChange={(e, newValue) => {
                        handleParameterChange(index, "min", newValue[0]);
                        handleParameterChange(index, "max", newValue[1]);
                      }}
                      min={parameterLookup[param.name]?.min}
                      max={parameterLookup[param.name]?.max}
                      valueLabelDisplay="auto"
                      components={{ ValueLabel: ValueLabelComponent }}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton
                      onClick={() => handleDeleteParameter(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} color="success">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/*--------------------------------Edit Thresholds--------------------*/}

        <Dialog
          open={openEditDialog}
          onClose={handleEditClose}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              width: "90%",
              maxWidth: { xs: 400, sm: 900, md: 800, lg: 900 },
              padding: "2px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle></DialogTitle>
          <DialogContent>
            <h2>Device {deviceId}</h2>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    label="Crop Name"
                    fullWidth
                    value={currentThreshold.CropName || ""}
                    onChange={(e) =>
                      setCurrentThreshold({
                        ...currentThreshold,
                        CropName: e.target.value,
                      })
                    }
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
                <Grid item xs={12} sm={3.5}>
                  <Autocomplete
                    value={selectedStage}
                    onChange={(event, newValue) => setSelectedStage(newValue)}
                    options={stages}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Stage"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={9} sm={4}>
                  <Autocomplete
                    value={selectedParameter}
                    onChange={(event, newValue) =>
                      setSelectedParameter(newValue)
                    }
                    options={availableParameters}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Parameter"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={3} sm={1}>
                  <Button
                    onClick={handleAddParameter}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
              {currentThreshold.parameters.map((param, index) => {
                const min = parameterLookup[param.name]?.min;
                const max = parameterLookup[param.name]?.max;

                return (
                  <Box
                    key={index}
                    flex={1}
                    minWidth={300}
                    maxWidth={450}
                    style={{ marginBottom: 10 }}
                  >
                    <Typography>{param.name}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Slider
                        value={[param.min, param.max]}
                        onChange={(e, newValue) => {
                          handleParameterChange(index, "min", newValue[0]);
                          handleParameterChange(index, "max", newValue[1]);
                        }}
                        min={min}
                        max={max}
                        valueLabelDisplay="auto"
                        sx={{ flexGrow: 1 }}
                      />
                      <IconButton
                        onClick={() => handleDeleteParameter(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} color="success">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/*--------------------------------Delete Thresholds--------------------*/}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              backgroundColor: "rgba(199, 221, 211)",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this threshold?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              No
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {/*--------------------------------Notification--------------------*/}
        <NotificationTH />
      </Box>
      <Footer1 />
      <DateTime />
    </div>
  );
};

export default ManagerAlerts;
