import axios from "axios";
import { useEffect, useState } from "react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ShowTurns = ({ dayIsSelected, serviceSelected }) => {
  const [dayForTurns, setDayForTurns] = useState([]);

  useEffect(() => {
    const fetchday = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/dayforturns`,
          { dayForTurns: dayIsSelected }
        );
        const { data } = response;
        setDayForTurns(data);
      } catch (error) {
        console.error("Error al obtener el día:", error);
      }
    };
    fetchday();
  }, [dayIsSelected]);
   var renderizate = []
  useEffect(() => {
    if(dayForTurns.length > 0) {
      for(let i = 0; i < dayForTurns.length; i++) {
          for(let k = 0; k < dayForTurns[i].time.length; k++){
            
          }
          
      }
    }
  },[dayForTurns])


  return (
    <div>
      <h1>ahahaha</h1>

    </div>
  );
};

export default ShowTurns;
