import { useEffect, useState } from "react";
import formatHour from "../../functions/formatHour";
import axios from "axios";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const SelectedDay = ({ firstMonth, firstDay, days }) => {
    const newTime = Array(1441).fill(null);
    const [schedule, setSchedule] = useState({})
    const [openClose, setOpenClose] = useState([])
    const [selected, setSelected] = useState([])
    console.log(selected)
    
    useEffect(() => {
        if (Object.keys(schedule).length > 0) {
            const openValues = Object.values(schedule).map(item => item.open);
            const closeValues = Object.values(schedule).map(item => item.close);
            const minOpen = Math.min(...openValues);
            const maxClose = Math.max(...closeValues)
            setOpenClose([minOpen, maxClose]);
        }
    }, [schedule]);
    

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`${VITE_BACKEND_URL}/schedule`)
                setSchedule(response.data.businessSchedule)
            } catch (error) {
                console.error(error)
            }
        }
        fetchSchedule()
    }, [])

    const handleSelected = (event) => {
        const value = Number(event.target.value);
        setSelected((prevSelected) => {
          if (prevSelected.includes(value)) {
            // Si ya está seleccionado, quitarlo
            return prevSelected.filter((selected) => selected !== value);
          } else {
            // Si no está seleccionado, agregarlo
            return [...prevSelected, value];
          }
        });
      };
    
      const isSelected = (index) => {
        return selected.includes(index);
      };

    return (
        <div style= {{display: "flex",flexDirection: "column"}}>
            <h2>Esto es SelectedDay</h2>
            {days[firstMonth][firstDay] ? (
                <h2>Existe</h2>
            ) : (
                (() => {
                    let counter = 1;
                    let firstValue = 0
                    return newTime.map((element, index) => {
                        if (counter == 1) {
                            firstValue = index
                        }
                        if (index >= openClose[0] && index <= openClose[1]) {
                            if (counter === 30) {
                                counter = 1; // Reiniciar el contador si llega a 30
                                return <button 
                                value={index} 
                                onClick={handleSelected} 
                                key={index}
                                style={{
                                    backgroundColor: isSelected(index) ? "blue" : "white",
                                    border: isSelected(index) ? "1px solid blue" : "1px solid black",
                                  }}
                                >{formatHour(firstValue)} - {formatHour(index)}
                                </button>;
                            } else {
                                counter++;
                                return null; // Renderizar null en este caso
                            }
                        }
                    });
                })()
            )}
        </div>
    );
};

export default SelectedDay;
