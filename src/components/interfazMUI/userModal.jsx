import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import LoginButton from "../login/login";
import LogoutButton from "../logout/logout";
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"left"} ref={ref} {...props} />;
});
const ModalMUI = ({
  isOpen,
  setIsOpen,
  isAuthenticated,
  googleImage,
  userData,
}) => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 2000,
      },
    },
  });
  const lg = useMediaQuery(theme.breakpoints.down("lg"));

  const xl = useMediaQuery(theme.breakpoints.down("xl"));

  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <Dialog
        style={{
          display: "flex",
          justifyContent: "end",
          height: "100vh",
        }}
        fullScreen={xl}
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
            width:!lg ? "30vw": "70vw",
            height: "100vh",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:"space-between",
              marginBottom: "15px",
            }}
          >
            <h2>
              {userData && (userData.worker || userData.admin)
                ? userData.name
                : "Inicia sesión"}
            </h2>

            {userData ? (
              <img
                src={googleImage}
                alt="mi perfil"
                style={{
                  borderRadius: "50px",
                  width: "70px",
                  border: "solid 4px black",
                  marginLeft: "70px",
                }}
              />
            ) : null}
          </div>
          <hr
            style={{
              border: "none",
              height: "2px", // Altura de la línea
              backgroundColor: "black", // Color de la línea
              marginBottom: "20px",
            }}
          />
          {userData && userData.admin && (
            <div>
              <NavLink
                to="/admin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <button
                  style={{
                    border: "none",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "18px",
                    backgroundColor: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Administración del local
                </button>
              </NavLink>
              <hr
                style={{
                  border: "none",
                  height: "1px", // Altura de la línea
                  backgroundColor: "black", // Color de la línea
                  marginBottom: "15px",
                  marginTop: "20px",
                }}
              />
            </div>
          )}

          {userData && userData.worker && (
            <div>
              <NavLink
                to="/worker"
                style={{ textDecoration: "none", color: "black" }}
              >
                <button
                  style={{
                    border: "none",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "18px",
                    backgroundColor: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Administracíon del profesional
                </button>
              </NavLink>
              <hr
                style={{
                  border: "none",
                  height: "1px", // Altura de la línea
                  backgroundColor: "black", // Color de la línea
                  marginBottom: "15px",
                  marginTop: "20px",
                }}
              />
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default ModalMUI;
