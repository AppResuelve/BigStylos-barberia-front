import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useAuth0 } from "@auth0/auth0-react";
import "./alertModal.css";

const AlertModal = ({ showAlert, setShowAlert, handleActionProp }) => {
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
      document.body.classList.add("alert-open");
    } else {
      // Remover la clase alert-open cuando se desmonta el componente o el alerta se cierra
      document.body.classList.remove("alert-open");
    }
  }, [showAlert]);

  let action;
  let type = [];

  if (Object.keys(showAlert).length > 0) {
    if (showAlert.button1.action === "login") {
      action = loginWithRedirect;
    } else if (showAlert.button1.action === "handleActionProp") {
      console.log("pase por aca");
      action = () => {
        handleActionProp("confirm");
        setMoveDown(true);
      };
    }
  }

  if (showAlert.type === "warning") {
    type = ["warning", "yellow"];
  } else if (showAlert.type === "success") {
    type = ["success", "green"];
  } else if (showAlert.type === "error") {
    type = ["error", "red"];
  }

  return (
    <>
      {Object.keys(showAlert).length > 0 && (
        <Alert
          className={`alert-container ${moveDown ? "exit" : ""}`}
          severity={type[0]}
          style={{
            borderRadius: "10px",
            boxShadow: "0px 45px 22px -34px rgba(0, 0, 0, 0.57)",
            fontFamily: "Jost, sans-serif",
            border: `2px solid ${type[1]}`,
          }}
        >
          <h2>{showAlert.message}</h2>
          <Box style={{ display: "flex", justifyContent: "space-around" }}>
            {showAlert.buttonClose.text !== "" && (
              <Button
                onClick={() => setMoveDown(true)}
                style={{ fontFamily: "Jost, sans-serif" }}
              >
                {showAlert.buttonClose.text}
              </Button>
            )}
            {showAlert.button1.text !== "" && (
              <Button
                onClick={() => action()}
                style={{ fontFamily: "Jost, sans-serif" }}
              >
                {showAlert.button1.text}
              </Button>
            )}
          </Box>
        </Alert>
      )}
    </>
  );
};

export default AlertModal;
