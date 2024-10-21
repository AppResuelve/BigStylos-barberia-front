import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { LoaderServicesReady } from "../loaders/loaders";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData } = useContext(AuthContext);
  const { turnsCart, setTurnsCart, dayIsSelected, setDayIsSelected } =
    useContext(CartContext);
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

  useEffect(() => {
    if (userData === false) {
      Swal.fire({
        title: "Debes estar loggeado para reservar.",
        confirmButtonText: "Ok",
        icon: "warning",
        reverseButtons: true,
        backdrop: `rgba(0,0,0,0.8)`,
        customClass: {
          container: "custom-swal-container",
          htmlContainer: "custom-swal-body",
          popup: "custom-swal-modal",
          actions: "swal2-actions",
          confirmButton: "custom-confirm-button",
          denyButton: "custom-deny-button",
          icon: "custom-icon-swal",
        },
      }).then(() => {
        navigate("/");
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        setCatServices(response.data);
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
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };

    if (Object.keys(serviceSelected).length > 0) fetchServices();
  }, [serviceSelected]);

  useEffect(() => {
    // Este efecto se ejecuta cuando el componente se desmonta
    return () => {
      setDayIsSelected([]); // Limpieza del estado
      setTurnsCart({});
    };
  }, []);

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

    let navHeight;
    if (isExpanded) {
      const ref = panel === "panel1" ? serviceAccordionRef : workerAccordionRef;

      if (ref.current) {
        navHeight = panel === "panel1" ? 0 : 140; // Altura de tu navegación fija, ajústalo según sea necesario

        // Desplazar a la posición calculada
        window.scrollTo({
          top: navHeight,
          behavior: "smooth",
        });
      }
    } else {
      if (panel === "panel1") {
        navHeight = 140;
        // Desplazar a la posición calculada
        window.scrollTo({
          top: navHeight, // Ajuste según la altura de la navegación y la posición
          behavior: "smooth",
        });
      }
    }
  };

  const handleSelectTime = (btn) => {
    setTurnsCart({
      id: `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`,
      worker: btn.worker,
      ini: btn.ini,
      user: userData.email,
      day: dayIsSelected[0],
      month: dayIsSelected[1],
      service: serviceSelected,
      quantity: 1,
    });
  };
  return (
    <div
      className="container-turns"
      // style={{
      //   marginBottom: turnsCart.length > 0 ? "85px" : "0px", //condicion con el cart
      // }}
    >
      <div className="div-bg-turns"></div>

      <LoaderServicesReady
        servicesReady={Object.keys(catServices).length > 0}
      />
      {Object.keys(catServices).length < 1 ? null : dayIsSelected.length < 1 ? (
        <div className="subcontainer-turns">
          {/* seccion seleccion de servicio */}
          <div
            ref={serviceAccordionRef} // Referencia al acordeón de servicios
            style={{
              zIndex: "2",
              width: "100%",
              height: "100%",
              backgroundColor: "var(--bg-color-hover)", //revisar cuando se cambie el color
              borderRadius: "20px",
              marginBottom: "25px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "var(--text-color)",
                margin: "5px 5px 5px 20px",
              }}
            >
              Seleccione un servicio
            </span>
            <Accordion
              style={{
                borderRadius: "20px",
                padding: "5px",
                boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",
                backgroundColor: "var(--bg-color-secondary)",
              }}
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              {Object.keys(serviceSelected).length > 0 && (
                <AccordionSummary
                  style={{
                    backgroundColor:
                      expanded === "panel1"
                        ? "var( --bg-color-hover)"
                        : "var(--transparent)",
                    borderRadius: "20px",
                    height: "60px",
                  }}
                  expandIcon={
                    <ExpandMoreIcon
                      fontSize="large"
                      sx={{
                        color:
                          expanded === "panel1"
                            ? "var(--text-color)"
                            : "var(--accent-color)",
                      }}
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
                      style={{
                        filter:
                          serviceSelected.img !== ""
                            ? "none"
                            : "var(--filter-invert)",
                      }}
                      alt="service-selected-icon"
                      className="img-service-selected-turns"
                    />
                    <span>{serviceSelected.name}</span>
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
                        backgroundColor: "var(--bg-color)",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid var(--bg-color-medium)",
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
                                    ? "var(--accent-color)"
                                    : "var(--bg-color)",
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
                                  style={{
                                    filter: catServices[category][service].img
                                      ? "none"
                                      : "var(--filter-invert)",
                                  }}
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
              <div
                ref={workerAccordionRef} // Referencia al acordeón de trabajadores
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "var(--bg-color-hover)", //revisar cuando se cambie el color
                  borderRadius: "20px",
                  marginBottom: "25px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    color: "var(--text-color)",
                    margin: "5px 5px 5px 20px",
                  }}
                >
                  Seleccione un profesional
                </span>
                <Accordion
                  style={{
                    padding: "5px",
                    borderRadius: "20px",
                    boxShadow: "0px 5px 10px -5px rgba(0,0,0,0.50)",
                    backgroundColor: "var(--bg-color-secondary)",
                  }}
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    style={{
                      borderRadius: "20px",
                      backgroundColor:
                        expanded === "panel2"
                          ? "var( --bg-color-hover)"
                          : "var(--transparent)",
                      height: "60px",
                    }}
                    expandIcon={
                      <ExpandMoreIcon
                        fontSize="large"
                        sx={{
                          color:
                            expanded === "panel2"
                              ? "var(--text-color)"
                              : "var(--accent-color)",
                        }}
                      />
                    }
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <div className="select-cualquiera-turns">
                      <img
                        src={selectedWorker.image}
                        alt="worker-seleccionado"
                        style={{
                          filter:
                            selectedWorker.name === "cualquiera"
                              ? "var(--filter-invert)"
                              : "none",
                        }}
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
                                    ? "var(--accent-color)"
                                    : "var(--bg-color)",
                              }}
                            >
                              <img
                                src={worker.image}
                                alt={worker.name}
                                style={{
                                  filter:
                                    (selectedWorker.name === worker.name &&
                                      worker.name == "cualquiera") ||
                                    worker.name == "cualquiera"
                                      ? "var(--filter-invert)"
                                      : "none",
                                }}
                              />
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "var(--bg-color-hover)", //revisar cuando se cambie el color
                  borderRadius: "20px",
                  marginBottom:
                    Object.keys(turnsCart).length > 0 &&
                    turnsCart.service.sing != 0
                      ? "260px"
                      : Object.keys(turnsCart).length > 0
                      ? "220px"
                      : "25px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    color: "var(--text-color)",
                    margin: "5px 5px 5px 20px",
                  }}
                >
                  Seleccione un día
                </span>
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
            marginBottom:
              Object.keys(turnsCart).length > 0 && turnsCart.service.sing != 0
                ? "250px"
                : Object.keys(turnsCart).length > 0
                ? "210px"
                : "25px",
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
            <span
              style={{
                marginRight: "15px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >{`${dayIsSelected[0]} de ${obtainMonthName(
              dayIsSelected[1]
            )}`}</span>
          </section>
          {turnsButtons.length > 0 ? (
            <section className="section-turnsbtns-turns">
              <div style={{ marginTop: "5px" }}>
                <span style={{ padding: "15px", fontSize: "18px" }}>
                  Turno mañana
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "10px",
                    gap: "8px",
                  }}
                >
                  {/* turno mañana */}
                  {turnsButtons.length > 0 &&
                    turnsButtons.map((btn, index) => {
                      if (btn.ini >= 720) return;
                      let dayInCart = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (turnsCart.id === uniqueKey) {
                        dayInCart = true;
                      }
                      return (
                        <button
                          key={index}
                          style={{
                            backgroundColor: dayInCart
                              ? "var(--accent-color)"
                              : "var(--color-disponibility)",
                            pointerEvents: dayInCart ? "none" : "",
                          }}
                          className="turnsbtn-turns"
                          onClick={() => handleSelectTime(btn)}
                        >
                          <span>{formatHour(btn.ini)}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
              <hr
                style={{
                  border: "1px solid var(--bg-color-medium)",
                  width: "95%",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              />
              {/* turno tarde */}

              <div style={{ marginTop: "10px" }}>
                <span style={{ padding: "15px", fontSize: "18px" }}>
                  Turno tarde
                </span>

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
                      if (btn.ini < 720 || btn.ini >= 1200) return;
                      let dayInCart = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (turnsCart.id === uniqueKey) {
                        dayInCart = true;
                      }
                      return (
                        <button
                          key={index}
                          style={{
                            backgroundColor: dayInCart
                              ? "var(--accent-color)"
                              : "var(--color-disponibility)",
                            pointerEvents: dayInCart ? "none" : "",
                          }}
                          className="turnsbtn-turns"
                          onClick={() => handleSelectTime(btn)}
                        >
                          <span>{formatHour(btn.ini)}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
              <hr
                style={{
                  border: "1px solid var(--bg-color-medium)",
                  width: "95%",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              />
              {/* turno noche */}
              <div style={{ margin: "10px 0px 0px 0px" }}>
                <span style={{ padding: "15px", fontSize: "18px" }}>
                  Turno noche
                </span>

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
                      if (btn.ini < 1200) return;
                      let dayInCart = false;
                      let uniqueKey = `${dayIsSelected[0]}+${dayIsSelected[1]}+${serviceSelected.name}+${btn.ini}`;
                      if (turnsCart.id === uniqueKey) {
                        dayInCart = true;
                      }
                      return (
                        <button
                          key={index}
                          style={{
                            backgroundColor: dayInCart
                              ? "var(--accent-color)"
                              : "var(--color-disponibility)",
                            pointerEvents: dayInCart ? "none" : "",
                          }}
                          className="turnsbtn-turns"
                          onClick={() => handleSelectTime(btn)}
                        >
                          <span>{formatHour(btn.ini)}</span>
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
