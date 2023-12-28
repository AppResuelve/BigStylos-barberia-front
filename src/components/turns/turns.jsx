import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import SelectedDayTurns from "../selectedDay/selectedDayTurns";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const [workdays, setWorkDays] = useState([]);
  const [arrOfServices, setArrOfServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState(false);
  const [daysForCalendar, setDaysForCalendar] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/workdays/daysByService`
        );
        const { data } = response;
        console.log(data);
        setWorkDays(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // pone en un estado local arrOfServices los servicios totales disponibles 
    if (workdays.length > 0) {
      const servicesArray = workdays.reduce((accumulator, workday) => {
        const services = Object.keys(workday.services);
        services.forEach((service) => {
          if (!accumulator.includes(service)) {
            accumulator.push(service);
          }
        });
        return accumulator;
      }, []);
      setArrOfServices(servicesArray);
    }
  }, [workdays]);

  const handleSelectService = async (selectedService) => {
    // Buscar todos los dates en base al selectedService
    const datesForSelectedService = workdays
      .filter((workday) => workday.services[selectedService])
      .map((workday) => workday.date);
    // console.log(datesForSelectedService);
    // console.log(selectedService);

    const result = {};
    // Iterar sobre los días obtenidos de la base de datos
    workdays.forEach((workday) => {
      if (datesForSelectedService.includes(workday.date)) {
        const dateParts = workday.date.split("/");
        const month = parseInt(dateParts[1], 10);
        const dayOfMonth = parseInt(dateParts[0], 10);

        // Verificar si ya existe result[month] y asignar un valor en consecuencia
        result[month] = result[month] || {};

        // Verificar si workday.time está definido antes de llamar a some
        result[month][dayOfMonth] =
          Array.isArray(workday.time) &&
          workday.time.some((minute) => {
            return minute !== "free" && minute !== null;
          })
            ? "no se puede agendar"
            : "se puede agendar";
      }
    });

    // console.log(result);
    setDayIsSelected((prevState) => ({
      ...prevState,
      currentService: selectedService,
    }));
    setDaysForCalendar(result);

  };

  return (
    <div>
      <h1>Selecciona un servicio</h1>
      {arrOfServices.map((service, index) => (
        <button key={index} onClick={() => handleSelectService(service)}>
          {service}
        </button>
      ))}
      {Object.keys(daysForCalendar).length > 0 && (
        <CustomCalendarTurns
          daysForCalendar={daysForCalendar}
          setDayIsSelected={setDayIsSelected}
          amountOfDays={20}
        />
      )}
      {Object.keys(dayIsSelected).length > 1 && (
        <SelectedDayTurns dayIsSelected={dayIsSelected} workdays={workdays} />
      )}
    </div>
  );
};

export default Turns;
