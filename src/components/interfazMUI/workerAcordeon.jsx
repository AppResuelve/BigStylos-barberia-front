import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
import CreateWorkDays from "../createWorkDays/createWorkDays";
import axios from "axios";
import { useMediaQueryHook } from "./useMediaQuery";
import MyServices from "../myServices/myServices";
import CancelledTurnsForWorker from "../cancelledTurnsForWorker/cancelledTurnsForWorker";
import WhoIsComingWorker from "../whoIsComingWorker/whoIsComingWorker";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkerAcordeon = ({ user }) => {
  const {
    darkMode,
    redirectToMyServices,
    setRedirectToMyServices,
    refreshForWhoIsComing,
    setRefreshForWhoIsComing,
  } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [workerData, setWorkerData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [pendingServices, setPendingServices] = useState(false);
  const [doCeroServices, setDoCeroServices] = useState(false);
  /* estados locales del componente myServices */
  const [services, setServices] = useState(1);
  const [serviceStatus, setServiceStatus] = useState({});
  const [timeEdit, setTimeEdit] = useState({});
  const [showEdit, setShowEdit] = useState(false);

  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    setTimeEdit(workerData.services);
  }, [workerData]);

  useEffect(() => {
    if (timeEdit && Object.keys(timeEdit).length > 0) {
      if (services && services.length > 0) {
        let aux = false;
        let secondaryAux = false;

        for (const prop in timeEdit) {
          if (services.some((serviceArr) => serviceArr[0] === prop)) {
            if (timeEdit[prop].duration === null) {
              aux = true;
              setPendingServices(aux);
              return;
            } else if (timeEdit[prop].duration === 0) {
              secondaryAux = true;

              setDoCeroServices(secondaryAux);
              return;
            } else {
              aux = false;
              secondaryAux = false;
            }
            setPendingServices(aux);
            setDoCeroServices(secondaryAux);
          }
        }
      }
    }
  }, [timeEdit, services]);

  useEffect(() => {
    let objNewServicies = {};
    if (services && services.length > 0) {
      for (const prop in workerData.services) {
        if (services.some((serviceArr) => serviceArr[0] === prop)) {
          if (workerData.services[prop].duration === null) {
            objNewServicies[prop] = true;
          } else if (workerData.services[prop].duration === 0) {
            objNewServicies[prop] = false;
          } else {
            objNewServicies[prop] = true;
          }
        }
      }
    }
    if (!showEdit) {
      setServiceStatus(objNewServicies);
    }
  }, [services, workerData, showEdit]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const { data } = response;
        setServices(data);
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
        const { data } = response;
        setSchedule(data.businessSchedule);
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
        const { data } = response;
        setWorkerData(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchWorker();
  }, [refresh]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setRedirectToMyServices(false);
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
            {expanded === "panel1" &&
              Object.keys(workerData).length > 0 &&
              services.length > 0 && (
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
              {pendingServices && (
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
                workerData={workerData.services}
                email={workerData.email}
                refresh={refresh}
                setRefresh={setRefresh}
                services={services}
                serviceStatus={serviceStatus}
                setServiceStatus={setServiceStatus}
                timeEdit={timeEdit}
                setTimeEdit={setTimeEdit}
                showEdit={showEdit}
                setShowEdit={setShowEdit}
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
