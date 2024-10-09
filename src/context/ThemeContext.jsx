import { createContext, useEffect, useState } from "react";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [homeImages, setHomeImages] = useState([]); //images del home
  // Inicializa el estado con el valor de localStorage si existe, o usa un valor por defecto
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode
      ? JSON.parse(savedDarkMode)
      : { dark: "#2f2e3e", light: "white", on: false };
  });

  const [refreshPersonalization, setRefreshPersonalization] = useState(false);

  // Guarda la configuración del modo en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.setAttribute(
      "data-theme",
      darkMode.on ? "dark" : "light"
    );

    // Modificar la variable CSS --bg-color según el modo
    // if (!darkMode.on) {
    //   document.documentElement.style.setProperty("--bg-color", darkMode.light); // Color para modo oscuro
    // }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => ({
      ...prevMode,
      on: !prevMode.on,
    }));
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!VITE_BACKEND_URL) {
        console.error("Backend URL is not defined");
        return;
      }

      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        setHomeImages(response.data.allImages);
        setDarkMode((prevMode) => ({
          ...prevMode,
          light: response.data.allColors[0],
        }));
      } catch (error) {
        console.error("Error al obtener los datos de personalización:", error);
        alert("Error al obtener los datos de personalización");
      }
    };

    fetchImages();
  }, [refreshPersonalization]);

  const data = {
    darkMode,
    homeImages,
    setHomeImages,
    setDarkMode,
    toggleDarkMode,
    refreshPersonalization,
    setRefreshPersonalization,
  };

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider };
export default ThemeContext;
