import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import noUser from "../../assets/icons/noUser.png";
import closeIcon from "../../assets/icons/close.png";
import LogoutButton from "../logout/logout";
import { Dialog, Backdrop, Slide, Box } from "@mui/material";
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
        className="container-userpanelmodal"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          paddingBottom: "70px",
          backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
        }}
      >
        <header
          className="header-userpanelmodal"
          style={{
            position: "fixed",
            backgroundColor: "lightgray",
            zIndex: "1",
            boxShadow: "0px 6px 5px -3px rgb(0,0,0,0.5)",
          }}
        >
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
            style={{
              border: "none",
              height: "2px",
              backgroundColor: darkMode.on ? "white" : darkMode.dark,
            }}
          />
        </header>
        <section style={{ padding: "55px 10px 10px 10px" }}>
          {/* seccion del admin */}
          {userData !== 1 && userData.admin && (
            <section
              onClick={() => setIsOpenUserPanel(false)}
            >
              <NavLink
                to="/admin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <Box>
                  <button
                    className="btn-userModal"
                    style={{
                      color: darkMode.on ? "white" : darkMode.dark,
                      fontWeight: "bold",
                    }}
                  >
                    Administración del local
                  </button>
                  <hr
                    className="hr-userModal"
                    style={{
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    }}
                  />
                </Box>
              </NavLink>
            </section>
          )}
          {/* seccion del worker */}
          {userData !== 1 && userData.worker && (
            <section onClick={() => setIsOpenUserPanel(false)}>
              <NavLink
                to="/worker"
                style={{ textDecoration: "none", color: darkMode.dark }}
              >
                <Box>
                  <button
                    className="btn-userModal"
                    style={{
                      color: darkMode.on ? "white" : darkMode.dark,
                      fontWeight: "bold",
                    }}
                  >
                    Administracíon del profesional
                  </button>
                  <hr
                    className="hr-userModal"
                    style={{
                      backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    }}
                  />
                </Box>
              </NavLink>
            </section>
          )}
          {/* seccion del cliente la cual van a poder acceder todos los tipos de usuarios */}
          <ClientNestedList userData={userData} />
        </section>
        <footer className="footer-logout-darkmode">
          {userData !== 1 && userData !== false && <LogoutButton />}
          <DarkMode />
        </footer>
      </div>
    </Dialog>
  );
};
export default UserPanelModal;
