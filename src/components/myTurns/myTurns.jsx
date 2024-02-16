import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Box, Button, Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import formatHour from "../../functions/formatHour";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import "./myTurns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const {
    darkMode,
    setShowAlert,
    validateAlert,
    setValidateAlert,
    refreshWhenCancelTurn,
    setRefreshWhenCancelTurn,
    disableButtonMyTurns,
    setDisableButtonMyTurns,
  } = useContext(DarkModeContext);
  const [listMyTurns, setListMyTurns] = useState(1);
  const [InfoToSubmit, setInfoToSubmit] = useState({});
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [turnServices, setTurnServices] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
        if (data.length < 1) {
          localStorage.removeItem("turnServices");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (Object.keys(userData).length > 0) {
      fetchData();
    }
  }, [userData, refresh]);

  useEffect(() => {
    if (validateAlert === true) {
      handleSubmit();
      setValidateAlert(false);
    }
  }, [validateAlert]);

  const handleConfirmCancelTurn = (turn, selectedService) => {
    let newTurn = {
      ...turn,
      selectedService: selectedService,
    };
    setInfoToSubmit(newTurn);
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
      stateName: "validateAlert",
    });
    setDisableButtonMyTurns(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/workdays/cancel`, {
        month: InfoToSubmit.month,
        day: InfoToSubmit.day,
        time: InfoToSubmit.hourTime,
        emailWorker: InfoToSubmit.worker,
        emailClient: userData.email,
        selectedService: InfoToSubmit.selectedService,
      });
      const { data } = response;

      // Recuperar los turnos del localStorage
      let existingTurns =
        JSON.parse(localStorage.getItem("turnServices")) || [];

      // Filtrar los turnos para eliminar el turno cancelado
      existingTurns = existingTurns.filter((turn) => {
        const serviceName = Object.keys(turn)[0];
        const { month, day, ini } = turn[serviceName];
        return (
          month !== InfoToSubmit.month ||
          day !== InfoToSubmit.day ||
          ini !== InfoToSubmit.hourTime.ini
        );
      });

      // Guardar los turnos actualizados en el localStorage
      localStorage.setItem("turnServices", JSON.stringify(existingTurns));

      setRefresh(!refresh);
      setRefreshWhenCancelTurn(!refreshWhenCancelTurn);
      const timeoutId = setTimeout(() => {
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
        });
      }, 450);

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    }
  };

  return (
    <div className="div-container-myturns">
      <Box style={{ overflow: "auto" }}>
        {listMyTurns === 1 ? (
          <Skeleton variant="rounded" height={80} style={{ width: "100%" }} />
        ) : listMyTurns && Object.keys(listMyTurns).length > 0 ? (
          listMyTurns.map((turn, index) => {
            let serviceName;
            turnServices.map((service, index) => {
              let serviceObj = Object.keys(service); //para acceder luego a la prop de cada obj en cada vuelta
              if (
                turn.month === service[serviceObj].month &&
                turn.day === service[serviceObj].day &&
                turn.hourTime.ini === service[serviceObj].ini
              ) {
                serviceName = Object.keys(service)[0];
              }
            });

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
                  <h3 className="h3-myTurns">{serviceName}</h3>
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
                    disabled={disableButtonMyTurns ? true : false}
                    className="btn-cancel-myTurns"
                    sx={{
                      marginLeft: "5px",
                      display: "flex",
                      alignSelf: "end",
                      borderRadius: "5px",
                      color: "red",
                      transition: ".2s",
                    }}
                    onClick={() => handleConfirmCancelTurn(turn, serviceName)}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </Box>
              </Box>
            );
          })
        ) : (
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: darkMode.on ? "white" : darkMode.dark,
              height: "80px",
            }}
          >
            No tienes turnos todavía
          </h4>
        )}
      </Box>
    </div>
  );
};

export default MyTurns;
