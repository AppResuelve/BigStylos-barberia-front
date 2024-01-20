import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Box, LinearProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Services from "../services/services";
import OpeningAndClosing from "../openingAndClosing/openingAndClosing";
import WorkDays from "../workDays/workDays";
import Users from "../users/users";
import PlannedClosure from "../plannedClosure/plannedClosure";
import axios from "axios";
import { useMediaQueryHook } from "./useMediaQuery";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminAcordeon = () => {
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [remaining, setRemaining] = useState(false);
  const [loading, setLoading] = useState(true);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        setSchedule(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, [refresh]);
  useEffect(() => {
    let aux = false;
    for (const index in schedule) {
      const { open, close } = schedule[index];
      if (open === 0 && close === 1440) {
        aux = true;
      } else {
        aux = false;
      }
      setRemaining(aux);
    }
  }, [schedule]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: sm ? "30px" : "70px",
        width: "95vw",
        maxWidth: "900px", //revisar maxWidth
      }}
    >
      <Box style={{ /* position: "relative" */ }}>
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            sx={{
              backgroundColor: expanded === "panel1" ? "#d6d6d5" : "",
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
            <h2>Servicios</h2>
          </AccordionSummary>
          <AccordionDetails>
            <Services />
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            sx={{
              backgroundColor: expanded === "panel2" ? "#d6d6d5" : "",
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
            <h2>Dias laborales</h2>
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(schedule).length > 0 && !loading ? (
              <WorkDays
                schedule={schedule}
                setSchedule={setSchedule}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ) : (
              <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            sx={{
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
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h2>Apertura y cierre</h2>
              {remaining && (
                <h4
                  style={{
                    color: "red",
                  }}
                >
                  (Pendiente)
                </h4>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(schedule).length > 0 && !loading ? (
              <OpeningAndClosing
                schedule={schedule}
                setSchedule={setSchedule}
                refresh={refresh}
                setRefresh={setRefresh}
                setRemaining={setRemaining}
              />
            ) : (
              <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
          }}
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary
            sx={{
              backgroundColor: expanded === "panel5" ? "#d6d6d5" : "",
              borderRadius: "2px",
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: expanded === "panel5" ? "" : "#2196f3" }}
              />
            }
            aria-controls="panel5bh-content"
            id="panel5bh-header"
          >
            <h2 sx={{ width: "33%", flexShrink: 0 }}>Cierre programado</h2>
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(schedule).length > 0 && !loading ? (
              <PlannedClosure
                schedule={schedule}
                setSchedule={setSchedule}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ) : (
              <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
            )}
          </AccordionDetails>
        </Accordion>
        {/*  //------------------// */}
        <Accordion
          style={{
            marginBottom: "30px",
            boxShadow: "0px 25px 25px -10px rgba(0,0,0,0.57)",
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
            <h2>Usuarios</h2>
          </AccordionSummary>
          <AccordionDetails>
            <Users />
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};
export default AdminAcordeon;
