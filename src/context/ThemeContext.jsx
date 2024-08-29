import { createContext, useEffect, useState } from "react";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Inicializa el estado con el valor de localStorage si existe, o usa un valor por defecto
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode
      ? JSON.parse(savedDarkMode)
      : { dark: "#000214", light: "white", on: false };
  });

  const [homeImages, setHomeImages] = useState([]);
  const [redirectToMyServices, setRedirectToMyServices] = useState(false);
  const [refreshForWhoIsComing, setRefreshForWhoIsComing] = useState(false);
  const [refreshPersonalization, setRefreshPersonalization] = useState(false);

  // Guarda la configuración del modo en localStorage cuando cambie
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
        console.error("Error al obtener los datos de personalización:", error);
        alert("Error al obtener los datos de personalización");
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
    setRefreshPersonalization,
  };

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider };
export default ThemeContext;
