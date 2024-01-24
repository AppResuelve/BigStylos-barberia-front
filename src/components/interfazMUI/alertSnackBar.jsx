import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const alertSnackBar = ({ showAlertSnack, setShowAlertSnack }) => {
  // const handleClick = () => {
  //   setOpen(true);
  // };

const handleClose = (event, reason) => {
  setShowAlertSnack((prevShowAlertSnack) => {
    return { ...prevShowAlertSnack, open: false };
  });
};


  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={showAlertSnack.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={showAlertSnack.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {showAlertSnack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default alertSnackBar;
