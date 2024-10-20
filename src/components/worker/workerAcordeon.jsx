import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateWorkDays from "../createWorkDays/createWorkDays";
import MyServices from "../myServices/myServices";
import CancelledTurnsForWorker from "../cancelledTurnsForWorker/cancelledTurnsForWorker";
import WhoIsComingWorker from "../whoIsComingWorker/whoIsComingWorker";
import { convertToServicesArray } from "../../helpers/convertCategoryService";
import axios from "axios";
import Swal from "sweetalert2";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkerAcordeon = ({ userData }) => {
  const { darkMode } = useContext(ThemeContext);
  const { redirectToMyServices, setRedirectToMyServices } = useContext(
    LoadAndRefreshContext
  );
  const [changeNoSaved, setChangeNoSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [pendingServices, setPendingServices] = useState(false);
  const [doCeroServices, setDoCeroServices] = useState(false);
  const [refreshWhoIsComing, setRefreshWhoIsComing] = useState(false);

  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  /* estados locales del componente myServices */
  const [services, setServices] = useState(null);
  const [timeEdit, setTimeEdit] = useState({});

  // Efecto para inicializar timeEdit con userData.services
  useEffect(() => {
    if (userData && userData.services) {
      setTimeEdit(userData.services);
    }
  }, [userData]);

  useEffect(() => {
    if (
      timeEdit &&
      Object.keys(timeEdit).length > 0 &&
      services !== null &&
      services.length > 0
    ) {
      let onePending = false;
      let allZero = true;
      for (const prop in timeEdit) {
        if (timeEdit[prop].duration === 0) {
          onePending = true;
        } else if (
          timeEdit[prop].duration !== 0 &&
          timeEdit[prop].duration !== null
        ) {
          allZero = false;
        }
      }
      setPendingServices(onePending);
      setDoCeroServices(allZero);
    }
  }, [timeEdit, services]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const arrServices = convertToServicesArray(response.data); //pasamos a array de obj servicio antes de setear
        setServices(arrServices);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        setSchedule(response.data.businessSchedule);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchSchedule();
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    if (changeNoSaved) {
      Swal.fire({
        title: "Tienes cambios sin guardar",
        icon: "warning",
        timer: 3000,
      });
    } else {
      setExpanded(isExpanded ? panel : false);
      setRedirectToMyServices(false);
    }
  };

  return (
    <div
      className="container-adminaccordion"
      style={{ paddingTop: sm ? "30px" : "70px" }}
    >
      <Box>
        <Accordion
          className="container-accordion"
          expanded={
            redirectToMyServices ? false : expanded === "panel1" ? true : false
          }
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel1"
                  ? "var(--bg-color-hover)"
                  : "var(--bg-color-secondary)",
              borderRadius: "15px",
            }}
            expandIcon={
              <ExpandMoreIcon
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
            <h2 style={{ color: "var(--text-color)" }}>Dias de trabajo</h2>
          </AccordionSummary>
          <AccordionDetails>
            {expanded === "panel1" && Object.keys(userData).length > 0 && (
              <CreateWorkDays
                userData={userData}
                schedule={schedule}
                doCeroServices={doCeroServices}
                pendingServices={pendingServices}
                refreshWhoIsComing={refreshWhoIsComing}
                setRefreshWhoIsComing={setRefreshWhoIsComing}
              />
            )}
            {expanded === "panel1" && Object.keys(userData).length < 1 && (
              <LinearProgress />
            )}
            {services !== null && services.length == 0 && (
              <h4
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "red",
                  fontSize: sm ? "" : "20px",
                  letterSpacing: "0.5px",
                }}
              >
                Se necesitan servicios para crear días de trabajo
              </h4>
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          className="container-accordion"
         
          expanded={expanded === "panel2" || redirectToMyServices}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel2"
                  ? "var(--bg-color-hover)"
                  : "var(--bg-color-secondary)",
              borderRadius: "15px",
            }}
            expandIcon={
              <ExpandMoreIcon
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
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h2 style={{ color: "var(--text-color)" }}>Mis servicios</h2>
              {pendingServices && (
                <h4
                  style={{
                    color: "red",
                  }}
                >
                  Pendiente
                </h4>
              )}
              {services !== null && services.length == 0 && (
                <h4
                  style={{
                    color: "red",
                  }}
                >
                  No hay servicios
                </h4>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {(expanded === "panel2" || redirectToMyServices) && (
              <MyServices
                services={services}
                timeEdit={timeEdit}
                setTimeEdit={setTimeEdit}
                changeNoSaved={changeNoSaved}
                setChangeNoSaved={setChangeNoSaved}
                pendingServices={pendingServices}
              />
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          className="container-accordion"
          
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel3"
                  ? "var(--bg-color-hover)"
                  : "var(--bg-color-secondary)",
              borderRadius: "15px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color:
                    expanded === "panel3"
                      ? "var(--text-color)"
                      : "var(--accent-color)",
                }}
              />
            }
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <h2 style={{ color: "var(--text-color)" }}>Agenda de turnos</h2>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <WhoIsComingWorker
              userData={userData}
              refreshWhoIsComing={refreshWhoIsComing}
              setRefreshWhoIsComing={setRefreshWhoIsComing}
            />
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          className="container-accordion"
        
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel4"
                  ? "var(--bg-color-hover)"
                  : "var(--bg-color-secondary)",
              borderRadius: "15px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color:
                    expanded === "panel4"
                      ? "var(--text-color)"
                      : "var(--accent-color)",
                }}
              />
            }
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <h2 style={{ color: "var(--text-color)" }}>Turnos cancelados</h2>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <CancelledTurnsForWorker userData={userData} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};
export default WorkerAcordeon;
