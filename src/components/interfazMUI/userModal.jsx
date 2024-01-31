import React, { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import noUser from "../../assets/icons/noUser.png";
import Slide from "@mui/material/Slide";
import LoginButton from "../login/login";
import LogoutButton from "../logout/logout";
import { Dialog } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { NavLink } from "react-router-dom";
import ClientNestedList from "./clientNestedList";
import "./userModal.css";

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
  const { darkMode } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const handleClose = () => setIsOpen(false);

  return (
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
      <Box //container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: sm ? "80vw" : md ? "60vw" : lg ? "50vw" : xl ? "30vw" : "",
          height: "100vh",
          bgcolor: darkMode.on ? darkMode.dark : darkMode.light,
          p: 2,
        }}
      >
        <Box>
          <Box>
            <div
              className="box-subContainer1-userModal"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                className="h2"
                style={{ color: darkMode.on ? "white" : darkMode.dark }}
              >
                {userData !== 1 ? userData.name : "Inicia sesión"}
              </h2>

              {userData !== 1 ? (
                <img
                  className="img-user-userModal"
                  src={googleImage}
                  alt="mi perfil"
                  style={{
                    border: `solid 2px ${
                      darkMode.on ? "transparent" : darkMode.dark
                    }`,
                  }}
                />
              ) : (
                <img
                  className="img-user-userModal"
                  src={noUser}
                  alt="mi perfil"
                  style={{
                    border: "solid 2px black",
                  }}
                />
              )}
            </div>
            <hr
              className="hr-userModal"
              style={{
                border: "none",
                height: "2px",
                backgroundColor: darkMode.on ? "white" : darkMode.dark,
              }}
            />
          </Box>
          <Box>
            {/* seccion del admin */}
            {userData !== 1 && userData.admin && (
              <NavLink
                to="/admin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <div style={{ cursor: "pointer" }}>
                  <button
                    className="btn-userModal"
                    style={{
                      color: darkMode.on ? "white" : darkMode.dark,
                      fontWeight: "bold",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    Administración del local
                  </button>
                  <hr
                    className="hr-userModal"
                    style={{
                      border: "none",
                      height: "1px",
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    }}
                  />
                </div>
              </NavLink>
            )}
            {/* seccion del worker */}
            {userData !== 1 && userData.worker && (
              <div>
                <NavLink
                  to="/worker"
                  style={{ textDecoration: "none", color: darkMode.dark }}
                >
                  <button
                    className="btn-userModal"
                    style={{
                      color: darkMode.on ? "white" : darkMode.dark,
                      fontWeight: "bold",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    Administracíon del profesional
                  </button>
                </NavLink>
                <hr
                  className="hr-userModal"
                  style={{
                    border: "none",
                    height: "1px", // Altura de la línea
                    backgroundColor: darkMode.on ? "white" : darkMode.dark,
                  }}
                />
              </div>
            )}
          </Box>
          <Box>
            {/* seccion del cliente la cual van a poder acceder todos los tipos de usuarios */}
            {userData !== 1 && <ClientNestedList userData={userData} />}
          </Box>
        </Box>
        <Box>
          <div
            className="box-login-logout-userModal"
           
          >
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ModalMUI;
