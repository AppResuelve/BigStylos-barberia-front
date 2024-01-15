import { useEffect, useState } from "react";
import CustomCalendar from "../customCalendar/customCalendar";
import axios from "axios";
import SelectedDay from "../selectedDay/selectedDay";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import AlertModal from "../interfazMUI/alertModal";
import SliderModal from "../interfazMUI/sliderModal";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateWorkDays = ({ user, schedule }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [days, setDays] = useState({});
  const [firstMonth, setFirstMonth] = useState({});
  const [firstDay, setFirstDay] = useState({});
  const [timeSelected, setTimeSelected] = useState([]); //estado de la rama fac, no se para que es aun.
  const [isOpen, setIsOpen] = useState(false);
  const [openClose, setOpenClose] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAlert, setShowAlert] = useState({});
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const openValues = Object.values(schedule).map((item) => item.open);
    const closeValues = Object.values(schedule).map((item) => item.close);
    const minOpen = Math.min(...openValues);
    const maxClose = Math.max(...closeValues);
    setOpenClose([minOpen, maxClose]);
  }, []);

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

  useEffect(() => {
    handleSubmit()
  }, [submit]);
  
  const handleEdit = () => {
    setShowEdit(true);
  };
  
  const handleCancel = () => {
    setShowEdit(false);
    setDayIsSelected({});
  };
  
  const handleShowSlider = () => {
    if (
      days &&
      days[firstMonth] &&
      days[firstMonth][firstDay] &&
      days[firstMonth][firstDay].turn == true
      ) {
        setShowAlert({
          isOpen: true,
          message: "Has seleccionado un día con reserva/s, deseas continuar?",
          type: "error",
          button1: {
            text: "Continuar",
            action: "handleActionProp",
          },
          buttonClose: {
            text: "Volver",
          },
        });
      } else {
        setIsOpen(true);
      }
  };
  
    const handleSubmit = () => {
      console.log("pase por el submit");
      setSubmit(false)
  };
  
    console.log(submit);
    return (
      <Grid container>
      <Grid item xs={12} sm={12} md={showEdit && !md ? 6 : 12}>
        <CustomCalendar
          setDayIsSelected={setDayIsSelected}
          amountOfDays={30}
          dayIsSelected={dayIsSelected}
          days={days}
          setDays={setDays}
          schedule={schedule}
          showEdit={showEdit}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        {showEdit && (
          /*  Object.keys(firstMonth).length > 0 &&
          Object.keys(firstDay).length > 0 && */ <SelectedDay
            firstMonth={firstMonth}
            firstDay={firstDay}
            days={days}
            dayIsSelected={dayIsSelected}
            setDayIsSelected={setDayIsSelected}
            schedule={schedule}
          />
        )}
        {Object.keys(days).length > 0 &&
          days[firstMonth] &&
          days[firstMonth][firstDay] &&
          days[firstMonth][firstDay].turn && (
            <h3
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginTop: "12px",
                color: "red",
              }}
            >
              Día con turno reservado
            </h3>
          )}
      </Grid>
      {/* area de los botones */}
      <Grid xs={12} sm={12} md={12} item>
        {showEdit === false && (
          <Button onClick={handleEdit}>
            <BorderColorIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{ borderRadius: "50px", border: "2px solid " }}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Volver</h4>
            </Button>
            <Button
              variant="contained"
              disabled={
                dayIsSelected && Object.keys(dayIsSelected).length > 0
                  ? false
                  : true
              }
              onClick={handleShowSlider}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>
                Asignar horarios
              </h4>
            </Button>
            {/* <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button> */}
          </Box>
        )}
        {/* sección del slider */}
      </Grid>
      <SliderModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSubmit={setSubmit}
      />
      <AlertModal
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        handleActionProp={setIsOpen}
      />
    </Grid>
  );
};

export default CreateWorkDays;
