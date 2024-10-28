import * as React from "react";
import { useState, useEffect } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import Footer1 from "../../Components/Footer1";
import DateTime from "../../Components/DateTime";
import NavBar6 from "../../Components/NavBar6";
import DivisionSelection from "../../Components/DivisionSelectionM";
import DistrictMap from "../../Components/DistrictMap";
import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import DivisionSelectionM from "../../Components/DivisionSelectionM";
import DivisionSelectionSLT from "../../Components/DivisionSelectionSLT";
import NavBar2 from "../../Components/NavBar2";
import Footer2 from "../../Components/Footer2";

// Define styled components
const Search = styled("div")(({ theme }) => ({
  position: "fixed", // Fixed position to keep it in the top-right corner
  top: theme.spacing(10),
  right: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.4),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.5),
  },
  marginLeft: 0,
  width: "auto",
  [theme.breakpoints.down("sm")]: {
    top: theme.spacing(8), // Adjust position for smaller screens
    right: theme.spacing(2),
    width: "70%", // Adjust width for mobile view
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#2E7D32",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: "#ffffff",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#1A2027",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, sm: 300, md: 300, lg: 300 },
  bgcolor: "background.paper",
  p: 4,
};

export default function AdminSLTDistrictSelection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null); // New state for ID
  const [openModal, setOpenModal] = useState(false);
  const [districts, setDistricts] = useState([]);

  // Define breakpoints
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");
  const isNestHub = useMediaQuery("(min-width:901px) and (max-width:1280px)"); // Nest Hub
  const isNestHubMax = useMediaQuery(
    "(min-width:1281px) and (max-width:1379px)"
  ); // Nest Hub Max
  const isDesktop = useMediaQuery("(min-width:1380px)");

  const handleItemClick = (district) => {
    setSelectedDistrict(district.name); 
    setSelectedDistrictId(district.id); 
    if (!isDesktop) {
      setOpenModal(true);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchDistricts = async () => {
    try {
      const response = await fetch("/api/recommendation/districts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistricts(data); // Store complete district objects
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setOpenModal(false); // Close modal
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#8FBAA6",
          padding: isMobile ? "0px 0px 0px 0px" : "0px 0px 10px 0px",
          minHeight: "100vh",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <NavBar2 />

        {/* Search component positioned in the top-right */}
        <Search
          sx={{
            marginTop: {
              xs: '5px',  // Mobile view
              sm: '5px', // Tablet view
              md: '0px',
              lg:"0px" // Desktop view
            },
            width: {
              xs: "195px", // Mobile view
              sm: "200px", // Tablet view
              md: "220px",
              lg: "250px", // Desktop view
            },
            zIndex: 9998,
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="සොයන්න…"
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Search>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: "0px", sm: "10px", md: "10px", lg: "10px" },
            marginLeft: { xs: "10px", sm: "200px", md: "200px", lg: "230px" },
            marginTop: { xs: "130px", sm: "130px", md: "130px", lg: "75px" },
            position: "relative",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
            backgroundColor: "rgba(255, 255, 255,0)",
            width: { xs: "95vw", sm: "70vw", md: "70vw", lg: "800px" },
          }}
        >
          <Grid
            container
            spacing={{ xs: 3, md: 1 }}
            columns={{ xs: 8, sm: 4, md: 4, lg: 12 }}
            direction={isMobile ? "column" : "row"}
          >
            <Grid
              item
              xs={6}
              sm={12}
              md={12}
              lg={6}
              container
              spacing={2}
              direction="row"
            >
              {filteredDistricts.map((district, index) => (
                <Grid item xs={6} sm={4} md={2.25} lg={4} key={index}>
                  <Item onClick={() => handleItemClick(district)}>
                    {district.name}
                  </Item>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <DistrictMap onDistrictClick={handleItemClick} />
            </Grid>
          </Grid>
        </Paper>

        {/* Show District Selection in Modal for non-desktop views */}
        {!isDesktop && selectedDistrict && (
          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="division-selection-title"
            aria-describedby="division-selection-description"
          >
            <Box
              sx={{
                ...style,
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            >
              <DivisionSelectionSLT districtId={selectedDistrictId} districtName={selectedDistrict}/>
            </Box>
          </Modal>
        )}

        {/* Normal view for Desktop */}
        {isDesktop && selectedDistrict && (
          <Box
            sx={{
              position: "absolute",
              right: {
                xs: "75px", // Mobile view
                sm: "100px", // Tablet view
                md: "250px",
                lg: "30px", // Desktop view
              },
              top: {
                xs: "180px", // Mobile view
                sm: "300px", // Tablet view
                md: "200px",
                lg: "170px", // Desktop view
              },
              width: {
                xs: "300px", // Mobile view
                sm: "300px", // Tablet view
                md: "300px",
                lg: "250px", // Desktop view
              },
              height: {
                xs: "400px", // Mobile view
                sm: "400px", // Tablet view
                md: "320px",
                lg: "400px", // Desktop view
              },
              padding: "15px",
              backgroundColor: "rgba(255, 255, 255,0.5)",
              borderRadius: "8px",
              boxShadow: 3,
            }}
          >
            <DivisionSelectionSLT districtId={selectedDistrictId} />
          </Box>
        )}

        <DateTime />
        <Footer2 />
      </Box>
    </>
  );
}
