import { NavLink, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import toHome from "../../assets/icons/home.png";
import UserPanelModal from "../interfazMUI/userPanelModal";
import LoginButton from "../login/loginButton";
import noUser from "../../assets/icons/noUser.png";
import bellOnNotificationIcon from "../../assets/icons/bell-on.png";
import bellOffNotificationIcon from "../../assets/icons/bell-off.png";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import "./nav.css";
import { LoaderMapReady } from "../loaders/loaders";

const Nav = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const { userData, isOpenUserPanel, setIsOpenUserPanel, setOpenSection } =
    useContext(AuthContext);
  const { newTurnNotification, setNewTurnNotification } = useContext(
    LoadAndRefreshContext
  );
  const location = useLocation();
  const [userImgLoaded, setUserImgLoaded] = useState(false);

  const handleGoToMyTurns = () => {
    setIsOpenUserPanel(true);
    setTimeout(() => {
      setOpenSection({
        telefono: false,
        turnos: true,
      });
      setNewTurnNotification(false);
    }, 300);
  };

  return (
    <>
      <div className="container-nav">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <button className="btn-img-home-nav">
            <img
              className="img-home-nav"
              style={{ filter: darkMode.on && "invert(.7)" }}
              src={toHome}
              alt="inicio"
            />
            <span className="span-btn-nav">
              {location.pathname !== "/" ? "Volver" : "Inicio"}
            </span>
          </button>
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userData && (
            <div
              className="btn-img-home-nav"
              onClick={handleGoToMyTurns}
              style={{ display: "flex", alignItems: "center", gap: "0px" }}
            >
              <div style={{ position: "relative" }}>
                {newTurnNotification ? (
                  <>
                    <label htmlFor="" className="label-count-notification" />
                    <img
                      className="notification-myturns"
                      src={bellOnNotificationIcon}
                      alt="notificacíon de turnos"
                    />
                  </>
                ) : (
                  <img
                    className="notification-myturns"
                    style={{ filter: darkMode.on && "invert(.7)" }}
                    src={bellOffNotificationIcon}
                    alt="notificacíon de turnos"
                  />
                )}
              </div>
              <span
                id="myTurns"
                className="span-btn-nav"
                style={{ width: "100%" }}
              >
                Mis turnos
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {userData === false ? (
              <LoginButton />
            ) : (
              <button
                className="btn-userProfile"
                style={{ position: "relative" }}
                onClick={() => setIsOpenUserPanel(true)}
              >
                <img
                  className="img-user-nav"
                  onLoad={() => setUserImgLoaded(true)}
                  src={userData.image || noUser}
                  alt="mi perfil"
                />
                {!userImgLoaded && <LoaderMapReady />}
              </button>
            )}
          </div>
        </div>
        {isOpenUserPanel && <UserPanelModal />}
      </div>
    </>
  );
};
export default Nav;
