import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button } from "@mui/material";
import calendar from "../../assets/images/calendar2.png";
import imgService from "../../assets/images/corte-de-pelo.jpg";
import "./turns.css";
// import style from "./turns.css";
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
    setDayIsSelected([])
  },[serviceSelected])

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
        // paddingTop: sm ? "70px" : "70px",
        height: "100vh",
      }}
    >
      <div //container
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "900px", //revisar maxWidth
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: "20vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 className={!md ? "h1-turns-md" : "h1-turns"}>
              Selecciona un servicio
            </h1>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: sm
                ? "1fr 1fr"
                : md
                ? "1fr 1fr 1fr 1fr"
                : "1fr 1fr 1fr 1fr 1fr",
              gap: "3px",
              width: "100%",
              height: "25vh",
              maxHeight: "210px",
              overflow: "auto",
              borderBottom: "2px solid #2196f3",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {services.map((element, index) => (
              <Box sx={{ marginTop: "1px" }} key={index}>
                <Button
                  variant={
                    element == serviceSelected ? "contained" : "outlined"
                  }
                  class={
                    element == serviceSelected
                      ? "btn-services-selected"
                      : "btn-services"
                  }
                  // sx={{
                  //   width: "130px",

                  // }}
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
              background:
                "linear-gradient(180deg, rgba(255,0,0,0) 70%, rgba(0,0,0,0.34) 100%)",
            }}
          >
            <img
              src={imgService}
              alt="img servicio"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                zIndex: "-1",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignContent: "center",
            // marginTop: "18px",
            // height: "100%",
          }}
        >
          <Box
            sx={{
              marginTop: "30px",
              width: "100%",
              maxWidth: "900px",
              height: "50vh",
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <img
                  src={calendar}
                  style={{
                    filter: " grayscale(100%)",
                    width: sm ? "250px" : "300px",
                    height: sm ? "250px" : "300px",
                  }}
                />
              </Box>
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
