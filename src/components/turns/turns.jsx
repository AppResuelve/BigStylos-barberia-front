import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import SelectedDayTurns from "../selectedDay/selectedDayTurns";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import corteDePelo from "../../assets/images/corte-pelo-masculino.jpg";
import pancho from "../../assets/images/pancho.avif";
import peinado from "../../assets/images/peinados.jpg";
// import AlertModal from "../interfazMUI/alertModal";
import AlertModal2 from "../interfazMUI/alertModal2";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ user }) => {
  const [toggle, setToggle] = useState(0);
  const [showAlert, setShowAlert] = useState({});
  const [workDays, setWorkDays] = useState([]);
  const [arrOfServices, setArrOfServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState(false);
  const [daysForCalendar, setDaysForCalendar] = useState({});
  const [workerWithTime, setWorkerWithTime] = useState({});
  const [userIsLogged, setUserIsLogged] = useState(false);

  const arrOfServicesImg = [corteDePelo, peinado, pancho];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/workdays/daysByService`
        );
        const { data } = response;
        setWorkDays(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchData();
    if (user && user.name) {
      setUserIsLogged(true);
    }
  }, [user]);
  useEffect(() => {
    // pone en un estado local arrOfServices los servicios totales disponibles
    if (workDays.length > 0) {
      const servicesArray = workDays.reduce((accumulator, workday) => {
        const services = Object.keys(workday.services);
        services.forEach((service) => {
          if (!accumulator.includes(service)) {
            accumulator.push(service);
          }
        });
        return accumulator;
      }, []);
      setArrOfServices(servicesArray);
    }
  }, [workDays]);

  const handleSelectService = async (selectedService) => {
    const result = {};

    workDays.forEach((workday) => {
      if (workday.services.hasOwnProperty(selectedService)) {
        const { time, services } = workday;
        const serviceDuration = services[selectedService];
        let noTimeAvailable;

        for (let i = 0; i <= time.length; i++) {
          let isConsecutive;

          if (time[i] === "free") {
            const consecutiveMinutes = Array.from(time).slice(
              i,
              Number(serviceDuration) + i
            );

            // Verificar si todos los minutos en la secuencia son diferentes de "free"
            isConsecutive = consecutiveMinutes.every(
              (minute) => minute === "free"
            );
            if (isConsecutive) {
              const month = workday.month;
              const dayOfMonth = workday.day;
              // Verificar si ya existe result[month] y asignar un valor en consecuencia
              result[month] = result[month] || {};
              result[month][dayOfMonth] = "se puede agendar";

              setWorkerWithTime((prevState) => ({
                ...prevState,
                [dayOfMonth]: {
                  ...prevState[dayOfMonth],
                  [workday.name]: [time, serviceDuration],
                },
              }));
              noTimeAvailable = false;
              return;
            } else {
              noTimeAvailable = true;
            }
          }
          if (noTimeAvailable) {
            const month = workday.month;
            const dayOfMonth = workday.day;

            // Verificar si ya existe result[month] y asignar un valor en consecuencia
            result[month] = result[month] || {};

            // Asignar el estado de agendado en consecuencia
            result[month][dayOfMonth] = "no se puede agendar";
          }
        }
      }
    });

    setDayIsSelected((prevState) => ({
      ...prevState,
      currentService: selectedService,
    }));
    setDaysForCalendar(result);
  };

  let justWorkerWithTime = {};
  if (dayIsSelected.currentDay) {
    if (workerWithTime[dayIsSelected.currentDay]) {
      justWorkerWithTime = workerWithTime[dayIsSelected.currentDay];
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        paddingTop: "70px",
      }}
    >
      <h1
        style={{
          marginBottom: "80px",
          fontSize: "35px",
        }}
      >
        Selecciona un servicio
      </h1>
      <Grid
        container
        style={{
          display: "flex",
          width: "90%",
          maxWidth: "900px",
        }}
      >
        {arrOfServices.map((service, index) => (
          <Grid
            item
            xs={6}
            md={4}
            style={{
              gap: "10px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
          >
            <div
              style={{
                fontSize: "25px",
              }}
            >
              {service}
            </div>
            <div
              onClick={() => {
                {
                  userIsLogged
                    ? (handleSelectService(service), setToggle(index + 1))
                    : setShowAlert({
                        isOpen: true,
                        message: "Inicia sesíon para reservar",
                        button1: {
                          text: "Login",
                          action: "login",
                        },
                        buttonClose: {
                          text: "Más tarde",
                        },
                      });
                }
              }}
              style={{
                scrollbarGutter: "auto",
                width: "155px",
                height: "155px",
                backgroundColor: "black",
                borderRadius: "100%",
                border: "2px solid black",
                boxShadow: "0px 45px 22px -34px rgba(0,0,0,0.57)",
                overflow: "hidden",
              }}
            >
              <img
                src={arrOfServicesImg[index]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "200px",
                  objectFit: "cover", // Ajusta el contenido de la imagen para cubrir todo el espacio disponible
                }}
              />
            </div>
          </Grid>
        ))}
      </Grid>
      {Object.keys(daysForCalendar).length > 0 && (
        <CustomCalendarTurns
          daysForCalendar={daysForCalendar}
          setDayIsSelected={setDayIsSelected}
          amountOfDays={20}
        />
      )}
      {Object.keys(justWorkerWithTime).length > 1 && (
        <SelectedDayTurns justWorkerWithTime={justWorkerWithTime} />
      )}
      {/* <AlertModal showAlert={showAlert} setShowAlert={setShowAlert} /> */}
      <AlertModal2 showAlert={showAlert} setShowAlert={setShowAlert} />
    </div>
  );
};

export default Turns;
