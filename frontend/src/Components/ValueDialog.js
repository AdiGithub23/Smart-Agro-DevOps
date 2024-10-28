import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeviceStatus from "./DeviceStatus"; // Ensure the import path is correct

export default function ValueDialog({ open, onClose, title, values }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List>
          {values.map((value, index) => (
            <ListItem key={index}>
              {title === "Devices" ? (
                <DeviceStatus
                  status="green"
                  serialNumber={`SN-${String(index + 1).padStart(2, "0")}`}
                />
              ) : (
                <subtitile2>{value}</subtitile2>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
