import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant="contained"
      style={{
        width: "130px",
        height: "50px",
        borderRadius: "50px",
        fontFamily: "Jost, sans-serif",
        fontSize: "22px",
      }}
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Salir
    </Button>
  );
};

export default LogoutButton;
