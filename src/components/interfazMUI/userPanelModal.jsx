import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import noUser from "../../assets/icons/noUser.png";
import closeIcon from "../../assets/icons/close.png";
import storeConfigIcon from "../../assets/icons/store-config.png";
import workerConfigIcon from "../../assets/icons/worker-config.png";
import LogoutButton from "../logout/logout";
import { Dialog, Backdrop, Slide } from "@mui/material";
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
  const { userData, isOpenUserPanel, setIsOpenUserPanel, setOpenSection } =
    useContext(AuthContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const handleClose = () => {
    setIsOpenUserPanel(false),
      setOpenSection({ telefono: false, turnos: false });
  };
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
          backgroundColor: "var(--bg-color)",
        }}
      >
        <header
          className="header-userpanelmodal"
          style={{
            position: "fixed",
            backgroundColor: "var(--bg-color)",
            zIndex: "1",
            boxShadow: "0px 6px 5px -5px rgb(0,0,0,0.5)",
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
              <span style={{ fontSize: "22px" }}>{userData?.name}</span>
            </div>
            <button className="btn-close-usermodal" onClick={handleClose}>
              <img src={closeIcon} alt="cerrar" />
            </button>
          </div>
          <hr style={{ margin: "0px 5px 0px 5px" }} />
        </header>
        <section style={{ padding: "55px 10px 10px 10px" }}>
          {/* seccion del admin */}
          {userData !== 1 && userData.admin && (
            <section onClick={() => setIsOpenUserPanel(false)}>
              <NavLink to="/admin" style={{ textDecoration: "none" }}>
                  <button
                    className="btn-userModal"
                    style={{
                      color: "var(--text-color)",
                    }}
                  >
                    <img src={storeConfigIcon} alt="administración del local" />
                    Administración del local
                  </button>
                  <hr className="hr-userModal" />
              </NavLink>
            </section>
          )}
          {/* seccion del worker */}
          {userData !== 1 && userData.worker && (
            <section onClick={() => setIsOpenUserPanel(false)}>
              <NavLink
                to="/worker"
                style={{ textDecoration: "none" }}
              >
                <button
                  className="btn-userModal"
                  style={{ color: "var(--text-color)" }}
                >
                  <img src={workerConfigIcon} alt="administración del local" />
                  <span>Administracíon del profesional</span>
                </button>
                <hr className="hr-userModal" />
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
