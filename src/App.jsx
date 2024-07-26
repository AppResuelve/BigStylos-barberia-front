import { useEffect, useState, createContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import authenticateUsers from "./helpers/authenticateUsers";
import { setCookie } from "./helpers/cookies";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import Turns from "./components/turns/turns";
import Admin from "./components/admin/admin";
import Worker from "./components/worker/worker";
import NotFound from "./components/pageNotFound/pageNotFound";
import AlertModal from "./components/interfazMUI/alertModal";
import "./App.css";
import axios from "axios";
import TurnsCartFooter from "./components/turnsCartFooter/turnsCartFooter";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const DarkModeContext = createContext();

function App() {
  const location = useLocation();
  const [userData, setUserData] = useState(1);
  const [colors, setColors] = useState("");
  const [homeImages, setHomeImages] = useState([]); //images del home
  /* estados locales para el contexto global */
  const [moveDown, setMoveDown] = useState(false);
  const [refreshForWhoIsComing, setRefreshForWhoIsComing] = useState(false);
  const [redirectToMyServices, setRedirectToMyServices] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  const [validateAlert, setValidateAlert] = useState(false);
  const [validateAlertTurns, setValidateAlertTurns] = useState(false);
  const [validateAlertTurnsWorker, setValidateAlertTurnsWorker] =
    useState(false);
  const [refreshStatusSession, setRefreshStatusSession] = useState(false);
  const [refreshWhenCancelTurn, setRefreshWhenCancelTurn] = useState(false);
  const [refreshPersonalization, setRefreshPersonalization] = useState({
    home: false,
    colors: false,
  });
  const [disableButtonMyTurns, setDisableButtonMyTurns] = useState(false);
  const [clientName, setClientName] = useState("");
  const [showAlert, setShowAlert] = useState({});
  const [darkMode, setDarkMode] = useState({
    dark: "#000214",
    light: colors,
    on: false,
  });

  /* función para el dark mode */
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => ({
      ...prevMode,
      on: !prevMode.on,
    }));
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        const { data } = response;
        setHomeImages(data.allImages);
        setColors(data.allColors[0]);

        // setRefreshPersonalization({ home: false, colors: false });
      } catch (error) {
        console.error("Error al obtener los datos de personalizacion:", error);
        alert("Error al obtener los datos de personalizacion");
      }
    };

    fetchImages();
  }, [refreshPersonalization]);

  useEffect(() => {
    // Actualizar el estado del modo oscuro después de obtener el color
    setDarkMode((prevMode) => ({
      ...prevMode,
      light: colors,
    }));
  }, [colors]);

  useEffect(() => {
    const fetchAuth = () => {
      authenticateUsers()
        .then((response) => {
          if (response.auth) {
            setUserData(response.user);
            setCookie("IDSESSION", response.user.email, 6);
          } else {
            setUserData(false);
          }
        })
        .catch((error) => {
          setUserData(false);
          console.log(error);
        });
    };

    fetchAuth();
  }, [refreshStatusSession]);
  // Almacena la configuración del modo en localStorage para persistencia
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSetMoveDown = (e) => {
    if (Object.keys(showAlert).length > 0) {
      // Obtenemos el elemento clickeado
      const clickedElement = e.target;

      // Obtenemos el contenedor de la alerta
      const alertContainer = document.querySelector(".alert-container");

      // Verificamos si el elemento clickeado es descendiente de la alerta
      if (!alertContainer.contains(clickedElement)) {
        // Si el clic no proviene de dentro de la alerta, cerramos la alerta
        setMoveDown(true);
        setDisableButtonMyTurns(false);
      }
    }
  };

  return (
    <DarkModeContext.Provider
      value={{
        clientName, //estado para cuando el worker agenda un turno para un cliente
        setClientName,
        moveDown,
        setMoveDown,
        darkMode,
        toggleDarkMode,
        showAlert,
        setShowAlert,
        redirectToMyServices,
        setRedirectToMyServices,
        alertDelete,
        setAlertDelete,
        validateAlert,
        setValidateAlert,
        validateAlertTurns,
        setValidateAlertTurns,
        validateAlertTurnsWorker,
        setValidateAlertTurnsWorker,
        refreshPersonalization,
        setRefreshPersonalization,
        refreshForWhoIsComing,
        setRefreshForWhoIsComing,
        userData,
        setUserData,
        refreshWhenCancelTurn,
        setRefreshWhenCancelTurn,
        disableButtonMyTurns,
        setDisableButtonMyTurns,
        setRefreshStatusSession,
      }}
    >
      <div style={{ position: "relative" }} onClick={handleSetMoveDown}>
        {location.pathname !== "/requestDenied401" && (
          <Nav user={userData} homeImages={homeImages} />
        )}
        <Routes>
          <Route
            path="/"
            element={<Home user={userData} homeImages={homeImages} />}
          />
          <Route path="/turns" element={<Turns />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/worker" element={<Worker />} />
          <Route
            path="/requestDenied401"
            element={<NotFound user={userData} />}
          />
        </Routes>

        {location.pathname !== "/requestDenied401" && <TurnsCartFooter />}

        {Object.keys(showAlert).length > 0 && (
          <AlertModal
            userData={userData}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            setRedirectToMyServices={setRedirectToMyServices}
            setAlertDelete={setAlertDelete}
            setValidateAlert={setValidateAlert}
            setValidateAlertTurns={setValidateAlertTurns}
            setValidateAlertTurnsWorker={setValidateAlertTurnsWorker}
          />
        )}
        {/* este y el de abajo son las cortinas de back drop de la alerta, entrada-salida */}
        {Object.keys(showAlert).length > 0 && !moveDown && (
          <div
            className="div-bg-alert"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "10000",
            }}
          ></div>
        )}
        {moveDown && (
          <div
            className="div-bg-alert-down"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "10000",
            }}
          ></div>
        )}
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
