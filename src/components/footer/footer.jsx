import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import loreal from "../../assets/images/l_oreal.png";
import gama from "../../assets/images/gama.png";
import silkey from "../../assets/images/silkey.png";
import babyliss from "../../assets/images/babyliss.png";
import pantene from "../../assets/images/pantene.png";
import Maps from "../maps/maps";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import { NavLink } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const { pageIsReady } = useContext(LoadAndRefreshContext);

  // Configuración del carrusel
  const settings = {
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          infinite: true,
        },
      },
    ],
  };

  return (
    <footer
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "var(--bg-color)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "100px",
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            width: "90%",
            fontSize: "20px",
            marginBottom: "10px",
            color: "var(--text-color)",
          }}
        >
          Algunas de las marcas con las que trabajamos:
        </span>
        <hr
          style={{
            width: "100%",
            maxWidth: "900px",
            border: "1px solid #208de7",
            borderRadius: "10px",
            margin: "30px 0px 10px 0px",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignSelf: "center",
            flexDirection: "column",
            justifyContent: "center",
            height: "140px",
            width: "100%",
            maxWidth: "900px",
            pointerEvents: "none",
            backgroundColor: "var(--bg-color)",
          }}
        >
          {/* Degradado a la izquierda */}
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              zIndex: 1,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "150px", // Ancho de la sombra
              height: "165px",
              background: `linear-gradient(to left, var(--transparent), var(--bg-color))`,
            }}
          ></div>

          {/* Carrusel */}
          <Slider {...settings}>
            <div
              style={{
                display: "flex",
                width: "20%",
              }}
            >
              <img
                className="img-carousel-footer"
                src={loreal}
                alt="Imagen 1"
                style={{
                  height: "100px",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            </div>
            <div style={{ display: "flex", width: "20%" }}>
              <img
                className="img-carousel-footer"
                src={gama}
                alt="Imagen 2"
                style={{
                  height: "100px",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            </div>
            <div style={{ display: "flex", width: "20%" }}>
              <img
                className="img-carousel-footer"
                src={pantene}
                alt="Imagen 3"
                style={{
                  height: "100px",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />
            </div>
            <div style={{ display: "flex", width: "20%" }}>
              <img
                className="img-carousel-footer"
                src={silkey}
                alt="Imagen 4"
                style={{
                  height: "100px",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />
            </div>
            <div style={{ display: "flex", width: "20%" }}>
              <img
                className="img-carousel-footer"
                src={babyliss}
                alt="Imagen 5"
                style={{
                  height: "100px",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            </div>
          </Slider>
          {/* Degradado a la derecha */}
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              zIndex: 1,
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: "150px", // Ancho de la sombra
              height: "165px",
              background: `linear-gradient(to right, var(--transparent), var(--bg-color))`,
            }}
          ></div>
        </div>
      </div>
      <hr
        style={{
          width: "100%",
          maxWidth: "900px",
          border: "1px solid #208de7",
          borderRadius: "10px",
          margin: "10px 0px 50px 0px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "95%",
          maxWidth: "900px",
          marginBottom: "25px",
        }}
      >
        <span
          style={{
            margin: "10px 0px 5px 15px",
            fontSize: "18px",
          }}
        >
          Puedes encontrarnos aquí:
        </span>
        {pageIsReady && <Maps />}
      </div>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          background: `linear-gradient(to top,  var(--bg-color-secondary), var(--transparent))`,
        }}
      >
        <div
          style={{
            width: "95%",
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
              <img src={facebook} alt="facebook" className="img-social-home" />
            </NavLink>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Contáctenos</span>
            <a
              href={`whatsapp://send?phone=3834971799&text=Hola! Recuerda que tienes reserva en la barbería, revisa en la sección "Mis Turnos". 🤗`}
              className="img-social-home-link"
              rel="noopener noreferrer"
            >
              <img className="img-social-home" src={whatsapp} alt="whatsapp" />
            </a>
          </div>
        </div>
        <div
          style={{
            width: "95%",
            marginTop: "25px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Olavarria, Bs As, Argentina</span>
          <span>Todos los derechos reservados @2024 </span>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
