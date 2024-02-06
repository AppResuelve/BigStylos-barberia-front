import { Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import "./whoIsComingAdmin.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingAdmin = () => {
  const [turns, setTurns] = useState([]);
/*  turns contiene:
  {
    email: el email del cliente
    name: el name del cliente
    ini: el minuto de inicio de su turno
    fin: minuto final de su turno
    phone: su cel
    image: su imagen
  } */
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorker, setSelectedWorker] = useState('')
  const [workers, setWorkers] = useState([])

  console.log(turns)


  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/users/getworkers`);
        const { data } = response;
        setWorkers(data);
      } catch (error) {
        console.error("Error al obtener workers.", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: selectedWorker }
        );
        const { data } = response;
        setCount(data);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    if (selectedWorker.length > 0){
        fetchCount();
    }
  }, [selectedWorker]);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        console.log(data)
        setTurns(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    if (selectedDay.length > 0) {
      fetchTurns();
    }
  }, [selectedDay]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
  };

  const handleChangeWorker = (email) => {
    setSelectedDay('')
    setSelectedWorker(email)
  }

  return (
    <div>
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box
        className="box-container-ctfw"
        style={{
          overFlow: "scroll",
          marginBottom: "20px",
        }}
      >
        {/* ********************************************** */}
        <Box
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "900px",
            overflow: "auto",
          }}
        >
          {workers.length > 0 &&
            workers.map((element, index) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: selectedDay == element ? "black" : "",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                  }}
                  onClick={() => {
                    handleChangeWorker(element.email);
                  }}
                >
                  <h3 style={{textTransform: "lowercase",}}>{element.email}</h3>
                  <h5 style={{color: "#cccaca",}}>{element.name}</h5>
                </Button>
              );
            })}
        </Box>

        <Box
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "900px",
            overflow: "auto",
          }}
        >
          {count.length > 0 &&
            count.map((element, index) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  sx={{
                    backgroundColor: selectedDay == element ? "black" : "",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    handleChangeDay(element);
                  }}
                >
                  {element}
                </Button>
              );
            })}
        </Box>
   
        <Box style={{ overflow: "scroll", maxHeight: "350px" }}>
          {turns.length > 0 &&
            turns.map((element, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box style={{ display: "flex" }}>
                      <h3 className="h-email-ctfw">Email</h3>
                      <hr />
                      <h3 className="h-whocancelled-ctfw">Quien canceló?</h3>
                      <hr />
                      <h3 className="h-phone-ctfw">Celular</h3>
                      <hr />
                      <h3 className="h-day-ctfw">Día</h3>
                    </Box>
                    <hr className="hr-ctfw" />
                  </Box>
                )}
                <Box style={{ display: "flex" }}>
                  <h4 className="h-email-ctfw">{element.email}</h4>
                  <hr />
                  <h4 className="h-whocancelled-ctfw">
                    {element.howCancelled}
                  </h4>
                  <hr />
                  <Box className="h-phone-ctfw">
                    <a
                      href={`whatsapp://send?phone=${element.phone}&text=Hola , quiero contactarte`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className={
                          element.phone === "no requerido"
                            ? "btn-wsp-ctfw-false"
                            : "btn-wsp-ctfw"
                        }
                        style={{
                          fontFamily: "Jost, sans-serif",
                          fontWeight: "bold",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h4>{element.phone}</h4>
                        {element.phone !== "no requerido" && (
                          <WhatsApp color="success" />
                        )}
                      </button>
                    </a>
                  </Box>

                  <hr />
                  <h4 className="h-day-ctfw">{selectedDay}</h4>
                </Box>
                <hr className="hr-ctfw" />
              </Box>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default WhoIsComingAdmin;
