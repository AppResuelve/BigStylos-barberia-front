import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import "./login-logout.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      className="btn-loginout-login"
      variant="contained"
      style={{
        boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
        fontFamily: "Jost, sans-serif",
        borderRadius: "50px",
        fontSize: "22px",
      }}
      onClick={() => loginWithRedirect()}
    >
      entrar
    </Button>
  );
};

export default LoginButton;
