import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import SelectedDayTurns from "../selectedDay/selectedDayTurns";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const [workdays, setWorkDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/workdays/daysByService`
        );
        const { data } = response;
       /*  console.log(data); */
        setWorkDays(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Selecciona un servicio</h1>
      
    </div>
  );
};

export default Turns;
