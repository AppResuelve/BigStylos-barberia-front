import { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { NavLink } from "react-router-dom";
import { Box, Button, CircularProgress, Skeleton } from "@mui/material";
import defaultImg from "../../assets/icons/no-image-logotipe.png";
import defaultImgLight from "../../assets/icons/no-image-logotipe-light.png";
import instagram from "../../assets/icons/instagram.png";
import facebook from "../../assets/icons/facebook.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import "./home.css";

const Home = ({ user, homeImages }) => {
  const { darkMode, setShowAlert } = useContext(DarkModeContext);
  return (
    <div
      className="container-home"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
      }}
    >
      <Box>
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
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Box
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            alignSelf: "end",
            marginBottom: "40px",
          }}
        >
          <NavLink
            to="https://www.instagram.com/"
            target="-blank"
            rel="noopener noreferrer"
          >
            <img src={instagram} alt="instagram" className="img-social-home" />
          </NavLink>
          <NavLink
            to="https://www.facebook.com/"
            target="-blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="facebook" className="img-social-home" />
          </NavLink>
        </Box>
        <Box
          style={{ width: "50%", display: "flex", justifyContent: "center" }}
        >
          <NavLink to="/turns">
            <Button
              className="btn-reservar-home"
              variant="contained"
              style={{
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
          }}
        >
          <a
            href="whatsapp://send?phone=+5493834971799&text=Hola , quiero contactarte"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="img-whatsapp-home" src={whatsapp} alt="whatsapp" />
          </a>
        </Box>
      </Box>
    </div>
  );
};
export default Home;
