import { useEffect, useState } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WeekDaysAndExceptions = () => {
  const [schedule, setSchedule] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [timeEdit, setTimeEdit] = useState({});

  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule/`);
        const { data } = response;
        setSchedule(data.businessSchedule);
        setTimeEdit(data.businessSchedule);
      } catch (error) {
        console.error("Error al obtener los horarios", error);
        alert("Error al obtener los horarios");
      }
    };
    fetchData();
  }, [refresh]);
  return <div>sdf</div>;
};

export default WeekDaysAndExceptions;
