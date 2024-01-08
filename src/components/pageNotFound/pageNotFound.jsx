import React from "react";
import toHome from "../../assets/icons/home2.png";
import cilindroBlanco from "../../assets/images/cilindro-blanco.jpg";
import { NavLink } from "react-router-dom";
import { Box, Button } from "@mui/material";

const NotFound = () => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        height: "100vh", // Puedes ajustar esto según tus necesidades
        overflow: "hidden", // Para ocultar cualquier desbordamiento de la imagen
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centrar horizontal y verticalmente
          width: "100%",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: "1",
        }}
      >
        <h1 style={{ fontSize: "50px" }}>Error 401</h1>
        <h2>No tienes permiso para acceder</h2>
        <NavLink to="/">
          <Button
            style={{
              marginTop: "200px",
              border: "none",
              backgroundColor: "rgba(227,220,216)",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0px 12px 5px 0px rgba(0,0,0,0.75)",
            }}
          >
            <img src={toHome} />
          </Button>
        </NavLink>
      </Box>
      <img
        src={cilindroBlanco}
        style={{
          rotate:"180deg",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default NotFound;
