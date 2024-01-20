import axios from "axios";
import { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ShowTurns = ({ dayIsSelected, serviceSelected, user }) => {
  const [dayForTurns, setDayForTurns] = useState([]);
  const [buttons, setButtons] = useState([])

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

  useEffect(() => {
    var renderizate = []
    if(dayForTurns.length > 0) {
      for(let i = 0; i < dayForTurns.length; i++) {
            renderizate.push([dayForTurns[i].email])
            let contador = null
            let init = 0
          for(let k = 0; k < dayForTurns[i].time.length; k++){
            if (dayForTurns[i].time[k] == "free") {
                contador++
            }
            if (contador == 1) {
                init = k
            }
            if (contador == dayForTurns[i].services[serviceSelected].duration){
              renderizate[i].push(init)
              contador = null
            }
          }
          
      }
      setButtons(renderizate)
    }
  },[dayForTurns])

  const handleSelectTime = (workerEmail, selectTime) => {
    const tardanza = dayForTurns.filter(element => element.email == workerEmail)
    console.log(`la duracion del servicio es: ${tardanza[0].services[serviceSelected].duration}`)
    console.log(workerEmail, selectTime, serviceSelected, )
  }

  
  return (
    <div>
      <h2>Días Seleccionados:</h2>
      {buttons.map((buttonGroup, index) => (
        <div key={index}>
          {buttonGroup.map((button, buttonIndex) => { 
            if(buttonIndex == 0){
                return (
              <h2 key={button}>{button}</h2>
                )
            } else {
            return (
            <button key={buttonIndex} onClick={() => handleSelectTime(buttonGroup[0], button)}>
              {formatHour(button)}
            </button>
          )}})}
        </div>
      ))}
    </div>
  );
};

export default ShowTurns;
