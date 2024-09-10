import { useEffect, useState, useContext } from "react";
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
import { Box } from "@mui/material";
import Maps from "../maps/maps";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import "./footer.css";
import { convertToRGB } from "../../helpers/convertColorToRgb";
import { NavLink } from "react-router-dom";
import { LoaderMapReady } from "../loaders/loaders";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const { pageIsReady } = useContext(LoadAndRefreshContext);
  const [colorRGB, setColorRGB] = useState("");
  const [invertedColorRGB, setInvertedColorRGB] = useState("");

  useEffect(() => {
    let invertedColor;
    let color;
    if (darkMode.on) {
      color = convertToRGB(darkMode.dark);
      invertedColor = convertToRGB(darkMode.light);
      setColorRGB(color);
      setInvertedColorRGB(invertedColor);
    } else {
      color = convertToRGB(darkMode.light);
      invertedColor = convertToRGB(darkMode.dark);
      setColorRGB(color);
      setInvertedColorRGB(invertedColor);
    }
  }, [darkMode]);

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
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
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
            color: darkMode.on ? "#e6e6e6" : "black",
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
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignSelf: "center",
            flexDirection: "column",
            justifyContent: "center",
            height: "140px",
            width: "100%",
            maxWidth: "900px",
            pointerEvents: "none",
            bgcolor: darkMode.on ? darkMode.light : "",
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
              background: `linear-gradient(to left, rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},0), rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},1))`,
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
              background: `linear-gradient(to right, rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},0), rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},1))`,
            }}
          ></div>
        </Box>
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
            color: darkMode.on ? "#e6e6e6" : "black",
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
          backgroundColor: "red",
          color: darkMode.on ? "#e6e6e6" : "black",
          background: `linear-gradient(to top, lightgray, transparent)`,
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
              className="img-social-home-link
              href="
              whatsapp:target="_blank" //send?phone=+5492983664119&text=Quiero saber cómo obtener una página para mi negocio."
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
          <h4>Olavarria, Bs As, Argentina</h4>
          <h4>Todos los derechos reservados @2024 </h4>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
