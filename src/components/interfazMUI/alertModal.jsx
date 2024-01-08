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
const ModalMUI = ({ isOpen, setIsOpen }) => {
  const { loginWithRedirect } = useAuth0()
  const theme = createTheme({
    breakpoints: {
      values: {
        size: 600,
      },
    },
  });

  const fullScreen = useMediaQuery(theme.breakpoints.down("size"));
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <Dialog
        style={{
          top: "65%",
          height: "220px",
          // minWidth: "100wh",
        }}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        open={isOpen}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          <Typography>Para agendar un turno debes loggearte</Typography>
          <Button
            onClick={() => {
              loginWithRedirect(), handleClose();
            }}
          >
            Ahora
          </Button>
          <Button
            onClick={() => {
            handleClose();
            }}
          >
            Más tarde
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default ModalMUI;
