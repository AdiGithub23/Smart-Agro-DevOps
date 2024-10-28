// src/Components/DateRangePicker.js

import React from "react";
import { Box, Button, TextField } from "@mui/material";

const DateRangePicker = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 2 }}
    >
      <Button variant="contained" color="primary">
        Top 20
      </Button>
      <TextField label="From" type="date" InputLabelProps={{ shrink: true }} />
      <TextField label="To" type="date" InputLabelProps={{ shrink: true }} />
      <Button variant="contained" color="primary">
        Download History
      </Button>
    </Box>
  );
};

export default DateRangePicker;
