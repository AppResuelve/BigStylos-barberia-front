import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const alertSnackBar = ({ showAlertSnack, open, setOpen }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      sx={{
        zIndex: "100000",
        width: "100%",
        marginBottom: sm ? "30px" : "",
        justifyContent: sm ? "start" : "center",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={showAlertSnack.type}
        variant="filled"
        sx={{
          display: "flex",
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
