import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import cualquieraImg from "../../assets/icons/user.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import obtainMonthName from "../../functions/obtainMonthName";
import leftArrowBack from "../../assets/icons/left-arrow.png";
import hasSingIcon from "../../assets/icons/dollar.png";
import servicesIcon from "../../assets/icons/review.png";
import { TurnsButtonsSkeleton } from "../loaders/skeletons";
import { calculateSing } from "../../helpers/calculateSing";
import formatHour from "../../functions/formatHour";
import Swal from "sweetalert2";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import CartContext from "../../context/CartContext";
import axios from "axios";
import "./turns.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData } = useContext(AuthContext);
  const {
    turnsCart,
    setTurnsCart,
    auxCart,
    setAuxCart,
    dayIsSelected,
    setDayIsSelected,
  } = useContext(CartContext);
  const { sm } = useMediaQueryHook();
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
  const [turnsButtons, setTurnsButtons] = useState([]);
  const navigate = useNavigate();
  // Referencias para los acordeones
  const serviceAccordionRef = useRef(null);
  const workerAccordionRef = useRef(null);

  console.log(days, "days---------");

  useEffect(() => {
    if (userData === false) {
      Swal.fire({
        title: "Debes estar loggeado para reservar.",
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

  useEffect(() => {
    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      setDayIsSelected([]);
    };
  }, []); // El array vacío asegura que este useEffect solo se ejecute una vez, en el desmontaje

  const handleServiceChange = (serviceName, service) => {
    if (serviceSelected.name !== serviceName) {
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
    }
    setExpanded(false);
  };

  const handleSelectWorker = (worker) => {
    if (selectedWorker.email !== worker.email) {
      setSelectedWorker(worker);
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
    }
    setExpanded(false);
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
    console.log(serviceSelected);

    setAuxCart((prevState) => {
      if (Object.keys(prevState).length >= 3) return prevState;

      let copyState = { ...prevState };

      // Crear una clave única usando los valores seleccionados
      const uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
      // Añadir o actualizar la entrada en el objeto de estado
      copyState[uniqueKey] = btn.worker;

      return copyState;
    });
    setTurnsCart((prevState) => {
      // Limitamos a 3 turnos por carrito
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
  };

  return (
    <div
      className="container-turns"
      style={{
        marginBottom: turnsCart.length > 0 ? "85px" : "0px", //condicion con el cart
      }}
    >
      {dayIsSelected.length < 1 ? (
        <div className="subcontainer-turns">
          {/* seccion seleccion de servicio */}
          <div
            style={{
              position: "relative",
              zIndex: "2",
              width: "100%",
              height: "100%",
              backgroundColor: "white", //revisar cuando se cambie el color
              borderRadius: "20px",

              marginBottom: "25px",
            }}
          >
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
                borderRadius: "20px",
                padding: "5px",
                boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",
                backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
              }}
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              {Object.keys(serviceSelected).length > 0 && (
                <AccordionSummary
                  style={{
                    backgroundColor: expanded === "panel1" ? "#d6d6d5" : "",
                    borderRadius: "20px",
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        serviceSelected.img !== ""
                          ? serviceSelected.img
                          : servicesIcon
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
                </AccordionSummary>
              )}
              <AccordionDetails sx={{ p: 1 }}>
                {Object.keys(catServices).map((category, index) => (
                  <section
                    key={index}
                    style={{ marginTop: index === 0 ? "0px" : "15px" }}
                  >
                    <span
                      style={{
                        width: "100%",
                        height: "38px",
                        backgroundColor: "lightgray",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        marginTop:
                          Object.keys(serviceSelected).length > 0
                            ? "10px"
                            : "0px",
                        borderRadius: "15px",
                        justifyContent: "center",
                      }}
                    >
                      {category}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {Object.entries(catServices[category]).map(
                        ([service, details], srvIndex) => {
                          return (
                            <div
                              key={`${category}-${srvIndex}`}
                              className="btn-services-turns"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor:
                                  serviceSelected.name === service
                                    ? "#2688ff"
                                    : "rgba(255, 255, 255, 0.48)",
                                color:
                                  serviceSelected.name === service
                                    ? "white"
                                    : "black",
                              }}
                              onClick={() =>
                                handleServiceChange(
                                  service,
                                  catServices[category][service]
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={
                                    catServices[category][service].img
                                      ? catServices[category][service].img
                                      : servicesIcon
                                  }
                                  alt="im-service"
                                  className="img-service-turns"
                                />
                                <span>{service}</span>
                              </div>
                              {catServices[category][service].price != 0 && (
                                <hr className="hr-selectservice" />
                              )}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  {catServices[category][service].price != 0
                                    ? `$${catServices[category][service].price}`
                                    : ""}
                                </span>
                                {catServices[category][service].sing != 0 && (
                                  <div className="div-span-imgsing-turns">
                                    <span>Requiere seña</span>
                                    <img
                                      src={hasSingIcon}
                                      alt="requiere seña"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
          {Object.keys(serviceSelected).length > 0 && (
            <>
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
                    borderRadius: "20px",
                    boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",

                    backgroundColor: !darkMode.on
                      ? darkMode.light
                      : darkMode.dark,
                  }}
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    style={{
                      borderRadius: "20px",
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
                      <img
                        src={selectedWorker.image}
                        alt="worker-seleccionado"
                      />
                      <span>
                        {selectedWorker.name === "cualquiera"
                          ? "Sin preferencia"
                          : selectedWorker.name}
                      </span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1 }}>
                    <div className="container-workers-turns">
                      {workers.length > 0 &&
                        workers.map((worker, index) => {
                          return (
                            <div
                              key={index}
                              className="select-workers-turns"
                              onClick={() => handleSelectWorker(worker)}
                              style={{
                                width: sm ? "100%" : "fit-content",
                                backgroundColor:
                                  selectedWorker.email === worker.email
                                    ? "#2688ff"
                                    : "rgba(255, 255, 255, 0.48)",
                                color:
                                  selectedWorker.email === worker.email
                                    ? "white"
                                    : "black",
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
              </div>
              <div>
                <CustomCalendarTurns
                  days={workerDays}
                  dayIsSelected={dayIsSelected}
                  setDayIsSelected={setDayIsSelected}
                  selectedWorker={selectedWorker}
                  serviceSelected={serviceSelected}
                  setTurnsButtons={setTurnsButtons}
                />
              </div>
            </>
          )}
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
                      let disabled = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (auxCart[uniqueKey]) {
                        dayInCart = true;
                      }
                      // if(auxCart[])
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
            <TurnsButtonsSkeleton />
          )}
        </div>
      )}
    </div>
  );
};

export default Turns;
