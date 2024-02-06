import { useContext } from "react";
import { DarkModeContext } from "../../App";
import toHome from "../../assets/icons/homeBlack.png";
import toHomeWhite from "../../assets/icons/homeWhite.png";

import imgFondoError from "../../assets/images/mano-error.png";
import { NavLink } from "react-router-dom";
import { Box, Button } from "@mui/material";

const NotFound = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: darkMode.on ? darkMode.dark : "#cccccc",
      }}
    >
      <Box
        style={{
          width: "100%",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: "1",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: darkMode.on ? "white" : darkMode.dark,
          }}
        >
          <h1 style={{ fontSize: "50px" }}>Error 401</h1>
          <h2>No tienes permiso para acceder</h2>
        </Box>
        <NavLink to="/">
          <Button
            style={{
              border: "none",
              backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
              padding: "40px",
              borderRadius: "50%",
              background: darkMode.on
                ? "linear-gradient(145deg, #28292a, #212223)"
                : "linear-gradient(145deg, #dadada, #b8b8b8)",
              boxShadow: darkMode.on
                ? "30px 30px 57px #1e1e1f,-30px -30px 57px #2c2e2f"
                : "30px 30px 57px #a3a3a3,-30px -30px 57px #f5f5f5",
            }}
          >
            <img src={darkMode.on ? toHomeWhite : toHome} />
          </Button>
        </NavLink>
      </Box>
      <img
        src={imgFondoError}
        style={{
          position: "absolute",
          bottom: "-10%",
        }}
      />
    </div>
  );
};

export default NotFound;
