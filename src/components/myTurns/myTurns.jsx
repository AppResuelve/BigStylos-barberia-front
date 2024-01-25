import { useEffect, useState } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTurns = ({ userData }) => {
  const [listMyTurns, setListMyTurns] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/myturns`,{emailUser: userData.email});
        const { data } = response;
        setListMyTurns(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (Object.keys(userData).length > 0){
        fetchData();
    }
  }, [userData]);

  return (
    <div>
      <h2 style={{ paddingTop: '100px' }}>Esto es mis turnos</h2>
      <ul>
        {listMyTurns && Object.keys(listMyTurns).length > 0 &&listMyTurns.map((turn, index) => (
          <li key={index}>
            <p>Día: {turn.day}</p>
            <p>Mes: {turn.month}</p>
            <p>Horario: {turn.hourTime.ini} - {turn.hourTime.fin}</p>
            <p>Trabajador: {turn.worker}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTurns;
