import { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { NavLink } from "react-router-dom";
import Footer from "../footer/footer";
import { Box, Button, Skeleton } from "@mui/material";
import defaultImg from "../../assets/icons/no-image-logotipe.png";
import defaultImgLight from "../../assets/icons/no-image-logotipe-light.png";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import "./home.css";

const Home = ({ homeImages }) => {
  const { darkMode } = useContext(DarkModeContext);

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
        <div
          className="container-home"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
          }}
        >
          <div className="custom-shape-divider-bottom-1707002929">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                style={{ fill: "white" }}
              ></path>
            </svg>
          </div>
          <Box style={{ height: "50vh" }}>
            {homeImages === 1 ? (
              <Box className="img-logotipo-home">
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
                  homeImages[0]
                    ? homeImages[0]
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
            style={{
              position: "relative",
              width: "100%",
              height: "40vh",
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <Box
              style={{
                zIndex: "100",
                width: "25%",
                display: "flex",
                flexDirection: "column",
                alignSelf: "end",
                marginBottom: "40px",
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
              <NavLink to="/turns" className="btn-reservar-home-link">
                <Button
                  className="btn-reservar-home"
                  variant="contained"
                  style={{
                    boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
                    marginBottom: "50px",
                    borderRadius: "50px",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "20px",
                    backgroundColor: darkMode.on ? "white" : darkMode.dark,
                    color: darkMode.on ? darkMode.dark : "white",
                  }}
                >
                  Reservar
                </Button>
              </NavLink>
            </Box>
            <Box
              style={{
                width: "25%",
                display: "flex",
                justifyContent: "end",
                alignItems: "end",
                marginBottom: "40px",
                zIndex: "100",
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
          <Footer />
        </div>
      )}
    </>
  );
};
export default Home;
