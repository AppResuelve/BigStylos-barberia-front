import { Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "./context/AuthContext.jsx";
import LoadAndRefreshContext from "./context/LoadAndRefreshContext.jsx";
import Nav from "./components/nav/nav.jsx";
import Home from "./components/home/home.jsx";
import Turns from "./components/turns/turns.jsx";
import Admin from "./components/admin/admin.jsx";
import Worker from "./components/worker/worker.jsx";
import TurnsCartFooter from "./components/turnsCartFooter/turnsCartFooter.jsx";
import Footer from "./components/footer/footer.jsx";
import OurServices from "./components/ourServices/ourServices.jsx";
import { LoaderPage } from "./components/loaders/loaders.jsx";
import { messaging, subscribeUserToPush } from "./firebase.js";
import { onMessage } from "firebase/messaging";
import toastAlert from "./helpers/alertFunction.js";
import "./App.css";
import ErrorPage from "./components/errorPage/errorPage.jsx";

function App() {
  const location = useLocation();
  const { pageIsReady } = useContext(LoadAndRefreshContext);
  const { userData, dataErrorPage } = useContext(AuthContext);

  // useEffect(() => {
  //   // Aquí es donde suscribes al usuario al servicio de notificaciones push
  //   subscribeUserToPush(userData.email);
  // }, [pageIsReady]);

  useEffect(() => {
    if (pageIsReady) {
      onMessage(messaging, (message) => {
        toastAlert(message.notification.title, "info");
      });
    }
  }, [pageIsReady]);

  // Rutas donde queremos ocultar el Nav
  const hideNavRoutes = [
    "/",
    "/turns",
    "/admin",
    "/worker",
    "/nuestros-servicios",
  ];

  return (
    <>
      {/* Renderiza Nav si la ruta actual no está en hideNavRoutes */}
      {hideNavRoutes.includes(location.pathname) && <Nav />}
      {/* {showErrorRoutes.includes(location.pathname) && (
        <ErrorPage dataErrorPage={dataErrorPage} />
      )} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turns" element={<Turns />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/worker" element={<Worker />} />
        <Route path="*" element={<ErrorPage dataErrorPage={dataErrorPage} />} />
        <Route path="/nuestros-servicios" element={<OurServices />} />
        {/* Mostrar NotFound solo si la ruta actual no está definida o es /requestDenied401 */}
      </Routes>
      {(location.pathname === "/" || location.pathname === "/turns") && (
        <TurnsCartFooter />
      )}
      {location.pathname === "/" && <Footer />}
      {!pageIsReady && location.pathname === "/" && <LoaderPage />}
    </>
  );
}

export default App;
