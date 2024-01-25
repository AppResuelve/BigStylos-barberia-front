import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const alertSnackBar = ({ showAlertSnack, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      sx={{ position: "absolute", top: "-80%" }}
    >
      <Alert
        onClose={handleClose}
        severity={showAlertSnack.type}
        variant="filled"
        sx={{
          width: "100%",
          fontFamily: "Jost,sans-serif",
          fontWeight: "bold",
        }}
      >
        {showAlertSnack.message}
      </Alert>
    </Snackbar>
  );
};

export default alertSnackBar;
