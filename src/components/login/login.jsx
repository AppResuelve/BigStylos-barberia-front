import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      style={{
        width: "150px",
        height: "60px",

        borderRadius: "50px",
        boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
        fontFamily: "Jost, sans-serif",
        fontSize: "22px",
      }}
      onClick={() => loginWithRedirect()}
    >
      entrar
    </Button>
  );
};

export default LoginButton;
