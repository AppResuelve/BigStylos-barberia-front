import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, setRef } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import formatHour from "../../functions/formatHour";
import AlertModal from "../interfazMUI/alertModal";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./myTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [listMyTurns, setListMyTurns] = useState([]);
  const [InfoToSubmit, setInfoToSubmit] = useState({});
  const [showAlert, setShowAlert] = useState({});
  const [validateAlert, setValidateAlert] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [turnServices, setTurnServices] = useState([]);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    // Recupera la lista de servicios agendados del localStorage
    const existingTurns =
      JSON.parse(localStorage.getItem("turnServices")) || [];

    // Establece la lista en el estado
    setTurnServices(existingTurns);
  }, []); // Se ejecuta solo una vez al montar el componente

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
  }, [userData , refresh]);

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
      const response = await axios.post(
        `${VITE_BACKEND_URL}/workdays/cancel`,
        {
          month: InfoToSubmit.month,
          day: InfoToSubmit.day,
          time: InfoToSubmit.hourTime,
          emailWorker: InfoToSubmit.worker,
          emailClient: userData.email
        }
      );
      const { data } = response;
      setRefresh(!refresh)
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
          Object.keys(listMyTurns).length > 0 ?
          (listMyTurns.map((turn, index) => {
            return (
              <Box
                key={index}
                className="box-container-turn-myTurns"
                sx={{
                  backgroundColor: darkMode.on ? "white" : "#d6d6d5",
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
                  <h3 className="h3-myTurns">{turnServices[index]}</h3>
                  <h4 className="h4-myTurns">
                    El día: {turn.day}/{turn.month} a las{" "}
                    {formatHour(turn.hourTime.ini)}
                  </h4>
                  <hr style={{ width: "100%" }} />
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
                    sx={{ width: "80%" }}
                  >
                    <h4 className="h4-myTurns">Profesional:</h4>
                    <h4 className={sm ? "ticker-text" : "h4-myTurns"}>
                      {turn.worker}
                    </h4>
                  </Box>

                  <Button
                    // variant="outlined"
                    className="btn-cancel-myTurns"
                    sx={{
                      marginLeft: "5px",
                      display: "flex",
                      alignSelf: "end",
                      borderRadius: "5px",
                      color: "red",
                      transition: ".2s",
                    }}
                    onClick={() => handleConfirmCancelTurn(turn)}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </Box>
              </Box>
            );
          })) : (
            <h4 style={{ display: "flex", justifyContent: "center"}}>No tienes turnos todavia</h4>
          )}
      </Box>
      {showAlert.alertNumber === 1 && (
        <AlertModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          handleActionProp={setValidateAlert}
        />
      )}
      {showAlert.alertNumber === 2 && (
        <AlertModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      )}
    </div>
  );
};

export default MyTurns;
