import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import tinycolor from "tinycolor2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import loreal from "../../assets/images/l_oreal.png";
import gama from "../../assets/images/gama.png";
import silkey from "../../assets/images/silkey.png";
import babyliss from "../../assets/images/babyliss.png";
import pantene from "../../assets/images/pantene.png";
import { Box } from "@mui/material";
import "./footer.css";

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [colorRGB, setColorRGB] = useState("");

  useEffect(() => {
    // Función para convertir el color a formato RGB
    const convertToRGB = (color) => {
      // Lógica para convertir el color a formato RGB
      // Puedes utilizar bibliotecas como 'tinycolor2' para esto
      const rgbColor = tinycolor(color).toRgb();
      // Retorna el valor transformado
      return rgbColor;
    };
    let color;
    if (darkMode.on) {
      color = convertToRGB(darkMode.light);
      setColorRGB(color);

    } else {
      color = convertToRGB(darkMode.dark);
      setColorRGB(color);
    }
  }, [darkMode]);
  console.log(darkMode);
  console.log(colorRGB);
  // Configuración del carrusel
  const settings = {
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    autoplay: true,
    autoplaySpeed: 1000,
    // cssEase: "",
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: "100%",
        width: "100%",
        height: "200px",
        overflow: "hidden",
        zIndex: 1000,
        backgroundColor: darkMode.on ? darkMode.light : darkMode.dark,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100px",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {/* Degradado a la izquierda */}
        <div
          style={{
            zIndex: 1000,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "70px", // Ancho de la sombra
            height: "100px",
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
              src={loreal}
              alt="Descripción de la imagen 1"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                maxWidth: "200px",
                margin: "0 auto",
                filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              src={gama}
              alt="Descripción de la imagen 2"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                maxWidth: "200px",
                margin: "0 auto",
                filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              src={pantene}
              alt="Descripción de la imagen 2"
              style={{
                display: "flex",
                justifySelf: "center",
                alignSelf: "center",
                width: "100px",
                height: "100px",
                objectFit: "cover",
                maxWidth: "200px",
                margin: "0 auto",
                filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              src={silkey}
              alt="Descripción de la imagen 2"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                maxWidth: "200px",
                margin: "0 auto",
                filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              src={babyliss}
              alt="Descripción de la imagen 2"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                maxWidth: "200px",
                margin: "0 auto",
                filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              }}
            />
          </div>
          {/* Agrega más elementos según sea necesario */}
        </Slider>
        {/* Degradado a la derecha */}
        <div
          style={{
            zIndex: 1000,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "70px", // Ancho de la sombra
            height: "100px",
            background: `linear-gradient(to right, rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},0), rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},1))`,
          }}
        ></div>
      </Box>
    </div>
  );
};

export default Footer;
