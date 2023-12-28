import { useEffect, useState } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SelectedDayTurns = ({ dayIsSelected, workdays }) => {
      const [timeAvailable, setTimeAvailable] = useState(/* como se trae??? */);
      console.log(workdays);
      console.log(dayIsSelected);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/workdays/getdays`,
              dayIsSelected, 
          
          
        );
        const { data } = response;
        setTimeAvailable(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchData();
  }, []);

      return (
        <div>
          <h1>Selecciona el horario</h1>
        </div>
      );
};

export default SelectedDayTurns;
