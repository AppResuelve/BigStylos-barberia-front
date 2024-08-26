import { useState, useContext, useEffect } from "react";
import { DarkModeContext } from "../../App";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../footer/footer";
import { Box, Button, Skeleton } from "@mui/material";
import defaultImg from "../../assets/icons/no-image-logotipe.png";
import defaultImgLight from "../../assets/icons/no-image-logotipe-light.png";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import { verificateFrontResponse } from "../../helpers/verificateFrontResponseMP";
import { getCookie } from "../../helpers/cookies";
import axios from "axios";
import "./home.css";
import { getLocalStorage } from "../../helpers/localStorage";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = ({ homeImages }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
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
    const isLoggedIn = getCookie("IDSESSION"); // Verifica si el usuario está logueado (puedes adaptar esta lógica según tu implementación)

    if (!isLoggedIn) {
      // Mostrar el backdrop y el mensaje de login
      setShowBackdrop(true);
      setShowLoginMessage(true);

      // Ocultar el backdrop después de 1.5 segundos
      setTimeout(() => {
        setShowBackdrop(false);
      }, 1500);

      // Ocultar el mensaje de login después de 4 segundos
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 4000);
    } else {
      // Navegar a la página de reservas si el usuario está logueado
      navigate("/turns");
    }
  };

  return (
    <>
      {homeImages === 1 ? (
        <Box
          style={{
            backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              marginBottom: "5px",
              color: darkMode.on ? "white" : darkMode.dark,
            }}
          >
            Cargando
          </h2>
          <div className="loader"></div>
        </Box>
      ) : (
        <>
          <div
            className="container-home"
            style={{
              display: "flex",
              height: "calc(100vh - 70px)",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
              position: "relative", // Para el backdrop
            }}
          >
            {showBackdrop && (
              <div
                className="backdrop"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.7)", // Color de oscurecimiento
                  zIndex: 1, // Asegura que el backdrop esté encima de todo
                  transition: "opacity 0.3s ease",
                }}
              />
            )}

            <Box style={{ height: "30%", zIndex: showBackdrop ? 2 : 0 }}>
              {homeImages === 1 ? (
                <Box>
                  <Skeleton
                    style={{
                      width: "100%",
                      height: "100%",
                      marginTop: "20px",
                      boxShadow: "0px 43px 51px -23px rgba(0,0,0,0.57)", // Propiedades de la sombra
                    }}
                    variant="circular"
                  />
                </Box>
              ) : (
                <img
                  className="img-logotipo-home"
                  src={
                    homeImages.length > 0 && homeImages[0][1]
                      ? homeImages[0][1]
                      : darkMode.on
                      ? defaultImgLight
                      : defaultImg
                  }
                  alt="nombre del lugar"
                  style={{
                    marginTop: "20px",
                    objectFit: "cover",
                    borderRadius: "200px",
                    boxShadow: "0px 43px 51px -23px rgba(0,0,0,0.57)", // Propiedades de la sombra
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "30%",
                display: "flex",
                justifyContent: "space-between",
                zIndex: showBackdrop ? 2 : 0, // Asegura que los contenidos estén encima del backdrop
              }}
            >
              <Box
                style={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "end",
                }}
              >
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
              </Box>
              <Box
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleReserveClick}
                  className="btn-reservar-home"
                  variant="contained"
                  style={{
                    boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
                    borderRadius: "50px",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "20px",
                    backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    color: darkMode.on ? darkMode.dark : "white",
                  }}
                >
                  Reservar
                </Button>
              </Box>
              <Box
                style={{
                  width: "25%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                }}
              >
                <a
                  href="whatsapp://send?phone=+5492983664119&text=Quiero saber cómo obtener una página para mi negocio."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="img-whatsapp-home"
                    src={whatsapp}
                    alt="whatsapp"
                  />
                </a>
              </Box>
            </Box>

            {showLoginMessage && (
              <span
                className="login-message"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  zIndex: 3, // Asegura que el mensaje esté encima de todo
                  boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
                }}
              >
                ¡Inicia sesión primero!
              </span>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
