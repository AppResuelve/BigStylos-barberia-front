import { useContext, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { verificateFrontResponse } from "../../helpers/verificateFrontResponseMP";
import { getCookie } from "../../helpers/cookies";
import { getLocalStorage } from "../../helpers/localStorage";
import defaultImg from "../../assets/icons/no-image-logotipe.png";
import defaultImgLight from "../../assets/icons/no-image-logotipe-light.png";
import Swal from "sweetalert2";
import axios from "axios";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { LoaderMapReady } from "../loaders/loaders";
import "./home.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const { darkMode, homeImages } = useContext(ThemeContext);
  const { googleLogin, userData } = useContext(AuthContext);
  const { setImgLogoLoaded } = useContext(LoadAndRefreshContext);
  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
console.log(defaultImg, "defaultImg");
console.log(defaultImgLight, "defaultImgLight");

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
        title: "Inicia sesión para reservar",
        showDenyButton: true,
        confirmButtonText: "Iniciar sesión",
        denyButtonText: "Más tarde",
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
  // habilitar el el handle cuando se habilite el button de abajo ⬇️
  // const handleGoToOurServices = () => {
  //   navigate("/nuestros-servicios");
  // };

  return (
    <div
      className="container-home"
      style={{
        display: "flex",
        height: "100svh",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "var(--bg-color)",
        // backgroundImage: `url('ruta/a/la/imagen.jpg')`, // Cambia la ruta a tu imagen
        // backgroundSize: "cover", // Ajusta cómo se escala la imagen
        // backgroundPosition: "center", // Posiciona la imagen
      }}
    >
      <section className="container-img-logotipo">
        {homeImages.length > 0 && homeImages[0] && homeImages[0][1] ? (
          <img
            onLoad={() => setImgLogoLoaded(true)}
            className="img-logotipo-home"
            src={
              homeImages && homeImages[0] && homeImages[0][1] !==""
                ? homeImages[0][1]
                : darkMode.on
                ? defaultImgLight
                : defaultImg
            }
            alt="nombre del lugar"
          />
        ) : (
          <LoaderMapReady />
        )}
        <div
          style={{
            background: `linear-gradient(to bottom, var(--bg-color), var(--transparent)`,
          }}
          className="image-overlay"
        ></div>
      </section>
      <section
        className="section-btn-reservar"
        style={{
          height: md ? "135px" : "70px",
          borderRadius: "20px 20px 0px 0px",
          background: `linear-gradient(to bottom, var(--bg-color-secondary), var(--transparent))`,
        }}
      >
        <div
          className="container-btn-reservar"
          style={{
            display: "flex",
            flexDirection: md ? "column" : "row",
          }}
        >
          <button
            onClick={handleReserveClick}
            className="btn-reservar-home"
            // style={{ width: md ? "100%" : "calc(50% - 5px)" }}
            // habilitar el style de ⬆️ cuando se habilite el button de abajo ⬇️
            style={{ width: "100%" }}
          >
            Reservar turno
          </button>
          {/* <div
            style={{
              position: "relative",
              width: !md ? "calc(50% - 5px)" : "100%",
            }}
          >
            <button
              id="myTurns"
              disabled={!userData}
              onClick={handleGoToOurServices}
              className="btn-reservar-home"
              style={{ width: "100%" }}
            >
              Ver servicios
            </button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
