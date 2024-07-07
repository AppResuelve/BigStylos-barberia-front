import React, { useState, useContext, useEffect } from "react";
import { DarkModeContext } from "../../App";
import noUser from "../../assets/icons/noUser.png";
import LogoutButton from "../logout/logout";
import { Dialog, Backdrop, Slide, Box, Button } from "@mui/material";
import { useMediaQueryHook } from "./useMediaQuery";
import { NavLink } from "react-router-dom";
import ClientNestedList from "./clientNestedList";
import DarkMode from "../interfazUiverse.io/darkMode";
import "./userPanelModal.css";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"left"} ref={ref} {...props} />;
});

const UserPanelModal = ({ isOpen, setIsOpen, userData }) => {
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
                style={{
                  color: darkMode.on ? "white" : darkMode.dark,
                  fontSize: "30px",
                }}
              >
                {userData?.name}
              </h2>

              <img
                className="img-user-userModal"
                src={userData?.image ? userData.image : noUser}
                alt="mi perfil"
                style={{
                  border: `solid 2px ${
                    darkMode.on ? "transparent" : darkMode.dark
                  }`,
                }}
              />
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
                <Box onClick={() => setIsOpen(false)}>
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
                </Box>
              </NavLink>
            )}
            {/* seccion del worker */}
            {userData !== 1 && userData.worker && (
              <NavLink
                to="/worker"
                style={{ textDecoration: "none", color: darkMode.dark }}
              >
                <Box onClick={() => setIsOpen(false)}>
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
                  <hr
                    className="hr-userModal"
                    style={{
                      border: "none",
                      height: "1px", // Altura de la línea
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    }}
                  />
                </Box>
              </NavLink>
            )}
          </Box>
          {/* seccion del cliente la cual van a poder acceder todos los tipos de usuarios */}
          <ClientNestedList userData={userData} />
        </Box>
        <DarkMode />
        <Box>
          <div className="box-login-logout-userModal">
            {userData !== 1 && userData !== false && <LogoutButton />}
          </div>
        </Box>
      </Box>
    </Dialog>
  );
};
export default UserPanelModal;
