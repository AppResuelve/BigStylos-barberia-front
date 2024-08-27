import React, { useEffect, useState, useContext, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import cualquieraImg from "../../assets/icons/user.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import obtainMonthName from "../../functions/obtainMonthName";
import leftArrowBack from "../../assets/icons/left-arrow.png";
import servicesIcon from "../../assets/icons/review.png";
import { turnsButtonsSkeleton } from "../skeletons/skeletons";
import { calculateSing } from "../../helpers/calculateSing";
import formatHour from "../../functions/formatHour";
import "./turns.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ setTurnsCart, auxCart, setAuxCart }) => {
  const { darkMode } = useContext(ThemeContext);
  const { userData, googleLogin } = useContext(AuthContext);
  const [catServices, setCatServices] = useState({});
  const [serviceSelected, setServiceSelected] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState({
    email: "cualquiera",
    name: "cualquiera",
    image: cualquieraImg,
  });
  const [workerDays, setWorkerDays] = useState({});
  const [days, setDays] = useState({});
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [turnsButtons, setTurnsButtons] = useState([]);
  const navigate = useNavigate();
  // Referencias para los acordeones
  const serviceAccordionRef = useRef(null);
  const workerAccordionRef = useRef(null);

  useEffect(() => {
    if (userData === false) {
      Swal.fire({
        title: "Debes estar loggeado para reservar",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/");
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const { data } = response;
        setCatServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byservices`,
          { servicesForTurns: serviceSelected.name }
        );
        const { workers, result } = response.data;
        workers.unshift({
          email: "cualquiera",
          name: "cualquiera",
          image: cualquieraImg,
        });
        setWorkers(workers);
        setDays(result);
        setWorkerDays(result);
        setSelectedWorker({
          email: "cualquiera",
          name: "cualquiera",
          image: cualquieraImg,
        });
        // setWorkerDays(JSON.parse(JSON.stringify(result)));
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };

    if (Object.keys(serviceSelected).length > 0) fetchServices();
  }, [serviceSelected]);
  console.log(userData);

  const handleServiceChange = (serviceName, service) => {
    let singCalculated;
    if (service.sing != 0 && service.type === "%") {
      singCalculated = calculateSing(service.price, service.sing);
      setServiceSelected({
        name: serviceName,
        img: service.img,
        price: service.price,
        sing: singCalculated,
      });
    } else {
      setServiceSelected({
        name: serviceName,
        img: service.img,
        price: service.price,
        sing: service.sing,
      });
    }
    setExpanded(false);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    setExpanded(false);
    if (worker.email === "cualquiera") {
      setWorkerDays(days);
    } else {
      // Filtra los días que coinciden con el email del trabajador seleccionado
      const filteredDays = {};
      Object.keys(days).forEach((month) => {
        filteredDays[month] = {};
        Object.keys(days[month]).forEach((day) => {
          if (days[month][day][worker.email]) {
            filteredDays[month][day] = days[month][day][worker.email];
          }
        });
      });
      setWorkerDays(filteredDays);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      // Desplazar el scroll hasta el acordeón correspondiente y tener en cuenta la altura de la navegación
      if (panel === "panel1" && serviceAccordionRef.current) {
        serviceAccordionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.scrollBy(0, -60); // Ajustar el scroll por la altura de la navegación
      } else if (panel === "panel2" && workerAccordionRef.current) {
        workerAccordionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.scrollBy(0, -60); // Ajustar el scroll por la altura de la navegación
      }
    }
  };

  const handleSelectTime = (btn) => {
    setTurnsCart((prevState) => {
      // Si ya hay 3 elementos, no hacer nada
      if (prevState.length >= 3) return prevState;
      let copyState = [...prevState];
      copyState.push({
        id: `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`,
        worker: btn.worker,
        ini: btn.ini,
        user: userData.email,
        day: dayIsSelected[0],
        month: dayIsSelected[1],
        service: serviceSelected,
        quantity: 1,
      });
      return copyState;
    });
    setAuxCart((prevState) => {
      if (Object.keys(prevState).length >= 3) return prevState;

      let copyState = { ...prevState };
      // Crear una clave única usando los valores seleccionados
      const uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
      // Añadir o actualizar la entrada en el objeto de estado
      copyState[uniqueKey] = btn.worker;

      return copyState;
    });
  };

  return (
    <div className="container-turns">
      {dayIsSelected.length < 1 ? (
        <div className="subcontainer-turns">
          <div style={{ position: "relative" }}>
            <h2
              style={{
                color: !darkMode.on
                  ? darkMode.dark
                  : expanded === "panel2"
                  ? darkMode.dark
                  : "white",
                marginLeft: "20px",
              }}
            >
              Seleccione un servicio
            </h2>
            <Accordion
              ref={serviceAccordionRef} // Referencia al acordeón de servicios
              style={{
                zIndex: "20",
                borderRadius: "36px",
                padding: "5px",
                marginBottom: "30px",
                boxShadow: "0px 15px 25px -10px rgba(0,0,0,0.57)",
                backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
              }}
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: expanded === "panel1" ? "#d6d6d5" : "",
                  borderRadius: "40px",
                  height: "60px",
                }}
                expandIcon={
                  <ExpandMoreIcon
                    fontSize="large"
                    sx={{ color: expanded === "panel1" ? "" : "#2196f3" }}
                  />
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                {Object.keys(serviceSelected).length > 0 ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        serviceSelected.img ? serviceSelected.img : servicesIcon
                      }
                      alt="service-selected-icon"
                      className="img-service-selected-turns"
                    />
                    <span
                      style={{
                        color: !darkMode.on
                          ? darkMode.dark
                          : expanded === "panel1"
                          ? darkMode.dark
                          : "white",
                      }}
                    >
                      {serviceSelected.name}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      color: !darkMode.on
                        ? darkMode.dark
                        : expanded === "panel1"
                        ? darkMode.dark
                        : "white",
                      fontWeight: "bold",
                      fontSize: "20px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={servicesIcon}
                      alt="services-icon"
                      style={{
                        width: "40px",
                        marginRight: "15px",
                      }}
                    />
                    <span>Servicios</span>
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails>
                {Object.keys(catServices).map((category, index) => (
                  <section key={index}>
                    <span
                      style={{
                        padding: "5px",
                        backgroundColor: "lightgray",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        marginTop: "10px",
                        borderRadius: "40px",
                        justifyContent: "center",
                      }}
                    >
                      {category}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {Object.entries(catServices[category]).map(
                        ([service, details], srvIndex) => {
                          return (
                            <button
                              key={`${category}-${srvIndex}`}
                              className="btn-services-turns"
                              style={{
                                backgroundColor:
                                  serviceSelected.name === service
                                    ? "#2688ff"
                                    : "rgba(255, 255, 255, 0.48)",
                                color:
                                  serviceSelected.name === service
                                    ? "white"
                                    : "black",
                                pointerEvents:
                                  serviceSelected.name === service
                                    ? "none"
                                    : "",
                              }}
                              onClick={() =>
                                handleServiceChange(
                                  service,
                                  catServices[category][service]
                                )
                              }
                            >
                              <img
                                src={catServices[category][service].img}
                                alt="im-service"
                                className="img-service-turns"
                              />
                              <span>{service}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </section>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
            <h2
              style={{
                color: !darkMode.on
                  ? darkMode.dark
                  : expanded === "panel2"
                  ? darkMode.dark
                  : "white",
                marginLeft: "20px",
              }}
            >
              Seleccione un profesional
            </h2>
            <Accordion
              ref={workerAccordionRef} // Referencia al acordeón de trabajadores
              style={{
                padding: "5px",
                borderRadius: "36px",
                boxShadow: "0px 15px 25px -10px rgba(0,0,0,0.57)",
                backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
              }}
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                sx={{
                  borderRadius: "40px",
                  backgroundColor: expanded === "panel2" ? "#d6d6d5" : "",
                  height: "60px",
                }}
                expandIcon={
                  <ExpandMoreIcon
                    fontSize="large"
                    sx={{ color: expanded === "panel2" ? "" : "#2196f3" }}
                  />
                }
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div className="select-cualquiera-turns">
                  <img src={selectedWorker.image} alt="worker-seleccionado" />
                  <span>
                    {selectedWorker.name === "cualquiera"
                      ? "Sin preferencia"
                      : selectedWorker.name}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="container-workers-turns">
                  {workers.length > 0 &&
                    workers.map((worker, index) => {
                      return (
                        <div
                          key={index}
                          className="select-workers-turns"
                          onClick={() => handleSelectWorker(worker)}
                          style={{
                            backgroundColor:
                              selectedWorker.email === worker.email
                                ? "#2688ff"
                                : "rgba(255, 255, 255, 0.48)",
                            color:
                              selectedWorker.email === worker.email
                                ? "white"
                                : "black",
                            pointerEvents:
                              selectedWorker.email === worker.email
                                ? "none"
                                : "",
                          }}
                        >
                          <img src={worker.image} alt={worker.name} />
                          <span>
                            {worker.name === "cualquiera"
                              ? "Sin preferencia"
                              : worker.name}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </AccordionDetails>
            </Accordion>
            <CustomCalendarTurns
              days={workerDays}
              dayIsSelected={dayIsSelected}
              setDayIsSelected={setDayIsSelected}
              selectedWorker={selectedWorker}
              serviceSelected={serviceSelected}
              setTurnsButtons={setTurnsButtons}
            />
          </div>
        </div>
      ) : (
        <div
          className="subcontainer-selectedday-turns"
          style={{
            backgroundColor: "lightgray",
          }}
        >
          <section className="section-btnback-dayselected">
            <button
              className="btn-img-back-turns"
              onClick={() => setDayIsSelected([])}
            >
              <img src={leftArrowBack} alt="atrás" />
              <span>Descartar el día</span>
            </button>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>{`${
              dayIsSelected[0]
            } de ${obtainMonthName(dayIsSelected[1])}`}</span>
          </section>
          {turnsButtons.length > 0 ? (
            <section className="section-turnsbtns-turns">
              <div style={{ marginBottom: "35px" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "10px",
                    gap: "8px",
                  }}
                >
                  {turnsButtons.length > 0 &&
                    turnsButtons.map((btn, index) => {
                      if (btn.ini >= 720) return;
                      let dayInCart = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (auxCart[uniqueKey]) {
                        dayInCart = true;
                      }
                      return (
                        <button
                          key={index}
                          style={{
                            backgroundColor: dayInCart ? "#2688ff" : "",
                            color: dayInCart ? "white" : "",
                            pointerEvents: dayInCart ? "none" : "",
                          }}
                          className="turnsbtn-turns"
                          onClick={() => handleSelectTime(btn)}
                        >
                          {formatHour(btn.ini)}
                        </button>
                      );
                    })}
                </div>
              </div>
              <hr
                style={{
                  border: "1px solid #d8d8d8",
                  width: "100%",
                  borderRadius: "10px",
                }}
              />
              <div style={{ margin: "35px 0px 35px 0px" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "10px",
                    gap: "8px",
                  }}
                >
                  {turnsButtons.length > 0 &&
                    turnsButtons.map((btn, index) => {
                      if (btn.ini < 720) return;
                      let dayInCart = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (auxCart[uniqueKey]) {
                        dayInCart = true;
                      }
                      return (
                        <button
                          key={index}
                          style={{
                            backgroundColor: dayInCart ? "#2688ff" : "",
                            color: dayInCart ? "white" : "",
                            pointerEvents: dayInCart ? "none" : "",
                          }}
                          className="turnsbtn-turns"
                          onClick={() => handleSelectTime(btn)}
                        >
                          {formatHour(btn.ini)}
                        </button>
                      );
                    })}
                </div>
              </div>
            </section>
          ) : (
            <turnsButtonsSkeleton />
          )}
        </div>
      )}
    </div>
  );
};

export default Turns;
