import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import Nav from "./components/nav/nav.jsx";
import Home from "./components/home/home.jsx";
import Turns from "./components/turns/turns.jsx";
import Admin from "./components/admin/admin.jsx";
import Worker from "./components/worker/worker.jsx";
import NotFound from "./components/pageNotFound/pageNotFound.jsx";
import TurnsCartFooter from "./components/turnsCartFooter/turnsCartFooter.jsx";
import "./App.css";



function App() {
  const location = useLocation();
  const [clientName, setClientName] = useState("");
  const [turnsCart, setTurnsCart] = useState([]);
  const [auxCart, setAuxCart] = useState({});


  return (
    <ThemeProvider>
      <AuthProvider>
        <div style={{ position: "relative" }}>
          {location.pathname !== "/requestDenied401" && <Nav />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/turns"
              element={
                <Turns
                  setTurnsCart={setTurnsCart}
                  auxCart={auxCart}
                  setAuxCart={setAuxCart}
                />
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/worker" element={<Worker />} />
            <Route path="/requestDenied401" element={<NotFound />} />
          </Routes>
          {turnsCart.length > 0 &&
            (location.pathname === "/" || location.pathname === "/turns") && (
              <TurnsCartFooter
                turnsCart={turnsCart}
                setTurnsCart={setTurnsCart}
                setAuxCart={setAuxCart}
              />
            )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
