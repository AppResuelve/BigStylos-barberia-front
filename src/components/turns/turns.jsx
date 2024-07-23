import React, { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext } from "../../App";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import cualquieraImg from "../../assets/icons/noUser.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import axios from "axios";
import "./turns.css";
import obtainMonthName from "../../functions/obtainMonthName";

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
        <div className="subcontainer-turns">
          {dayIsSelected.length < 1 ? (
            <>
              <div style={{ position: "relative" }}>
                <Accordion
                  ref={serviceAccordionRef} // Referencia al acordeón de servicios
                  style={{
                    zIndex: "20",
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
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {Object.entries(catServices[category]).map(
                            ([service, details], srvIndex) => (
                              <button
                                key={`${category}-${srvIndex}`}
                                value={service}
                                className="btn-services-turns"
                                onClick={handleServiceChange}
                              >
                                {service}
                              </button>
                            )
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
                  }}
                >
                  Seleccione un profesional
                </h2>
                <Accordion
                  ref={workerAccordionRef} // Referencia al acordeón de trabajadores
                  style={{
                    padding: "5px",
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
                        sx={{ color: expanded === "panel2" ? "" : "#2196f3" }}
                      />
                    }
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <div className="select-cualquiera-turns">
                      <img src={selectedWorker.image} alt="" />
                      <span>{selectedWorker.name}</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedWorker.email !== "cualquiera" && (
                      <div
                        className="select-cualquiera-turns"
                        onClick={() => handleSelectWorker()}
                      >
                        <span>cualquiera</span>
                      </div>
                    )}
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
                />
              </div>
            </>
          ) : (
            <section>
              <span>{`${dayIsSelected[0]} de ${obtainMonthName(
                dayIsSelected[1]
              )}`}</span>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Turns;
