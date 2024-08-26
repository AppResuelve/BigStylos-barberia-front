import { useEffect, useState, useContext } from "react";
import { useMediaQueryHook } from "./useMediaQuery";
import { DarkModeContext } from "../../App";
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

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkerAcordeon = ({ user }) => {
  const {
    darkMode,
    redirectToMyServices,
    setRedirectToMyServices,
    refreshForWhoIsComing,
    setRefreshForWhoIsComing,
    setShowAlert,
  } = useContext(DarkModeContext);
  const [changeNoSaved, setChangeNoSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [workerData, setWorkerData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [pendingServices, setPendingServices] = useState(false);
  const [doCeroServices, setDoCeroServices] = useState(false);
  /* estados locales del componente myServices */
  const [services, setServices] = useState([]);
  const [timeEdit, setTimeEdit] = useState({});

  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    if (timeEdit && Object.keys(timeEdit).length > 0 && services.length > 0) {
      let onePending = false;
      let allZero = true;
      for (const prop in timeEdit) {
        console.log(timeEdit[prop]);
        
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

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const response = await axios.post(`${VITE_BACKEND_URL}/users/byemail`, {
          email: user.email,
        });
        setWorkerData(response.data);
        setTimeEdit(response.data.services);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchWorker();
  }, [refresh]);

  const handleChange = (panel) => (event, isExpanded) => {
    if (changeNoSaved) {
      setShowAlert({
        isOpen: true,
        message: "Tienes cambios sin guardar.",
        type: "warning",
        button1: {
          text: "",
          action: "",
        },
        buttonClose: {
          text: "OK",
        },
      });
    } else {
      setExpanded(isExpanded ? panel : false);
      setRedirectToMyServices(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: sm ? "30px" : "70px",
        width: "95vw",
        maxWidth: xl ? "900px" : "1200px", //cuando la pantalla es mayor a 2000px agrandamos maxWidth (+ full hd )
      }}
    >
      <Box>
        <Accordion
          style={{
            borderRadius: "0px 0px 5px 5px",
            marginBottom: "5px",
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
            backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
          }}
          expanded={
            redirectToMyServices ? false : expanded === "panel1" ? true : false
          }
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel1" && !redirectToMyServices ? "#d6d6d5" : "",
              borderRadius: "2px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: expanded === "panel1" ? "" : "#2196f3" }}
              />
            }
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h2
              style={{
                color:
                  redirectToMyServices && darkMode.on
                    ? "white"
                    : !darkMode.on
                    ? darkMode.dark
                    : expanded === "panel1"
                    ? darkMode.dark
                    : "white",
              }}
            >
              Dias de trabajo
            </h2>
          </AccordionSummary>
          <AccordionDetails>
            {expanded === "panel1" && Object.keys(workerData).length > 0 && (
              <CreateWorkDays
                user={workerData}
                schedule={schedule}
                pendingServices={pendingServices}
                doCeroServices={doCeroServices}
                setRefreshForWhoIsComing={setRefreshForWhoIsComing}
              />
            )}
            {expanded === "panel1" && Object.keys(workerData).length < 1 && (
              <LinearProgress />
            )}
            {services !== 1 && services.length == 0 && (
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
          style={{
            borderRadius: "0px 0px 5px 5px",
            marginBottom: "5px",
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
            backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
          }}
          expanded={expanded === "panel2" || redirectToMyServices}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            sx={{
              backgroundColor:
                expanded === "panel2" || redirectToMyServices ? "#d6d6d5" : "",
              borderRadius: "2px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: expanded === "panel2" ? "" : "#2196f3" }}
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
              <h2
                style={{
                  color: !darkMode.on
                    ? darkMode.dark
                    : expanded === "panel2"
                    ? darkMode.dark
                    : "white",
                }}
              >
                Mis servicios
              </h2>
              {pendingServices  && (
                <h4
                  style={{
                    color: "red",
                  }}
                >
                  Pendiente
                </h4>
              )}
              {services !== 1 && services.length == 0 && (
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
                workerData={workerData}
                refresh={refresh}
                setRefresh={setRefresh}
                services={services}
                timeEdit={timeEdit}
                setTimeEdit={setTimeEdit}
                setChangeNoSaved={setChangeNoSaved}
              />
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            borderRadius: "0px 0px 5px 5px",
            marginBottom: "5px",
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
            backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
          }}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            sx={{
              display: "flex",
              backgroundColor: expanded === "panel3" ? "#d6d6d5" : "",
              borderRadius: "2px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: expanded === "panel3" ? "" : "#2196f3" }}
              />
            }
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <h2
              style={{
                color: !darkMode.on
                  ? darkMode.dark
                  : expanded === "panel3"
                  ? darkMode.dark
                  : "white",
              }}
            >
              Agenda de turnos
            </h2>
          </AccordionSummary>
          <AccordionDetails>
            <WhoIsComingWorker
              user={user}
              refreshForWhoIsComing={refreshForWhoIsComing}
              setRefreshForWhoIsComing={setRefreshForWhoIsComing}
            />
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            borderRadius: "0px 0px 5px 5px",
            marginBottom: "30px",
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
            backgroundColor: !darkMode.on ? darkMode.light : darkMode.dark,
          }}
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            sx={{
              backgroundColor: expanded === "panel4" ? "#d6d6d5" : "",
              borderRadius: "2px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: expanded === "panel4" ? "" : "#2196f3" }}
              />
            }
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <h2
              style={{
                color: !darkMode.on
                  ? darkMode.dark
                  : expanded === "panel4"
                  ? darkMode.dark
                  : "white",
              }}
            >
              Turnos cancelados
            </h2>
          </AccordionSummary>
          <AccordionDetails>
            <CancelledTurnsForWorker user={user} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};
export default WorkerAcordeon;
