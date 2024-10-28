import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Separate function to validate the date
const validateDate = (value) => {
  if (!value) return false;
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return false;

  const isValidYear = year.length === 4 && /^\d{4}$/.test(year);
  const isValidMonth = month.length === 2 && Number(month) >= 1 && Number(month) <= 12;
  const isValidDay =
    day.length === 2 && Number(day) >= 1 && Number(day) <= new Date(Number(year), Number(month), 0).getDate();
  return isValidYear && isValidMonth && isValidDay;
};

const DeviceModal = ({ open, handleClose, onAddData, initialValues }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  
  const validationSchema = Yup.object().shape({
    crop_name: Yup.string().required("Crop name is required"),
    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .positive("Quantity must be positive")
      .required("Quantity is required"),
    unit_price: Yup.number()
      .typeError("Unit Price must be a number")
      .positive("Unit Price must be positive")
      .required("Unit Price is required"),
    date: Yup.string()
      .required("Date is required")
      .test("is-valid-date", "Invalid date", (value) => validateDate(value)),
    time: Yup.string().required("Time is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      crop_name: initialValues?.crop_name || "",
      quantity: initialValues?.quantity || "",
      unit_price: initialValues?.unit_price || "",
      date: initialValues?.date || currentDate,
      time: initialValues?.time || currentTime,
    },
    validationSchema,
    onSubmit: (values) => {
      if (onAddData) {
        onAddData(values);
      }
      handleClose();
    },
    enableReinitialize: true, 
  });

  const deviceId = localStorage.getItem("DeviceID");

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: { xs: "50%", sm: "40%", md: "50%", lg: "50%" },
          left: { xs: "50%", sm: "60%", md: "50%", lg: "55%" },
          transform: "translate(-50%, -50%)",
          width: { xs: 260, sm: 500, md: 400, lg: 400 },
          bgcolor: "rgba(199, 221, 211)",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "auto",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h6" component="h2" align="center" fontWeight="bold">
          {initialValues ? "Edit Yield Data" : "Add Yield Data"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ minWidth: 110, mr: 2, fontWeight: "bold" }}>
                Device
              </Typography>
              <Typography>Device {deviceId}</Typography>
            </Box>
            {[
              { label: "Crop Name", name: "crop_name" },
              { label: "Quantity(Kg)", name: "quantity" },
              { label: "Unit Price(Rs)", name: "unit_price" },
              { label: "Date", name: "date" },
              { label: "Time", name: "time" },
            ].map(({ label, name }) => (
              <Box key={name} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ minWidth: 110, mr: 2, fontWeight: "bold" }}>
                  {label}
                </Typography>
                <TextField
                  name={name}
                  type={name === "date" ? "date" : name === "time" ? "time" : "text"}
                  value={formik.values[name] || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[name] && Boolean(formik.errors[name])}
                  helperText={formik.touched[name] && formik.errors[name]}
                  variant="standard"
                  fullWidth
                  inputProps={
                    name === "date" ? { maxLength: 10 } : {} 
                  }
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
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, ml: 3 }}
            >
              {initialValues ? "Save" : "Add"}
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="success"
              sx={{ mt: 2, ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default DeviceModal;
