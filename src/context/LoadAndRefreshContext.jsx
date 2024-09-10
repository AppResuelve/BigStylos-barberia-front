import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";

const LoadAndRefreshContext = createContext();

const LoadAndRefreshProvider = ({ children }) => {
  const { userData, userIsReady } = useContext(AuthContext);
  const [pageIsReady, setPageIsReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [imgLogoLoaded, setImgLogoLoaded] = useState(false); // Estado para el estado del mapa
  const [minTimePassed, setMinTimePassed] = useState(false); // Estado para el retraso mínimo

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true); // Se cumple el retraso de 1 segundo
    }, 2000);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, []);

  useEffect(() => {
    if (userData !== 1 && imgLogoLoaded && mapLoaded && minTimePassed) {
      setPageIsReady(true); // Solo si todo está listo y pasó el tiempo mínimo
    }
  }, [userData, imgLogoLoaded, mapLoaded, minTimePassed]);

  const data = {
    pageIsReady,
    setPageIsReady,
    mapLoaded,
    setMapLoaded,
    userIsReady,
    setImgLogoLoaded,
  };

  return (
    <LoadAndRefreshContext.Provider value={data}>
      {children}
    </LoadAndRefreshContext.Provider>
  );
};
export { LoadAndRefreshProvider };
export default LoadAndRefreshContext;
