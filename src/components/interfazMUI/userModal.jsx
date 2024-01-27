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
        <Box //container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: sm ? "80vw" : md ? "60vw" : lg ? "50vw" : xl ? "30vw" : "",
            height: "100vh",
            bgcolor: darkMode.on ? darkMode.dark : darkMode.light,
            p: 3,
          }}
        >
          <Box>
            <Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <h2 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                  {userData !== 1 ? userData.name : "Inicia sesión"}
                </h2>

                {userData !== 1 ? (
                  <img
                    src={googleImage}
                    alt="mi perfil"
                    style={{
                      borderRadius: "50px",
                      width: sm ? "50px" : "60px",
                      border: `solid 3px ${
                        darkMode.on ? "transparent" : darkMode.dark
                      }`,
                      marginLeft: "70px",
                    }}
                  />
                ) : (
                  <img
                    src={noUser}
                    alt="mi perfil"
                    style={{
                      borderRadius: "50px",
                      width: "50px",
                      border: "solid 3px black",
                      marginLeft: "70px",
                    }}
                  />
                )}
              </div>
              <hr
                style={{
                  border: "none",
                  height: "2px", // Altura de la línea
                  backgroundColor: darkMode.on ? "white" : darkMode.dark,
                  marginBottom: "20px",
                }}
              />
            </Box>
            <Box>
              {/* seccion del admin */}
              {userData !== 1 && userData.admin && (
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
                        backgroundColor: "transparent",
                        color: darkMode.on ? "white" : darkMode.dark,
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
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                      marginBottom: "15px",
                      marginTop: "20px",
                    }}
                  />
                </div>
              )}
              {/* seccion del worker */}
              {userData !== 1 && userData.worker && (
                <div>
                  <NavLink
                    to="/worker"
                    style={{ textDecoration: "none", color: darkMode.dark }}
                  >
                    <button
                      style={{
                        border: "none",
                        fontFamily: "Jost, sans-serif",
                        fontSize: "18px",
                        backgroundColor: "transparent",
                        color: darkMode.on ? "white" : darkMode.dark,
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
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                      marginBottom: "15px",
                      marginTop: "20px",
                    }}
                  />
                </div>
              )}
            </Box>
            <Box>
              {/* seccion del cliente */}
              {userData !== 1 && <ClientNestedList userData={userData} />}
            </Box>
          </Box>
          <Box>
            <div
              style={{
                marginBottom: !md ? "50px" : "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </div>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ModalMUI;
