import { useEffect, useState, createContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import Turns from "./components/turns/turns";
import "./App.css";
import Admin from "./components/admin/admin";
import Worker from "./components/worker/worker";
import NotFound from "./components/pageNotFound/pageNotFound";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const DarkModeContext = createContext();

function App() {
  const [userData, setUserData] = useState(1);
  const [userAuth, setUserAuth] = useState(false);
  const { user } = useAuth0();
  const location = useLocation();
  const [colors, setColors] = useState("#000000");
  const [darkMode, setDarkMode] = useState({
    dark: "#252627",
    light: colors,
    on: false,
  });
  const [homeImages, setHomeImages] = useState([]); //images del home

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        const { data } = response;
        setHomeImages(data.allImages);
        setColors(data.allColors);
        //  setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de personalizacion:", error);
        alert("Error al obtener los datos de personalizacion");
      }
    };

    fetchImages();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => ({
      ...prevMode,
      on: !prevMode.on,
    }));
  };

  useEffect(() => {
    // Actualizar el estado del modo oscuro después de obtener el color
    setDarkMode((prevMode) => ({
      ...prevMode,
      light: colors,
    }));
  }, [colors]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user === undefined) {
        setUserAuth(true);
      }
    }, 8000);

    return () => {
      // Limpia el timeout si el componente se desmonta antes de que se complete
      clearTimeout(timeoutId);
    };
  }, [user]);

  useEffect(() => {
    const postUser = async () => {
      let sendUser;
      if (user) {
        sendUser = {
          name: user.name,
          email: user.email,
          image: user.picture
        };
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/users/create`,
            sendUser
          );
          setUserData(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    postUser(user);
  }, [user]);

  // Lee la configuración del modo desde localStorage al cargar la página
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedMode) {
      setDarkMode(savedMode);
    }
  }, []);
  // Almacena la configuración del modo en localStorage para persistencia
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div>
        {location.pathname !== "/requestDenied401" && <Nav user={userData} />}
        <Routes>
          <Route
            path="/"
            element={<Home user={userData} homeImages={homeImages} />}
          />
          <Route path="/turns" element={<Turns user={userData} />} />
          <Route
            path="/admin"
            element={<Admin userData={userData} userAuth={userAuth} />}
          />
          <Route
            path="/worker"
            element={<Worker userData={userData} userAuth={userAuth} />}
          />
          <Route
            path="/requestDenied401"
            element={<NotFound user={userData} />}
          />
        </Routes>
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
