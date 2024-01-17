import { useEffect, useState } from "react";
import CustomCalendar from "../customCalendar/customCalendar";
import axios from "axios";
import SelectedDay from "../selectedDay/selectedDay";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import AlertModal from "../interfazMUI/alertModal";
import SliderModal from "../interfazMUI/sliderModal";
import { Grid, Box, Button, LinearProgress } from "@mui/material";
import "./CreateWorkDays.css";
import getCurrentMonth from "../../functions/getCurrentMonth";


const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateWorkDays = ({ user, schedule }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [days, setDays] = useState({});
  const [firstMonth, setFirstMonth] = useState({});
  const [firstDay, setFirstDay] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openClose, setOpenClose] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAlert, setShowAlert] = useState({});
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSelected, setTimeSelected] = useState([]); //estado de la rama fac, no se para que es aun.
  const [refreshDays, setRefreshDays] = useState(false);

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
    setRefreshDays(false);
  }, [refreshDays]);

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
    // Agregar la clase alert-open cuando se monta el componente y el alerta está presente
    if (!md && showEdit) {
      console.log("add class");
      document.body.classList.add("alert-open");
    } else if (!md && !showEdit) {
      console.log("remove class");
      // Remover la clase alert-open cuando se desmonta el componente o el alerta se cierra
       setTimeout(() => {
        document.body.classList.remove("alert-open");
      }, 300); // 400 milisegundos = .4 s
    }
  }, [showEdit]);

  // useEffect(() => {
  //   if (showEdit) {
  //     handleSubmit();
  //   }
  // }, [submit]);

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

   const handleSubmit = async (time) => {
     /* setLoading(true);
    setTimeout(() => {
      setSubmit(false);
      setLoading(false);
      setDayIsSelected({});
      setShowEdit(false);
    }, 3000) */
     const currentMonth = getCurrentMonth();
     const currentMonth2 = currentMonth == 12 ? 1 : currentMonth + 1;
     let submitArray = [];
     if (dayIsSelected[1]) {
       const first = Object.keys(dayIsSelected[1]);
       first.forEach((element) => {
         submitArray.push({
           month: currentMonth,
           day: Number(element),
           email: user.email,
           time,
           services: { probando: "el create" },
         });
       });
     }
     if (dayIsSelected[2]) {
       const second = Object.keys(dayIsSelected[2]);
       second.forEach((element) => {
         submitArray.push({
           month: currentMonth2,
           day: Number(element),
           email: user.email,
           time,
           services: { probando: "el create" },
         });
       });
     }
     for (let i = 0; i < submitArray.length; i++) {
       try {
         const response = await axios.post(
           `${VITE_BACKEND_URL}/workdays/create`,
           submitArray[i]
         );
         const { data } = response;
         setDayIsSelected((prevState) => {
           let newState = { ...prevState };
           delete newState[submitArray[i].month][submitArray[i].day];
           if (Object.keys(newState[submitArray[i].month]).length === 0) {
             delete newState[submitArray[i].month];
           }
           return newState;
         });
         console.log(
           `el dia ${submitArray[i].day}/${submitArray[i].month} se creo exitosamente`
         );
       } catch (error) {
         console.error(
           `Error al crear el dia ${submitArray[i].day}/${submitArray[i].month}`,
           error
         );
       }
     }
     setShowEdit(false);
     setRefreshDays(true);
   };

  return (
    <div style={{ cursor: loading ? "wait" : "" }}>
      {loading ? (
        <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
      ) : (
        <hr
          style={{
            marginBottom: "15px",
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      )}
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={showEdit && !md ? 6 : 12}
          className={!md && showEdit ? "mover-izquierda" : "mover-derecha"}
        >
          <CustomCalendar
            setDayIsSelected={setDayIsSelected}
            amountOfDays={30}
            dayIsSelected={dayIsSelected}
            days={days}
            setDays={setDays}
            schedule={schedule}
            showEdit={showEdit}
            loading={loading}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ display: "flex", flexDirection: "column" }}
          className={md ? "" : showEdit ? "mover-izquierda" : "mover-derecha"}
        >
          {showEdit && (
            <SelectedDay
              firstMonth={firstMonth}
              firstDay={firstDay}
              days={days}
              dayIsSelected={dayIsSelected}
              setDayIsSelected={setDayIsSelected}
              schedule={schedule}
            />
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
                variant="outlined"
                disabled={submit ? true : false}
                style={{ borderRadius: "50px", border: "2px solid " }}
                onClick={handleCancel}
              >
                <h4 style={{ fontFamily: "Jost, sans-serif" }}>Volver</h4>
              </Button>
              {Object.keys(days).length > 0 &&
                days[firstMonth] &&
                days[firstMonth][firstDay] &&
                days[firstMonth][firstDay].turn && (
                  <h3
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "red",
                    }}
                  >
                    {sm ? "Turno reservado" : "Día con turno reservado"}
                  </h3>
                )}
              <Button
                variant="contained"
                disabled={
                  submit
                    ? true
                    : dayIsSelected && Object.keys(dayIsSelected).length > 0
                    ? false
                    : true
                }
                onClick={handleShowSlider}
              >
                <h4 style={{ fontFamily: "Jost, sans-serif" }}>
                  {sm ? "Asignar" : "Asignar turnos"}
                </h4>
              </Button>
            </Box>
          )}
          {/* sección del slider */}
        </Grid>
        <SliderModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setSubmit={setSubmit}
          timeSelected={timeSelected}
          setTimeSelected={setTimeSelected}
          handleSubmit={handleSubmit}
        />
        <AlertModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          handleActionProp={setIsOpen}
        />
      </Grid>
    </div>
  );
};

export default CreateWorkDays;
