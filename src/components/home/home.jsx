import { useContext, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { verificateFrontResponse } from "../../helpers/verificateFrontResponseMP";
import { getCookie } from "../../helpers/cookies";
import { getLocalStorage } from "../../helpers/localStorage";
import defaultImg from "../../assets/icons/no-image-logotipe.png";
import defaultImgLight from "../../assets/icons/no-image-logotipe-light.png";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import Swal from "sweetalert2";
import axios from "axios";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import "./home.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const { darkMode, homeImages } = useContext(ThemeContext);
  const { googleLogin } = useContext(AuthContext);
  const { pageIsReady, setImgLogoLoaded } = useContext(LoadAndRefreshContext);
  const navigate = useNavigate();

  useEffect(async () => {
    // Extraer la URL y sus parámetros
    const urlParams = window.location.search;
    if (urlParams !== "") {
      // Obtener el preference_id de la cookie
      const preferenceId = getCookie("PREFERENCE_ID");

      if (preferenceId) {
        // Verificar los parámetros de la URL
        const isMatch = verificateFrontResponse(urlParams, preferenceId);
        if (isMatch) {
          const arrayItems = getLocalStorage("CART_ID");

          try {
            await axios.put(`${VITE_BACKEND_URL}/workdays/tofreeturns`, {
              arrayItems,
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log("URL Params match with cookie preference_id", isMatch);
      } else {
        console.log("No preference_id found in cookies.");
      }
    } else {
      return;
    }
  }, []);

  const handleReserveClick = () => {
    const isLoggedIn = getCookie("IDSESSION");
    if (!isLoggedIn) {
      Swal.fire({
        title: "Debes estar loggeado para reservar",
        showDenyButton: true,
        confirmButtonText: "Iniciar sesión",
        denyButtonText: `Más tarde`,
      }).then((result) => {
        if (result.isConfirmed) {
          googleLogin();
        }
      });
    } else {
      // Navegar a la página de reservas si el usuario está logueado
      navigate("/turns");
    }
  };

  return (
    <div
      className="container-home"
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
      }}
    >
      <section className="container-img-logotipo">
        <img
          onLoad={() => setImgLogoLoaded(true)}
          className="img-logotipo-home"
          src={
            homeImages && homeImages[0] && homeImages[0][1]
              ? homeImages[0][1]
              : darkMode.on
              ? defaultImgLight
              : defaultImg
          }
          alt="nombre del lugar"
        />
        <div
          style={{
            background: `linear-gradient(to bottom, ${darkMode.light}, transparent)`,
          }}
          className="image-overlay"
        ></div>
      </section>
      <section className="section-btn-reservar">
        <div className="container-btn-reservar">
          <button
            onClick={handleReserveClick}
            className="btn-reservar-home"
            style={{ color: "white" }}
          >
            Reservar turno
          </button>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              <NavLink
                className="img-social-home-link"
                to="https://www.instagram.com/"
                target="-blank"
                rel="noopener noreferrer"
              >
                <img
                  src={instagram}
                  alt="instagram"
                  className="img-social-home"
                />
              </NavLink>
              <NavLink
                id="fb"
                className="img-social-home-link"
                to="https://www.facebook.com/"
                target="-blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="facebook"
                  className="img-social-home"
                />
              </NavLink>
            </div>

            <a
              className="img-social-home-link
              href="
              whatsapp:target="_blank" //send?phone=+5492983664119&text=Quiero saber cómo obtener una página para mi negocio."
              rel="noopener noreferrer"
            >
              <img className="img-social-home" src={whatsapp} alt="whatsapp" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
