import { Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "./context/AuthContext.jsx";
import LoadAndRefreshContext from "./context/LoadAndRefreshContext.jsx";
import Nav from "./components/nav/nav.jsx";
import Home from "./components/home/home.jsx";
import Turns from "./components/turns/turns.jsx";
import Admin from "./components/admin/admin.jsx";
import Worker from "./components/worker/worker.jsx";
import NotFound from "./components/pageNotFound/pageNotFound.jsx";
import TurnsCartFooter from "./components/turnsCartFooter/turnsCartFooter.jsx";
import Footer from "./components/footer/footer.jsx";
import { LoaderPage } from "./components/loaders/loaders.jsx";
import { messaging, subscribeUserToPush } from "./firebase.js";
import { onMessage } from "firebase/messaging";
import toastAlert from "./helpers/alertFunction.js";
import "./App.css";

function App() {
  const location = useLocation();
  const { pageIsReady } = useContext(LoadAndRefreshContext);
  const { userData } = useContext(AuthContext);

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

  return (
    <>
      {location.pathname !== "/requestDenied401" && <Nav />}
      <Routes>
        <Route path="/turns" element={<Turns />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/worker" element={<Worker />} />
        <Route path="/requestDenied401" element={<NotFound />} />
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
