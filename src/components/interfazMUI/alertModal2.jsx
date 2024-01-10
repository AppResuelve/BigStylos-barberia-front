import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useAuth0 } from "@auth0/auth0-react";

import "./alertModal2.css";

const AlertModal2 = ({ showAlert, setShowAlert }) => {
  const [moveDown, setMoveDown] = useState(false);
  const { loginWithRedirect } = useAuth0();
  
  useEffect(() => {
    if (moveDown) {
      const timeoutId = setTimeout(() => {
        setShowAlert({});
        setMoveDown(false);
        // Remover la clase alert-open cuando se cierra el alerta
        document.body.classList.remove("alert-open");
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [moveDown]);

  useEffect(() => {
    // Agregar la clase alert-open cuando se monta el componente y el alerta está presente
    if (Object.keys(showAlert).length > 0) {
      console.log("agregue la clase");
      document.body.classList.add("alert-open");
    } else {
      console.log("elimine la clase");

      // Remover la clase alert-open cuando se desmonta el componente o el alerta se cierra
      document.body.classList.remove("alert-open");
    }
  }, [showAlert]);

  let action;
  if (
    Object.keys(showAlert).length > 0 &&
    showAlert.button1.action === "login"
  ) {
    action = loginWithRedirect;
  }

  return (
    <>
      {Object.keys(showAlert).length > 0 && (
        <Alert
          className={`alert-container ${moveDown ? "exit" : ""}`}
          severity="warning"
          style={{
            borderRadius: "10px",
            boxShadow: "0px 45px 22px -34px rgba(0, 0, 0, 0.57)",
            fontFamily: "Jost, sans-serif",
            border: "2px solid yellow",
          }}
        >
          <h2>{showAlert.message}</h2>
          <Box style={{ display: "flex", justifyContent: "space-around" }}>
            {showAlert.button1.text !== "" && (
              <Button
                onClick={() => action()}
                style={{ fontFamily: "Jost, sans-serif" }}
              >
                {showAlert.button1.text}
              </Button>
            )}
            {showAlert.buttonClose.text !== "" && (
              <Button
                onClick={() => setMoveDown(true)}
                style={{ fontFamily: "Jost, sans-serif" }}
              >
                {showAlert.buttonClose.text}
              </Button>
            )}
          </Box>
        </Alert>
      )}
    </>
  );
};

export default AlertModal2;
