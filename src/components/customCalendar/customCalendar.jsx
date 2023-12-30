import { useEffect, useState } from "react";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import { useAuth0 } from "@auth0/auth0-react";
import getToday from "../../functions/getToday";
import axios from "axios";
import "./customCalendar.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomCalendar = ({ setDayIsSelected, amountOfDays, dayIsSelected }) => {
  const { user } = useAuth0();
  const daysCalendarCustom = daysMonthCalendarCustom(amountOfDays, false);
  let { currentMonth, nextMonth } = daysCalendarCustom;
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday() + 1; // devuelve número que representa qué día de la semana es (lunes, martes, etc)
  const [typeOfDays, setTypeOfDays] = useState({}); //devuelve ej: {12:{15:"toUpdate"},12:{16:"warningUpdate"}}

  useEffect(() => {
    if (user && user.email) {
      let email = user.email;
      console.log(email)

      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/workdays/getdays`,
            email
          );
          const { data } = response;
          setTypeOfDays(data);
        } catch (error) {
          console.error("Error al obtener los dias:", error);
          alert("Error al obtener los dias");
        }
      };
      fetchData();
    }
  }, []);

console.log(dayIsSelected)

  const handleDay = (day, colorDay) => {
    setDayIsSelected(prevDays => {  // prevDays representa lo que contiene el estado local
      const updatedDays = { ...prevDays };  // crea una copia de lo que contenia antes de agregar un dia
      if (updatedDays[day]) {  // si ya existia un objeto con la clave day la borra
        delete updatedDays[day];
      } else {  // si no existia un objeto con esa clave la agrega
        updatedDays[day] = {        // fijate la jugarreta, crea el objeto para
          colorDay: colorDay,       // luego acceder a la propiedad day
          email: user.email,
        };
      }
      return updatedDays;  // al retornar dentro del set, solo guarda el retorno
    });
  };

  return (
    <div>
      <h1>calendario</h1>
      <div className="line7day">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="line7">
        {daysCalendarCustom.month1.map((day, index) => {
          let colorDay; // Inicializar colorDay fuera del mapeo
          // console.log(typeOfDays[currentMonth][day]);
          if (!typeOfDays[currentMonth] || !typeOfDays[currentMonth][day]) {
            colorDay = "green";
          } else if (
            typeOfDays[currentMonth] &&
            typeOfDays[currentMonth][day] === "toUpdate"
          ) {
            colorDay = "yellow";
          } else {
            colorDay = "red";
          }

          return (
            <button
              key={index}
              className="month1"
              onClick={() => handleDay(day, colorDay)}
              style={{
                gridColumnStart: index === 0 ? getDayPosition : "auto",
                /* ...(index === 0 ? { backgroundColor: "#e0e0e0" } : {}), */
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
                ...(dayIsSelected[day] ? { backgroundColor: 'blue' } : {}) // si el dia existe en el estado local...
              }}                                                           // cambia el backgraund a azul
            >
              {day}
            </button>
          );
        })}

        {daysCalendarCustom.month2.map((day, index) => {
          let colorDay; // Inicializar colorDay fuera del mapeo

          if (!typeOfDays[nextMonth] || !typeOfDays[nextMonth][day]) {
            colorDay = "green";
          } else if (
            typeOfDays[nextMonth] &&
            typeOfDays[nextMonth][day] === "toUpdate"
          ) {
            colorDay = "yellow";
          } else {
            colorDay = "red";
          }

          return (
            <button
              key={index + 100}
              className="month2"
              onClick={() => handleDay(day, colorDay)}
              style={{
                backgroundColor: colorDay, // Asignar colorDay al backgroundColor
                ...(dayIsSelected[day] ? { backgroundColor: 'blue' } : {}) // si el dia existe en el estado local..
              }}                                                           // cambia el backgraund a azul
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;