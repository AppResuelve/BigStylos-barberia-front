import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button } from "@mui/material";
import calendar from "../../assets/images/calendar2.png";
import defaultServiceImg from "../../assets/images/serviciosfondodefault.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./turns.css";
import { convertToCategoryServiceArray } from "../../helpers/convertCategoryService";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const {
    userData,
    darkMode,
    setShowAlert,
    validateAlertTurns,
    setValidateAlertTurns,
    validateAlertTurnsWorker,
    setValidateAlertTurnsWorker,
    refreshWhenCancelTurn,
    clientName,
    setClientName,
  } = useContext(DarkModeContext);

  const [days, setDays] = useState([]);
  const [catServices, setCatServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("");
  const [showTurns, setShowTurns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [detailTurn, setDetailTurn] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (validateAlertTurns === true || validateAlertTurnsWorker === true) {
      submit();
      setValidateAlertTurns(false);
      setValidateAlertTurnsWorker(false);
    }
  }, [validateAlertTurns, validateAlertTurnsWorker]);

  // const submit = async () => {
  //   let {
  //     dayIsSelected,
  //     serviceSelected,
  //     selectedTime,
  //     workerEmail,
  //     userEmail,
  //   } = detailTurn;

  //   if (clientName !== "" && user.worker) {
  //     userEmail = clientName;
  //   }

  //   try {
  //     const response = await axios.put(`${VITE_BACKEND_URL}/workdays/turn`, {
  //       date: dayIsSelected,
  //       emailWorker: workerEmail,
  //       selectedTime,
  //       serviceSelected,
  //       user: userEmail,
  //     });
  //     const { data } = response;

  //     // Recuperar datos existentes del localStorage
  //     const existingTurns =
  //       JSON.parse(localStorage.getItem("turnServices")) || [];
  //     // Crear un nuevo objeto con la estructura deseada
  //     const newTurn = {
  //       [serviceSelected]: {
  //         month: dayIsSelected[1],
  //         day: dayIsSelected[0],
  //         ini: selectedTime,
  //       },
  //     };
  //     // Agregar el nuevo objeto a la lista
  //     existingTurns.push(newTurn);
  //     // Guardar en el localStorage
  //     localStorage.setItem("turnServices", JSON.stringify(existingTurns));

  //     setDetailTurn({});
  //     setTimeout(() => {
  //       setShowAlert({
  //         isOpen: true,
  //         message: `Su turno ha sido agendado exitosamente!`,
  //         type: "success",
  //         button1: {
  //           text: "",
  //           action: "",
  //         },
  //         buttonClose: {
  //           text: "aceptar",
  //         },
  //       });
  //     }, 800);
  //     setRefresh(true);
  //   } catch (error) {
  //     console.error("Error al tomar turno submit:", error);
  //   }
  // };

  // useEffect(() => {
  //   setDayIsSelected([]);
  // }, [serviceSelected]);

  // useEffect(() => {
  //   const fetchDays = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${VITE_BACKEND_URL}/workdays/byservices`,
  //         { servicesForTurns: serviceSelected }
  //       );
  //       const { data } = response;
  //       setDays(data);
  //       setRefresh(false);
  //     } catch (error) {
  //       console.error("Error al obtener los dias:", error);
  //     }
  //   };
  //   if (serviceSelected.length > 0 || refresh == true) {
  //     fetchDays();
  //   }
  // }, [serviceSelected, refresh, refreshWhenCancelTurn]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        const catServicesArr = convertToCategoryServiceArray(data);
        setCatServices(catServicesArr);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  // const handleSelectService = (element) => {
  //   setServiceSelected(element[0]);
  //   setSelectedImg(element[1]);
  // };

  // useEffect(() => {
  //   if (Object.keys(detailTurn).length > 0) {
  //     if (Object.keys(user).length > 0 && user.worker) {
  //       setShowAlert({
  //         isOpen: true,
  //         message: `Turno para ${detailTurn.serviceSelected} el dia ${
  //           detailTurn.dayIsSelected[0]
  //         }/${detailTurn.dayIsSelected[1]} a las ${formatHour(
  //           detailTurn.selectedTime
  //         )}.`,
  //         type: "warning",
  //         button1: {
  //           text: "confirmar",
  //           action: "handleActionProp",
  //         },
  //         buttonClose: {
  //           text: "cancelar",
  //         },
  //         stateName: "validateAlertTurnsWorker",
  //       });
  //     } else {
  //       setShowAlert({
  //         isOpen: true,
  //         message: `Turno para ${detailTurn.serviceSelected} el dia ${
  //           detailTurn.dayIsSelected[0]
  //         }/${detailTurn.dayIsSelected[1]} a las ${formatHour(
  //           detailTurn.selectedTime
  //         )}.`,
  //         type: "warning",
  //         button1: {
  //           text: "confirmar turno",
  //           action: "handleActionProp",
  //         },
  //         buttonClose: {
  //           text: "cancelar",
  //         },
  //         stateName: "validateAlertTurns",
  //       });
  //     }
  //   }
  // }, [detailTurn]);

  return (
    <div
      className=""
      style={{
        display: "flex",
        paddingTop: "50px",
        justifyContent: "center",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "40vh",
        }}
      >
        {catServices.length < 1 ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              fontSize: "18px",
            }}
          >
            No tienes servicios aún
          </span>
        ) : (
          catServices.map((elem, index) => {
            return (
              <div key={index} style={{ marginTop: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {elem.category}
                </span>
                <hr />
                {elem.services.map((service, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div style={{ display: "flex", width: "100%" }}>
                        <span style={{ width: "40%", margin: "5px" }}>
                          {service.name}
                        </span>
                        <span
                          style={{
                            width: "30%",
                            margin: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          ${service.price}
                        </span>
                      </div>
                      <hr />
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })
        )}
        {/* {services.map((element, index) => (
              <Box key={index} style={{ padding: "8px" }}>
                <Button
                  variant={
                    element[0] === serviceSelected ? "contained" : "outlined"
                  }
                  className={
                    element[0] === serviceSelected
                      ? "btn-services-selected"
                      : "btn-services"
                  }
                  style={{
                    wordWrap: "break-word",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    width: element[0] === serviceSelected ? "170px" : "160px",
                    borderRadius: "7px",
                    border: "none",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "15px",
                    height: "45px",
                    letterSpacing: "1.5px",
                    color: "white",
                    textTransform: "lowercase",
                    backgroundColor:
                      element[0] === serviceSelected ? "#134772" : "#2196F3",
                    transition: "0.3s",
                    boxShadow:
                      element[0] === serviceSelected
                        ? "0px 10px 14px 0px rgba(0, 0, 0, 0.75)"
                        : "0px 5px 14px -5px rgba(0, 0, 0, 0.75)",
                    zIndex: "30",
                  }}
                  onClick={() => handleSelectService(element)}
                >
                  {element[0]}
                </Button>
              </Box>
            ))} */}

        {/* <div>
          <img
            src={selectedImg ? selectedImg : defaultServiceImg}
            alt="img servicio"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderBottom: "3px solid #134772",
            }}
          />
        </div> */}
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          alignSelf: "center",
          width: "95%",
          height: "60vh",
        }}
      >
        <div className="box-calendar-turns">
          <CustomCalendarTurns
            sm={sm}
            amountOfDays={27}
            dayIsSelected={dayIsSelected}
            setDayIsSelected={setDayIsSelected}
            serviceSelected={serviceSelected}
            days={days}
            setIsOpen={setIsOpen}
            // user={user}
          />
        </div>
      </Box> */}
      {/* {dayIsSelected.length > 0 && (
          <ShowTurns
            dayIsSelected={dayIsSelected}
            setDayIsSelected={setDayIsSelected}
            serviceSelected={serviceSelected}
            user={user}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            detailTurn={detailTurn}
            setDetailTurn={setDetailTurn}
          />
        )} */}
    </div>
  );
};

export default Turns;

// let arrr = [
//   {
//     peinado: {
//       month: 2,
//       day: 16,
//       ini: 450,
//     },
//   },
//   {
//     cortedepelo: {
//       month: 2,
//       day: 17,
//       ini: 490,
//     },
//   },
// ];
