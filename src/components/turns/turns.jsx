import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button } from "@mui/material";
import calendar from "../../assets/images/calendar2.png";
import defaultServiceImg from "../../assets/images/serviciosfondodefault.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./turns.css";
import { convertToCategoryServiceArray } from "../../helpers/convertCategoryService";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = () => {
  const {
    userData,
    darkMode,
    setShowAlert,
    validateAlertTurns,
    setValidateAlertTurns,
    validateAlertTurnsWorker,
    setValidateAlertTurnsWorker,
    refreshWhenCancelTurn,
    clientName,
    setClientName,
  } = useContext(DarkModeContext);

  const [days, setDays] = useState([]);
  const [catServices, setCatServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("");
  const [showTurns, setShowTurns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [detailTurn, setDetailTurn] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services`);
        const { data } = response;
        const catServicesArr = convertToCategoryServiceArray(data);
        setCatServices(catServicesArr);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  return (
    <div
      className="container-turns"
      style={{
        backgroundColor: darkMode.on ? darkMode.dark : "blue",
      }}
    >
      <div className="subcontainer-turns">
        <button className="btn-services-turns">Seleccionar servicio</button>
        {catServices.length < 1 ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              fontSize: "18px",
            }}
          >
            No tienes servicios aún
          </span>
        ) : (
          catServices.map((elem, index) => {
            return (
              <div key={index} style={{ marginTop: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {elem.category}
                </span>
                <hr />
                {elem.services.map((service, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div style={{ display: "flex", width: "100%" }}>
                        <span style={{ width: "40%", margin: "5px" }}>
                          {service.name}
                        </span>
                        <span
                          style={{
                            width: "30%",
                            margin: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          ${service.price}
                        </span>
                      </div>
                      <hr />
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Turns;
