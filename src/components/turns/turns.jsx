import React, { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext } from "../../App";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import cualquieraImg from "../../assets/icons/noUser.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import obtainMonthName from "../../functions/obtainMonthName";
import leftArrowBack from "../../assets/icons/left-arrow.png";
import { TurnsButtonsSkeleton } from "../skeletons/skeletons";
import formatHour from "../../functions/formatHour";
import "./turns.css";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [catServices, setCatServices] = useState({});
  const [serviceSelected, setServiceSelected] = useState("");
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
  const [turnsButtons, setTurnsButtons] = useState([
    1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 11, 1, 1, 1,
  ]);
  // Referencias para los acordeones
  const serviceAccordionRef = useRef(null);
  const workerAccordionRef = useRef(null);

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
          { servicesForTurns: serviceSelected }
        );
        const { workers, result } = response.data;
        console.log(response.data);
        workers.push({
          email: "cualquiera",
          name: "cualquiera",
          image: cualquieraImg,
        });
        setWorkers(workers);
        setDays(result);
        setWorkerDays(result);
        // setWorkerDays(JSON.parse(JSON.stringify(result)));
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };

    if (serviceSelected !== "") fetchServices();
  }, [serviceSelected]);

  const handleServiceChange = (e) => {
    setServiceSelected(e.target.value);
    setExpanded(false);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    setExpanded(false);
    console.log(worker);
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

  return (
    <>
      <div className="container-turns">
        {dayIsSelected.length < 1 ? (
          <div className="subcontainer-turns">
            <div style={{ position: "relative" }}>
              <Accordion
                ref={serviceAccordionRef} // Referencia al acordeón de servicios
                style={{
                  zIndex: "20",
                  borderRadius: "40px",
                  padding: "5px",
                  marginBottom: "30px",
                  boxShadow: "0px 15px 25px -10px rgba(0,0,0,0.57)",
                  backgroundColor: !darkMode.on
                    ? darkMode.light
                    : darkMode.dark,
                }}
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  sx={{
                    backgroundColor: expanded === "panel1" ? "#d6d6d5" : "",
                    borderRadius: "40px",
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
                  {serviceSelected !== "" ? (
                    <h2
                      style={{
                        color: !darkMode.on
                          ? darkMode.dark
                          : expanded === "panel1"
                          ? darkMode.dark
                          : "white",
                      }}
                    >
                      {serviceSelected}
                    </h2>
                  ) : (
                    <h2
                      style={{
                        color: !darkMode.on
                          ? darkMode.dark
                          : expanded === "panel1"
                          ? darkMode.dark
                          : "white",
                      }}
                    >
                      Seleccione un servicio
                    </h2>
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
                        value={category}
                        disabled
                      >
                        {category}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {Object.entries(catServices[category]).map(
                          ([service, details], srvIndex) => {
                            return (
                              <button
                                key={`${category}-${srvIndex}`}
                                value={service}
                                className="btn-services-turns"
                                style={{
                                  backgroundColor:
                                    serviceSelected === service
                                      ? "#2688ff"
                                      : "rgba(255, 255, 255, 0.48)",
                                  color:
                                    serviceSelected === service
                                      ? "white"
                                      : "black",
                                }}
                                onClick={handleServiceChange}
                              >
                                {service}
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
                Seleccione un profesional
              </h2>
              <Accordion
                ref={workerAccordionRef} // Referencia al acordeón de trabajadores
                style={{
                  padding: "5px",
                  borderRadius: "40px",
                  marginBottom: "30px",
                  boxShadow: "0px 15px 25px -10px rgba(0,0,0,0.57)",
                  backgroundColor: !darkMode.on
                    ? darkMode.light
                    : darkMode.dark,
                }}
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  sx={{
                    borderRadius: "40px",
                    backgroundColor: expanded === "panel2" ? "#d6d6d5" : "",
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
                    <img src={selectedWorker.image} alt="" />
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
                        if (selectedWorker.email === worker.email) return;
                        return (
                          <div
                            key={index}
                            className="select-workers-turns"
                            onClick={() => handleSelectWorker(worker)}
                          >
                            <img src={worker.image} alt={worker.name} />
                            <span>{worker.name}</span>
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
            {turnsButtons.length > 1 ? (
              <section>
                <div style={{ marginBottom: "35px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      margin: "10px",
                      gap: "5px",
                    }}
                  >
                    {turnsButtons.map((btn, index) => {
                      if (btn.ini >= 720) return;
                      return (
                        <React.Fragment key={index}>
                          <button
                            style={{
                              width: "70px",
                              height: "40px",
                              borderRadius: "8px",
                            }}
                          >
                            {formatHour(btn.ini)}
                          </button>
                        </React.Fragment>
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
                      gap: "5px",
                    }}
                  >
                    {turnsButtons.map((btn, index) => {
                      if (btn.ini < 720) return;
                      return (
                        <React.Fragment key={index}>
                          <button
                            style={{
                              width: "70px",
                              height: "40px",
                              borderRadius: "8px",
                            }}
                          >
                            {formatHour(btn.ini)}
                          </button>
                        </React.Fragment>
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
    </>
  );
};

export default Turns;
