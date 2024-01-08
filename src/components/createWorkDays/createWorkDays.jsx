import { useEffect, useState } from "react";
import CustomCalendar from "../customCalendar/customCalendar";
import axios from "axios";
import SelectedDay from "../selectedDay/selectedDay";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateWorkDays = ({ user }) => {
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [days, setDays] = useState({});
  const [firstMonth, setFirstMonth] = useState({});
  const [firstDay, setFirstDay] = useState({});
  const [timeSelected, setTimeSelected] = useState([]); //estado de la rama fac, no se para que es aun.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byemail`,
          { email: user.email }
        );
        const { data } = response;
        setDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchData();
  }, []);

  // Lógica para obtener el primer valor de month y day
  useEffect(() => {
    let firstM = null;
    let firstD = null;
    if (Object.keys(dayIsSelected).length > 0) {
      firstM = Object.keys(dayIsSelected)[0];
      setFirstMonth(firstM);
      if (dayIsSelected[firstM]) {
        firstD = Object.keys(dayIsSelected[firstM])[0];
        setFirstDay(firstD);
      }
    } else {
      setFirstMonth({});
      setFirstDay({});
    }
  }, [dayIsSelected]);

  return (
    <div>
      <CustomCalendar
        setDayIsSelected={setDayIsSelected}
        amountOfDays={21}
        dayIsSelected={dayIsSelected}
        days={days}
        setDays={setDays}
      />
      <div>
        {Object.keys(firstMonth).length > 0 ? (
          <p>Primer mes seleccionado: {firstMonth}</p>
        ) : null}
        {Object.keys(firstDay).length > 0 ? (
          <p>Primer dia seleccionado: {firstDay}</p>
        ) : null}
      </div>
      {Object.keys(firstMonth).length > 0 &&
        Object.keys(firstDay).length > 0 && (
          <SelectedDay
            firstMonth={firstMonth}
            firstDay={firstDay}
            days={days}
          />
        )}
    </div>
  );
};

export default CreateWorkDays;
