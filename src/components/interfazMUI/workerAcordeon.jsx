import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import CreateWorkDays from "../createWorkDays/createWorkDays";
import axios from "axios";
import { useMediaQueryHook } from "./useMediaQuery";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WorkerAcordeon = ({ user }) => {
  const [expanded, setExpanded] = useState(false);
  const [schedule, setSchedule] = useState({});
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule`);
        const { data } = response;
        setSchedule(data);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
console.log(xl, sm);
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
      <Box style={{ position: "relative" }}>
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
            <h2>Dias de trabajo</h2>
          </AccordionSummary>
          <AccordionDetails>
            <CreateWorkDays user={user} schedule={schedule} />
          </AccordionDetails>
        </Accordion>
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
            <h2>bla bla</h2>
          </AccordionSummary>
          <AccordionDetails>{/* dfsdfsdfffsdf */}</AccordionDetails>
        </Accordion>
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
            <h2>bla bla</h2>
          </AccordionSummary>
          <AccordionDetails>{/* dfsdfsdfffsdf */}</AccordionDetails>
        </Accordion>
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
            <h2 sx={{ width: "33%", flexShrink: 0 }}>Otro</h2>
          </AccordionSummary>
          <AccordionDetails>{/* dfsdfsdfffsdf */}</AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};
export default WorkerAcordeon;
