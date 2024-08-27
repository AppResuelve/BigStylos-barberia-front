import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import noUser from "../../assets/icons/noUser.png";
import closeIcon from "../../assets/icons/close.png";
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

const UserPanelModal = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData, isOpenUserPanel, setIsOpenUserPanel } =
    useContext(AuthContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const handleClose = () => setIsOpenUserPanel(false);
  return (
    <Dialog
      style={{
        display: "flex",
        justifyContent: "end",
      }}
      fullScreen={xl}
      TransitionComponent={Transition}
      open={isOpenUserPanel}
      onClose={handleClose}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <div //container
        style={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "space-between",
          width: sm ? "340px" : "380px",
          height: "100%",
          paddingBottom: "90px",
          backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
          // p: 0,
        }}
      >
        <section style={{ padding: "0px 10px 10px 10px" }}>
          <div
            className="box-subContainer1-userModal"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className="img-user-userModal"
                src={userData?.image ? userData.image : noUser}
                alt="mi perfil"
              />
              <span
                style={{
                  color: darkMode.on ? "white" : darkMode.dark,
                  fontSize: "22px",
                }}
              >
                {userData?.name}
              </span>
            </div>

            <img
              className="img-close-userModal"
              src={closeIcon}
              alt=""
              onClick={handleClose}
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
          {/* seccion del admin */}
          {userData !== 1 && userData.admin && (
            <NavLink
              to="/admin"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Box onClick={() => setIsOpenUserPanel(false)}>
                <button
                  className="btn-userModal"
                  style={{
                    color: darkMode.on ? "white" : darkMode.dark,
                    fontWeight: "bold",
                  }}
                  onClick={() => setIsOpenUserPanel(false)}
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
              <Box onClick={() => setIsOpenUserPanel(false)}>
                <button
                  className="btn-userModal"
                  style={{
                    color: darkMode.on ? "white" : darkMode.dark,
                    fontWeight: "bold",
                  }}
                  onClick={() => setIsOpenUserPanel(false)}
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
          {/* seccion del cliente la cual van a poder acceder todos los tipos de usuarios */}
          <ClientNestedList userData={userData} />
        </section>
        <section
          className="section-logout-darkmode"
          style={{
            width: sm ? "340px" : "380px",
          }}
        >
          {userData !== 1 && userData !== false && <LogoutButton />}
          <DarkMode />
        </section>
      </div>
    </Dialog>
  );
};
export default UserPanelModal;
