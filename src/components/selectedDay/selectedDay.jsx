import { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SelectedDay = ({ firstMonth, firstDay, days, dayIsSelected, setDayIsSelected, schedule, showSlider, setShowSlider }) => {
  const [renderedStructure, setRenderedStructure] = useState([]);

  useEffect(() => {
    if (dayIsSelected && Object.keys(dayIsSelected).length > 0) {
      const recorrerEstructura = (obj, ruta = '') => {
        const result = [];
        for (const prop in obj) {
          const nuevaRuta = ruta ? `${prop}/${ruta}` : prop;

          if (typeof obj[prop] === 'object' && Object.keys(obj[prop]).length > 0) {
            result.push(...recorrerEstructura(obj[prop], nuevaRuta));
          } else {
            result.push(nuevaRuta);
          }
        }
        return result;
      };

      const result = recorrerEstructura(dayIsSelected);
      setRenderedStructure(result);
    }
  }, [dayIsSelected]);

  console.log(days)

  const handleEdit = () => {
    console.log("hola")
    if(days && days[firstMonth] && days[firstMonth][firstDay] && days[firstMonth][firstDay].turn == true) {
        alert("el dia posee algun turno agendado con un cliente")
    }
    setShowSlider(true)
  }

  return (
    <div style={{ backgroundColor: "yellow" }}>
      {/* Renderizamos cada elemento del resultado */}
      {renderedStructure.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
      {days && days[firstMonth] && days[firstMonth][firstDay] ? <button onClick={handleEdit}>editar horarios</button> : <button onClick={handleEdit}>asignar horarios</button>}
    </div>
  );
};

export default SelectedDay;
