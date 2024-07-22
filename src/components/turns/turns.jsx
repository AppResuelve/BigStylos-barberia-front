import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./turns.css";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [catServices, setCatServices] = useState({});
  const [serviceSelected, setServiceSelected] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setselectedWorker] = useState({});

  const [days, setDays] = useState({});
  const [dayIsSelected, setDayIsSelected] = useState([]);

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
        setWorkers(workers);
        setDays(result);
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
    setselectedWorker(worker);
    setExpanded(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {serviceSelected === "" && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: "10",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            boxShadow: "0px 0px 10px 10px rgb(0,0,0,0.5)",
          }}
        ></div>
      )}
      <div className="container-turns">
        <div className="subcontainer-turns">
          <div style={{ position: "relative" }}>
            {serviceSelected === "" && (
              <div className="element">
                <div className="element2"></div>
              </div>
            )}
            <Accordion
              style={{
                borderRadius: "40px",
                zIndex: "20",
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
          <div
            style={{
              position: "relative",
            }}
          >
            <Accordion
              style={{
                borderRadius: "40px",
                padding: "5px",
                marginBottom: "30px",
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
                }}
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: expanded === "panel2" ? "" : "#2196f3" }}
                  />
                }
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                {Object.keys(selectedWorker).length > 0 ? (
                  <div className="select-workers-turns">
                    <img src={selectedWorker.image} alt="" />
                    <span>{selectedWorker.name}</span>
                  </div>
                ) : (
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
                )}
              </AccordionSummary>
              <AccordionDetails>
                {workers.length > 0 &&
                  workers.map((worker, index) => {
                    return (
                      <div
                        key={worker.id + index}
                        className="select-workers-turns"
                        onClick={() => handleSelectWorker(worker)}
                      >
                        <img src={worker.image} alt="" />
                        <span>{worker.name}</span>
                      </div>
                    );
                  })}
              </AccordionDetails>
            </Accordion>
            <CustomCalendarTurns
              days={days}
              dayIsSelected={dayIsSelected}
              setDayIsSelected={setDayIsSelected}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Turns;
