import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForWorker = ({ user }) => {

    const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([])
    const [count, setCount] = useState([])
    const [selectedDay, setSelectedDay] = useState("")

    const date = new Date();
    const currentDay = date.getDate();
    console.log(cancelledTurnsByDays)

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.post(`${VITE_BACKEND_URL}/cancelledturns/getcount`,
                    { emailWorker: user.email });
                const { data } = response;
                setCount(data);
            } catch (error) {
                console.error("Error al obtener el count.", error);
            }
        };
        fetchCount();
    }, [])

    useEffect(() => {
        const fetchCancelled = async () => {
            const [numberDay, numberMonth] = selectedDay.split('/').map(Number);
            try {
                const response = await axios.post(`${VITE_BACKEND_URL}/cancelledturns/getforworker`,
                    { emailWorker: user.email, month: numberMonth, day: numberDay });
                const { data } = response;
                setCancelledTurnsByDays(data);
            } catch (error) {
                console.error("Error al obtener los dias cancelados.", error);
            }
        };
        if (selectedDay.length > 0) {
            fetchCancelled()
        }
    }, [selectedDay])

    const handleChangeDay = (element) => {
        setSelectedDay(element)
    }

    return (
        <div>
            <Box>
                {count.length > 0 && count.map((element, index) => {

                    return (
                        <button
                            key={index}
                            style={{ backgroundColor: selectedDay == element ? "blue" : "green" }}
                            onClick={() => { handleChangeDay(element) }}
                        >
                            {element}
                        </button>
                    )
                })}
            </Box>
            <Box>
                {cancelledTurnsByDays.length > 0 && cancelledTurnsByDays.map((element, index) => {

                    return (
                        <div
                            key={index + 100}
                        >
                            {element.email}
                            {element.howCancelled}
                            {element.phone}
                            {selectedDay}
                        </div>
                    )
                })}
            </Box>
        </div>
    )
}

export default CancelledTurnsForWorker;