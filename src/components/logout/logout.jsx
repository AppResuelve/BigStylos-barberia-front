import React from "react";
import { Button } from "@mui/material";
import "../login/login-logout.css";
import { deleteCookie } from "../../helpers/cookies";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
const LogoutButton = () => {
  const { setRefreshStatusSession } = useContext(DarkModeContext);

  const handleLogOut = () => {
    deleteCookie("IDSESSION");
    setRefreshStatusSession((prev) => {
      const prevStatusSession = prev;
      return !prevStatusSession;
    });
  };
  return (
    <Button
      className="btn-loginout-login"
      variant="contained"
      style={{
        position: "absolute",
        bottom: "calc(0% + 20px)",
        left: "calc(0% + 20px)",
        borderRadius: "50px",
        fontFamily: "Jost, sans-serif",
        fontSize: "18px",
      }}
      onClick={handleLogOut}
    >
      Salir
    </Button>
  );
};

export default LogoutButton;
