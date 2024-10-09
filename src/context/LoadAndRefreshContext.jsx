import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";

const LoadAndRefreshContext = createContext();

const LoadAndRefreshProvider = ({ children }) => {
  const { userData, userIsReady } = useContext(AuthContext);
  const [pageIsReady, setPageIsReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [imgLogoLoaded, setImgLogoLoaded] = useState(false); // Estado para el estado del mapa
  const [minTimePassed, setMinTimePassed] = useState(false); // Estado para el retraso mínimo
  const [newTurnNotification, setNewTurnNotification] = useState(false);
  const [redirectToMyServices, setRedirectToMyServices] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true); // Se cumple el retraso de 1 segundo
    }, 800);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, []);

  useEffect(() => {
    if (userData !== 1 && imgLogoLoaded && minTimePassed) {
      setPageIsReady(true); // Solo si todo está listo y pasó el tiempo mínimo
    }
  }, [userData, imgLogoLoaded, minTimePassed]);
console.log(imgLogoLoaded,"este es el logoloaded");

  const data = {
    pageIsReady,
    setPageIsReady,
    mapLoaded,
    setMapLoaded,
    userIsReady,
    setImgLogoLoaded,
    newTurnNotification,
    setNewTurnNotification,
    redirectToMyServices,
    setRedirectToMyServices,
 
  };

  return (
    <LoadAndRefreshContext.Provider value={data}>
      {children}
    </LoadAndRefreshContext.Provider>
  );
};
export { LoadAndRefreshProvider };
export default LoadAndRefreshContext;
