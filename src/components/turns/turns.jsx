import axios from "axios";
import { useEffect, useState } from "react";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ user }) => {
  
  const [days, setDays] = useState([])
  const [services, setServices] = useState([])
  const [dayIsSelected, setDayIsSelected] = useState([])
  const [serviceSelected, setServiceSelected] = useState('')
  const [showTurns, setShowTurns] = useState([])

  useEffect(() => {
    setDayIsSelected([])
  },[serviceSelected])

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byservices`, {servicesForTurns: serviceSelected}
        );
        const { data } = response;
        setDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        /* alert("Error al obtener los dias"); */
      }
    };
    if (serviceSelected.length > 0) {
      fetchDays()
    }
  }, [serviceSelected]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/services/`
        );
        const { data } = response;
        setServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (element) => {
    setServiceSelected(element)
  }

  return (
    <div>
      <div style={{paddingTop: '100px'}}>
        <h1>hola</h1>
        {services.map((element, index) => (
          <button key={index} style={{backgroundColor: element == serviceSelected ? "green" : "white"}} onClick={() => handleSelectService(element)}>{element}</button>
        ))}
        {serviceSelected.length > 0 && <CustomCalendarTurns amountOfDays={25} dayIsSelected={dayIsSelected} setDayIsSelected={setDayIsSelected} serviceSelected={serviceSelected} days={days} />}
        {dayIsSelected.length > 0 && <ShowTurns dayIsSelected={dayIsSelected} serviceSelected={serviceSelected} user={user}/>}
      </div>
    </div>
  )
};

export default Turns;
