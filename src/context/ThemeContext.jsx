import { createContext, useEffect, useState } from "react";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState({
    dark: "#000214",
    light: "white",
    on: false,
  });
  const [homeImages, setHomeImages] = useState([]); //images del home
  const [redirectToMyServices, setRedirectToMyServices] = useState(false);
  const [refreshForWhoIsComing, setRefreshForWhoIsComing] = useState(false);

  // Almacena la configuración del modo en localStorage para persistencia
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
        setDarkMode((prevMode) => ({
          ...prevMode,
          light: data.allColors[0],
        }));
      } catch (error) {
        console.error("Error al obtener los datos de personalizacion:", error);
        alert("Error al obtener los datos de personalizacion");
      }
    };

    fetchImages();
  }, []);

  const data = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    homeImages,
    redirectToMyServices,
    setRedirectToMyServices,
    refreshForWhoIsComing,
    setRefreshForWhoIsComing,
  };

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider };

export default ThemeContext;
