import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";
import formatHour from "../../functions/formatHour";
import AlertModal from "../interfazMUI/alertModal";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./myturns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const [listMyTurns, setListMyTurns] = useState([]);
  const [InfoToSubmit, setInfoToSubmit] = useState({});
  const [showAlert, setShowAlert] = useState({});
  const [validateAlert, setValidateAlert] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/myturns`,
          { emailUser: userData.email }
        );
        const { data } = response;
        setListMyTurns(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (Object.keys(userData).length > 0) {
      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    if (validateAlert === true) {
      handleSubmit();
      setValidateAlert(false);
    }
  }, [validateAlert]);

  const handleConfirmCancelTurn = (turn) => {
    setInfoToSubmit(turn);
    setShowAlert({
      isOpen: true,
      message: "Estas a punto de cancelar el turno, deseas continuar?",
      type: "error",
      button1: {
        text: "Confirmar",
        action: "handleActionProp",
      },
      buttonClose: {
        text: "Cancelar",
      },
      alertNumber: 1,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.delete(
        `${VITE_BACKEND_URL}/workdays/myturns`,
        {
          InfoToSubmit,
        }
      );
      const { data } = response;
      setShowAlert({
        isOpen: true,
        message: `Su turno ha sido cancelado exitosamente!`,
        type: "success",
        button1: {
          text: "",
          action: "",
        },
        buttonClose: {
          text: "aceptar",
        },
        alertNumber: 2,
      });
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    }
  };

  return (
    <div className="div-container-myturns">
      <Box style={{ overflow: "auto" }}>
        {listMyTurns &&
          Object.keys(listMyTurns).length > 0 &&
          listMyTurns.map((turn, index) => (
            <Box
              key={index}
              sx={{
                border: "2px solid #2196f3",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>Corte de pelo</h3>
                <hr style={{ width: "100%" }} />
                <h4>
                  El día: {turn.day}/{turn.month} a las{" "}
                  {formatHour(turn.hourTime.ini)}
                </h4>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px",
                }}
              >
                <Box
                  className={sm ? "ticker-container" : ""}
                  sx={{ width: "60%" }}
                >
                  <h4>Profesional:</h4>
                  <h4 className={sm ? "ticker-text" : ""}>{turn.worker}</h4>
                </Box>

                <Button
                  className="btn-cancel-myturns"
                  sx={{
                    marginLeft: "5px",
                    display: "flex",
                    alignSelf: "end",
                    width: "40%",
                    height: "30px",
                    maxWidth: "130px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    color: "red",
                    backgroundColor: "none",
                    border: "2px solid red",
                    letterSpacing: "1.5px",
                    transition: ".3s",
                  }}
                  onClick={() => handleConfirmCancelTurn(turn)}
                >
                  cancelar
                </Button>
              </Box>
            </Box>
          ))}
      </Box>
      {showAlert.alertNumber === 1 && (
        <AlertModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          handleActionProp={setValidateAlert}
        />
      )}
    </div>
  );
};

export default MyTurns;
