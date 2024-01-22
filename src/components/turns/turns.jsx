import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button } from "@mui/material";
import calendar from "../../assets/images/calendar2.png";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ user }) => {
  const [days, setDays] = useState([]);
  const [services, setServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("");
  const [showTurns, setShowTurns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: sm ? "70px" : "100px",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "95%",
          maxWidth: "900px", //revisar maxWidth
        }}
      >
        <Box sx={{ height: "12vh" }}>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              // color: darkMode ? "white" : "#28292c",
            }}
          >
            Selecciona un servicio
          </h1>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent:"space-around",
            alignItems: "center",
            marginTop: "18px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: sm
                ? "1fr 1fr"
                : md
                ? "1fr 1fr 1fr"
                : "1fr 1fr 1fr 1fr",
              gap: "5px",
              width: "100%",
              height: "25vh",
              maxHeight: "210px",
              overflow: "scroll",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ajusta según sea necesario
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {services.map((element, index) => (
              <Box sx={{ margin: "5px" }} key={index}>
                <Button
                  variant={
                    element == serviceSelected ? "contained" : "outlined"
                  }
                  sx={{
                    width: "150px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    height: "45px",
                    letterSpacing: "1.5px",
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
          <Box
            sx={{
              marginTop: "30px",
              width: "100%",
              maxWidth: "900px",
              height: "45vh",
              // display: "flex",
              // justifyContent:"center"
            }}
          >
            {serviceSelected.length > 0 ? (
              <CustomCalendarTurns
                sm={sm}
                amountOfDays={30}
                dayIsSelected={dayIsSelected}
                setDayIsSelected={setDayIsSelected}
                serviceSelected={serviceSelected}
                days={days}
                setIsOpen={setIsOpen}
              />
            ) : (
              <img src={calendar} style={{ width: "300px", height: "300px" }} />
            )}
          </Box>
        </Box>
        {dayIsSelected.length > 0 && (
          <ShowTurns
            dayIsSelected={dayIsSelected}
            serviceSelected={serviceSelected}
            user={user}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Turns;
