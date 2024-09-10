import { Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
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
import "./App.css";

function App() {
  const location = useLocation();
  const { pageIsReady } = useContext(LoadAndRefreshContext);

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
