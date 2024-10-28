import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function DivisionSelectionSLT({ districtId, districtName }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedGramaNiladhariArea, setSelectedGramaNiladhariArea] = useState(null);
  const [areas, setAreas] = useState([]);
  const [gramaNiladhariAreas, setGramaNiladhariAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setAreas([]);
        setSelectedArea(null); 
        const response = await fetch(`/api/recommendation/divisions/${districtId}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const fetchedAreas = data.map((area) => ({ id: area.id, label: area.name }));
        setAreas(fetchedAreas);
      } catch (error) { 
        console.error("Error fetching areas:", error);
        setAreas([]);  
      }
    };

    if (districtId) {
      fetchAreas();
    }
  }, [districtId]);

  useEffect(() => {
    const fetchGramaNiladhariAreas = async () => {
      try {
        if (!selectedArea?.id) return;
        const response = await fetch(`/api/recommendation/gs_divisions/${selectedArea.id}`);
        if (!response.ok) throw new Error("Failed to fetch Grama Niladhari areas");

        const data = await response.json();
        const fetchedGramaNiladhariAreas = data.map((gnArea) => ({
          id: gnArea.id,
          label: gnArea.name,
        }));
        setGramaNiladhariAreas(fetchedGramaNiladhariAreas);
      } catch (error) {
        console.error("Error fetching Grama Niladhari areas:", error);
        setGramaNiladhariAreas([]);  
      }
    };

    if (selectedArea) {
      fetchGramaNiladhariAreas();
    }
  }, [selectedArea]);

  const handleViewDetails = () => {
    navigate("/adminsltrecomendations", {
      state: {
        district: districtName,
        area: selectedArea?.label || " ",
        gramaNiladhariArea: selectedGramaNiladhariArea?.label || " ",
        gramaNiladhariid: selectedGramaNiladhariArea?.id || null,
      },
    });
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          backgroundColor: "#61B44A",
          padding: 1,
          borderRadius: "5px",
          mt: "5px",
          textAlign: "center",
        }}
      >
        {districtName} දිස්ත්‍රික්කය
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: "15px" }}>
        ප්‍රාදේශීය ලේකම් කොට්ඨාසය
      </Typography>

      <Autocomplete
        value={selectedArea}
        onChange={(event, newValue) => setSelectedArea(newValue)}
        options={areas}
        getOptionLabel={(option) => option.label || " "}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="සොයන්න…"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        fullWidth
        margin="dense"
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" gutterBottom sx={{ mt: "10px" }}>
        ග්‍රාම නිලධාරී කොට්ඨාසය
      </Typography>

      <Autocomplete
        value={selectedGramaNiladhariArea}
        onChange={(event, newValue) => setSelectedGramaNiladhariArea(newValue)}
        options={gramaNiladhariAreas}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="සොයන්න…"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        fullWidth
        margin="dense"
        sx={{ mb: 2 }}
        disabled={!selectedArea} 
      />

      <center>
        <Button
          variant="contained"
          sx={{
            mt:{
              xs: 4,  // Mobile view
              sm: 4, // Tablet view
              md: 0.2,
              lg:4, // Desktop view
            },
            width: "40%",
            color: "black",
            backgroundColor: "#61B44A",
            "&:hover": { backgroundColor: "darkgreen" },
          }}
          onClick={handleViewDetails}
          disabled={!selectedArea || !selectedGramaNiladhariArea} 
        >
          විස්තරය
        </Button>
      </center>
    </div>
  );
}
