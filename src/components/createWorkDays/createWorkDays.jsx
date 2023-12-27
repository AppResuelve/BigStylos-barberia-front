import { useState } from "react";
import CustomCalendar from "../customCalendar/customCalendar";
import "./hola.css";
import SelectedDay from "../selectedDay/selectedDay";

const CreateWorkDays = () => {
  const [dayIsSelected, setDayIsSelected] = useState({});
  console.log(dayIsSelected);
  return (
    <div>
      <CustomCalendar setDayIsSelected={setDayIsSelected} />
      {dayIsSelected.currentDay && (
        <SelectedDay dayIsSelected={dayIsSelected} />
      )}
    </div>
  );
};

export default CreateWorkDays;
