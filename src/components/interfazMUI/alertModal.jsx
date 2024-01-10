import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { Dialog, useMediaQuery, createTheme } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

const AlertModal = ({ showAlert, setShowAlert }) => {
  const { loginWithRedirect } = useAuth0();

  console.log(showAlert);
  const theme = createTheme({
    breakpoints: {
      values: {
        size: 600,
      },
    },
  });

  const fullScreen = useMediaQuery(theme.breakpoints.down("size"));
  const handleClose = () => {
    setShowAlert((prevAlert) => ({
      ...prevAlert,
      isOpen: false,
    }));
  };


  let action;
  if (
    Object.keys(showAlert).length > 0 &&
    showAlert.button1.action === "login"
  ) {
    action = loginWithRedirect;
  }

  return (
    <div>
      {Object.keys(showAlert).length > 0 && (
        <Dialog
          style={{
            top: "65%",
            height: "180px",
            borderRadius: "50px",
            // minWidth: "100wh",
          }}
          fullScreen={fullScreen}
          TransitionComponent={Transition}
          open={showAlert.isOpen}
          onClose={handleClose}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              p: 3,
            }}
          >
            <Typography>{showAlert.message}</Typography>
            {showAlert.button1.text !== "" && (
              <Button onClick={() => action()}>{showAlert.button1.text}</Button>
            )}
            {showAlert.buttonClose.text !== "" && (
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                {showAlert.buttonClose.text}
              </Button>
            )}
          </Box>
        </Dialog>
      )}
    </div>
  );
};

export default AlertModal;
