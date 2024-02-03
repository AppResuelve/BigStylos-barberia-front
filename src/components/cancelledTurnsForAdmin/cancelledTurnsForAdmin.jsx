import { Button } from "@mui/material";
import { Box, width } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import "./cancelledTurnsForAdmin.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CancelledTurnsForAdmin = () => {
  const [cancelledTurnsByDays, setCancelledTurnsByDays] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('')

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
        console.error("Error al obtener el count.", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/cancelledturns/getcount`,
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
    const fetchCancelled = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/cancelledturns/getforworker`,
          { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        setCancelledTurnsByDays(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    if (selectedDay.length > 0) {
      fetchCancelled();
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
      </Box>
      <Box
        className="box-container-ctfw"
        sx={{
          width: "100%",
          overFlow: "scroll",
        }}
      >
        <Box style={{ overflow: "scroll", maxHeight: "350px" }}>
          {cancelledTurnsByDays.length > 0 &&
            cancelledTurnsByDays.map((element, index) => (
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

export default CancelledTurnsForAdmin;
