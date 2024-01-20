import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button, Grid } from "@mui/material";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ user }) => {
  const [days, setDays] = useState([]);
  const [services, setServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("");
  const [showTurns, setShowTurns] = useState([]);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  useEffect(() => {
    setDayIsSelected([]);
  }, [serviceSelected]);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byservices`,
          { servicesForTurns: serviceSelected }
        );
        const { data } = response;
        setDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        /* alert("Error al obtener los dias"); */
      }
    };
    if (serviceSelected.length > 0) {
      fetchDays();
    }
  }, [serviceSelected]);

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

  const handleSelectService = (element) => {
    setServiceSelected(element);
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "70px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: sm ? "30px" : "70px",
          width: "95vw",
          maxWidth: "900px", //revisar maxWidth
          // backgroundColor: "red",
        }}
      >
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            // color: darkMode ? "white" : "#28292c",
          }}
        >
          Selecciona un servicio
        </h1>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "18px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              maxHeight: "300px",
              overflow: "scroll",
              width: "100%",
            }}
          >
            {services.map((element, index) => (
              <Box sx={{ margin: "1px" }} key={index}>
                <Button
                  variant={
                    element == serviceSelected ? "contained" : "outlined"
                  }
                  sx={{
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    height: "35px",
                    backgroundColor:
                      element == serviceSelected ? "" : "#e8e8e8",
                  }}
                  key={index}
                  style={{}}
                  onClick={() => handleSelectService(element)}
                >
                  {element}
                </Button>
              </Box>
            ))}
          </Box>
          <Box sx={{ backgroundColor: "blue", marginTop: "20px" }}>
            {serviceSelected.length > 0 && (
              <CustomCalendarTurns
                sm={sm}
                amountOfDays={25}
                dayIsSelected={dayIsSelected}
                setDayIsSelected={setDayIsSelected}
                serviceSelected={serviceSelected}
                days={days}
              />
            )}
          </Box>
        </Box>
        {dayIsSelected.length > 0 && (
          <ShowTurns
            dayIsSelected={dayIsSelected}
            serviceSelected={serviceSelected}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default Turns;
