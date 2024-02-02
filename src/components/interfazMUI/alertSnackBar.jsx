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
      sx={{
        position: "absolute",
        top: "-80%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={showAlertSnack.type}
        variant="filled"
        sx={{
          // width: "100%",
          fontFamily: "Jost,sans-serif",
          fontWeight: "bold",
          borderRadius: showAlertSnack.type === "success" ? "50px" : "",
        }}
      >
        {showAlertSnack.message}
      </Alert>
    </Snackbar>
  );
};

export default alertSnackBar;
