import React, { useState } from "react";
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

export default function DivisionSelectionCA({ districtName }) {
  // Accept districtName as a prop
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedGramaNiladhariArea, setSelectedGramaNiladhariArea] =
    useState(null);
  const navigate = useNavigate();

  const areas = [
    { value: "akkarapaththuwa", label: "අක්කරපත්තුව" },
    { value: "adayalachchena", label: "අඩයාලච්චේන" },
  ];

  const gramaNiladhariAreas = [
    { value: "esankanichchimai", label: "ඉසංකනිච්චිමයි" },
    { value: "krunkodithiu 15", label: "කරුන්කොඩිතිවු 15" },
  ];

  const handleViewDetails = () => {
    navigate("/admincustomerrecomendation", {
      state: {
        district: districtName,
        area: selectedArea?.label || " ",
        gramaNiladhariArea: selectedGramaNiladhariArea?.label || " ",
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
          disabled={!selectedArea || !selectedGramaNiladhariArea} // Disable button if selections are not made
        >
          විස්තරය
        </Button>
      </center>
    </div>
  );
}
