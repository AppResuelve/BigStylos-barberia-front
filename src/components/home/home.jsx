import { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import defaultImg from "../../assets/images/fondo-peluqueria-1.avif";
const Home = ({ user, homeImages }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
      }}
    >
      <img
        src={homeImages[0] ? homeImages[0] : defaultImg}
        alt="nombre del lugar"
        style={{
          marginTop: "20px",
          width: "400px",
          height: "400px",
          objectFit: "cover",
          borderRadius: "200px",
          boxShadow: "0px 43px 51px -23px rgba(0,0,0,0.57)", // Propiedades de la sombra
        }}
      />
      <NavLink to="/turns">
        <Button
          variant="contained"
          style={{
            marginBottom: "150px",
            borderRadius: "50px",
            height: "60px",
            fontFamily: "Jost, sans-serif",
            fontSize: "23px",
            backgroundColor: darkMode.on ? "white" : darkMode.dark,
            color: darkMode.on ? darkMode.dark : "white",
          }}
        >
          Reservar
        </Button>
      </NavLink>
    </div>
  );
};
export default Home;
