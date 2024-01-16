import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import Turns from "./components/turns/turns";
import "./App.css";
import Admin from "./components/admin/admin";
import Worker from "./components/worker/worker";
import Footer from "./components/footer/footer";
import NotFound from "./components/pageNotFound/pageNotFound";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [userData, setUserData] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [userAuth, setUserAuth] = useState(false);
  const location = useLocation();
  const { user } = useAuth0();

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
    <div>
      <Nav user={userData} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route
          path="/"
          element={<Home user={userData} darkMode={darkMode} />}
        />
        <Route
          path="/turns"
          element={<Turns user={userData} darkMode={darkMode} />}
        />
        <Route
          path="/admin"
          element={
            <Admin
              userData={userData}
              userAuth={userAuth}
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/worker"
          element={
            <Worker
              userData={userData}
              userAuth={userAuth}
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/requestDenied401"
          element={<NotFound user={userData} />}
        />
      </Routes>
    </div>
  );
}

export default App;
