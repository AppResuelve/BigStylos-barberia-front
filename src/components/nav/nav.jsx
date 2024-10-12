import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import toHome from "../../assets/icons/home.png";
import UserPanelModal from "../interfazMUI/userPanelModal";
import LoginButton from "../login/loginButton";
import noUser from "../../assets/icons/noUser.png"; // Imagen por defecto
import bellOnNotificationIcon from "../../assets/icons/bell-on.png";
import bellOffNotificationIcon from "../../assets/icons/bell-off.png";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import "./nav.css";
import { LoaderUserImgReady } from "../loaders/loaders";

const Nav = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const { userData, isOpenUserPanel, setIsOpenUserPanel, setOpenSection } =
    useContext(AuthContext);
  const { newTurnNotification, setNewTurnNotification } = useContext(
    LoadAndRefreshContext
  );
  const location = useLocation();

  // Iniciar con imagen por defecto (noUser)
  const [userImageSrc, setUserImageSrc] = useState(noUser); 
  const [userImgLoaded, setUserImgLoaded] = useState(false);

  useEffect(() => {
    if (userData.image) {
      const img = new Image(); // Crear nueva imagen
      img.src = userData.image; // Asignar la URL de la imagen del usuario
      img.onload = () => {
        setUserImageSrc(userData.image); // Actualizar con la imagen del usuario cuando esté lista
        setUserImgLoaded(true); // Marcar la imagen como cargada
      };
      img.onerror = () => {
        setUserImageSrc(noUser); // Si hay error, cargar el icono por defecto
        setUserImgLoaded(true); // Marcar como "cargada" para ocultar el loader
      };
    } else {
      setUserImgLoaded(true); // Si no hay imagen, marcar como "cargada"
    }
  }, [userData.image]);

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
                {/* Mostrar imagen solo cuando esté cargada */}
                <img
                  className="img-user-nav"
                  loading="lazy"
                  src={userImageSrc}
                  alt="mi perfil"
                  style={{ display: userImgLoaded ? "block" : "none" }}
                />
                {/* Mostrar loader mientras carga */}
                {!userImgLoaded && <LoaderUserImgReady />}
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
