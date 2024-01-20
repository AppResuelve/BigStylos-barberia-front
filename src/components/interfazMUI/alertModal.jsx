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
      action = () => {
        handleActionProp(true);
        setMoveDown(true);
      };
    }
  }

  if (showAlert.type === "warning") {
    type = ["warning", "#ffe1ab", "#db9718"];
  } else if (showAlert.type === "success") {
    type = ["success", "#aaff97"];
  } else if (showAlert.type === "error") {
    type = ["error", "#fdb9b9", "#ff0000fa"];
  }

  return (
    <>
      {Object.keys(showAlert).length > 0 && (
        <Alert
          className={`alert-container ${moveDown ? "exit" : ""}`}
          severity={type[0]}
          style={{
            backgroundColor: type[1],
            borderRadius: "10px",
            boxShadow: "0px 45px 22px -34px rgba(0, 0, 0, 0.57)",
            fontFamily: "Jost, sans-serif",
            border: `2px solid ${type[2]}`,
          }}
        >
          <h2 style={{ color: type[2] }}>{showAlert.message}</h2>
          <Box sx={{ display: "flex", justifyContent: "space-around", marginTop:"12px" }}>
            {showAlert.buttonClose.text !== "" && (
              <Button
                variant="outlined"
                onClick={() => setMoveDown(true)}
                style={{ fontFamily: "Jost, sans-serif", fontWeight:"bold" }}
              >
                {showAlert.buttonClose.text}
              </Button>
            )}
            {showAlert.button1.text !== "" && (
              <Button
                variant="contained"
                onClick={() => action()}
                style={{ fontFamily: "Jost, sans-serif", fontWeight:"bold" }}
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
