import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import CustomCalendar from "../customCalendar/customCalendar";
import SelectedDay from "../selectedDay/selectedDay";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import SliderModal from "../interfazMUI/sliderModal";
import { Grid, Box, Button, LinearProgress } from "@mui/material";
import getCurrentMonth from "../../functions/getCurrentMonth";
import durationMax from "../../helpers/durationMax";
import shouldDisableButton from "../../helpers/shouldDisableButton";
import daysMonthCalendarCustom from "../../functions/daysMonthCalendarCustom";
import obtainDayName from "../../functions/obtainDayName";
import Swal from "sweetalert2";
import toastAlert from "../../helpers/alertFunction";
import axios from "axios";
import "./createWorkDays.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateWorkDays = ({
  userData,
  schedule,
  doCeroServices,
  pendingServices,
  setRefreshWhoIsComing,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [isOpen, setIsOpen] = useState(false);
  const [dayIsSelected, setDayIsSelected] = useState({});
  const [days, setDays] = useState({});
  const [firstMonth, setFirstMonth] = useState({});
  const [firstDay, setFirstDay] = useState({});
  const [openClose, setOpenClose] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSelected, setTimeSelected] = useState([]); //estado de la rama fac, no se para que es aun.
  const [refreshDays, setRefreshDays] = useState(false);
  const [noWork, setNoWork] = useState({});

  /*   dayIsSelected && Object.keys(dayIsSelected).length > 0 && days && Object.keys(days) > 0 && console.log(days[Object.keys(dayIsSelected)[0]][Object.keys(Object.keys(dayIsSelected)[0])[0]])
   */
  useEffect(() => {
    const openValues = Object.values(schedule).map((item) => item.open);
    const closeValues = Object.values(schedule).map((item) => item.close);
    const minOpen = Math.min(...openValues);
    const maxClose = Math.max(...closeValues);
    setOpenClose([minOpen, maxClose]);
  }, []);
  /* console.log(dayIsSelected) */
  /*   dayIsSelected && Object.keys(dayIsSelected)[0] && console.log(Object.keys(dayIsSelected)[0])
  dayIsSelected && Object.keys(dayIsSelected)[0] && console.log(Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0]) */
  /* dayIsSelected && Object.keys(dayIsSelected)[0] && days && days[Object.keys(dayIsSelected)[0]] && days[Object.keys(dayIsSelected)[0]][Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0]] */ /* console.log(Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0] */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byemail`,
          { email: userData.email }
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

  useEffect(() => {
    const fetchNoWorkDays = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/schedule/`);
        const { data } = response;
        setNoWork(data.noWorkDays);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
        alert("Error al obtener los dias");
      }
    };
    fetchNoWorkDays();
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

  const handleEdit = () => {
    if (pendingServices || doCeroServices) {
      Swal.fire({
        title: "Para crear un día NO debes tener servicios pendientes.",
        showDenyButton: true,
        confirmButtonText: "Ir a mis servicios",
        denyButtonText: `Más tarde`,
      }).then((result) => {
        if (result.isConfirmed) {
          setRedirectToMyServices(true);
        }
      });
    } else {
      setShowEdit(true);
    }
  };

  const handleCancel = () => {
    setShowEdit(false);
    setDayIsSelected({});
  };

  const handleShowSlider = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (time, values) => {
    const currentMonth = getCurrentMonth();
    const currentMonth2 = currentMonth == 12 ? 1 : currentMonth + 1;

    const resultDuration = durationMax(userData.services, values);
    if (resultDuration) {
      const arrayServices = Object.keys(userData.services);
      let objServices = {};
      arrayServices.forEach((element) => {
        if (
          userData.services[element].duration != null &&
          userData.services[element].duration != 0
        ) {
          objServices[element] = {
            duration: userData.services[element].duration,
            available: true,
          };
        } else {
          objServices[element] = {
            duration: userData.services[element].duration,
            available: false,
          };
        }
      });

      let submitArray = [];
      if (dayIsSelected[Object.keys(dayIsSelected)[0]]) {
        // console.log(Object.keys(dayIsSelected)[0]);
        // console.log(Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]]));
        const first = Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]]);
        first.forEach((element) => {
          submitArray.push({
            month: Object.keys(dayIsSelected)[0],
            day: Number(element),
            email: userData.email,
            name: userData.name,
            image: userData.image,
            time,
            services: objServices,
          });
        });
      }
      if (dayIsSelected[Object.keys(dayIsSelected)[1]]) {
        // console.log(dayIsSelected[Object.keys(dayIsSelected)[1]]);
        // console.log(Object.keys(dayIsSelected[Object.keys(dayIsSelected)[1]]));
        const second = Object.keys(
          dayIsSelected[Object.keys(dayIsSelected)[1]]
        );

        second.forEach((element) => {
          submitArray.push({
            month: currentMonth2,
            day: Number(element),
            email: userData.email,
            name: userData.name,
            image: userData.image,
            time,
            services: objServices,
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
          toastAlert(
            `el día ${submitArray[i].day}/${submitArray[i].month} se creo exitosamente`,
            "success"
          );
        } catch (error) {
          toastAlert(
            `Error al crear el día ${submitArray[i].day}/${submitArray[i].month}`,
            "error"
          );
          console.error(
            `Error al crear el día ${submitArray[i].day}/${submitArray[i].month}`,
            error
          );
        }
      }
      setRefreshWhoIsComing((prevState) => !prevState);
      setShowEdit(false);
      setRefreshDays(true);
    } else {
      Swal.fire({
        title: "El rango horario debe ser mayor a la tardanza de tus servicios",
        icon: "warning",
        timer: 3000,
      });
    }
  };

  const handleDeleteSubmit = async () => {
    let day = Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0];
    let month = Object.keys(dayIsSelected)[0];

    if (
      days[Object.keys(dayIsSelected)[0]] &&
      days[Object.keys(dayIsSelected)[0]][
        Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0]
      ].turn == true
    ) {
      Swal.fire({
        title: "Desea borrar un día con turno?",
        showDenyButton: true,
        confirmButtonText: "Borrar",
        denyButtonText: "Más tarde",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(
              `${VITE_BACKEND_URL}/workdays/delete`,
              {
                month,
                day,
                email: userData.email,
                name: userData.name,
              }
            );
            toastAlert(
              `el día ${day}/${month} se borró exitosamente`,
              "success"
            );
            setDayIsSelected({});
            setRefreshDays(true);
            setRefreshWhoIsComing((prevState) => !prevState);
          } catch (error) {
            toastAlert(`Error al borrar el día ${day}/${month}`, "error");
            console.error("Error al borrar el dia:", error);
          }
        }
      });
    } else {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/delete`,
          {
            month,
            day,
            email: userData.email,
          }
        );
        toastAlert(`el día ${day}/${month} se borró exitosamente`, "success");
        setDayIsSelected({});
        setRefreshDays(true);
        setRefreshWhoIsComing((prevState) => !prevState);
      } catch (error) {
        toastAlert(`Error al borrar el día ${day}/${month}`, "error");
        console.error("Error al borrar el dia:", error);
      }
    }
  };

  const selectAllDays = () => {
    const allDaysSelected = {};
    const daysCalendarCustom = daysMonthCalendarCustom(27, false);
    const { currentMonth, nextMonth, currentYear, nextYear, month1, month2 } =
      daysCalendarCustom;

    const selectDays = (month, daysOfMonth) => {
      allDaysSelected[month] = {};
      daysOfMonth.forEach((day) => {
        let dayName = obtainDayName(day, month, currentYear);
        let disabled = false;
        if (days && days[month] && days[month][day]) {
          disabled = true;
        }
        if (
          !schedule[dayName] ||
          (schedule[dayName].open === 0 && schedule[dayName].close === 1440)
        ) {
          disabled = true;
        }
        if (noWork[month] && noWork[month][day]) {
          disabled = true;
        }
        if (!disabled) {
          allDaysSelected[month][day] = {};
        }
      });
    };

    selectDays(currentMonth, month1);
    selectDays(nextMonth, month2);
    setDayIsSelected(allDaysSelected);
  };

  const deselectAllDays = () => {
    setDayIsSelected({});
  };

  return (
    <div style={{ cursor: loading ? "wait" : "" }}>
      {loading ? (
        <LinearProgress sx={{ height: "2px", marginBottom: "15px" }} />
      ) : (
        <hr
          style={{
            border: "none",
            height: "2px",
            backgroundColor: "#2196f3",
          }}
        />
      )}
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={showEdit && !md ? 6 : 12}
          className={md ? "" : showEdit ? "mover-izquierda" : "mover-derecha"}
        >
          <CustomCalendar
            setDayIsSelected={setDayIsSelected}
            amountOfDays={27}
            dayIsSelected={dayIsSelected}
            days={days}
            setDays={setDays}
            schedule={schedule}
            showEdit={showEdit}
            loading={loading}
            noWork={noWork}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          style={{ display: "flex", flexDirection: "column" }}
          className={md ? "" : showEdit ? "mover-izquierda" : "mover-derecha"}
        >
          {showEdit && (
            <SelectedDay
              selectAllDays={selectAllDays}
              deselectAllDays={deselectAllDays}
              firstMonth={firstMonth}
              firstDay={firstDay}
              days={days}
              dayIsSelected={dayIsSelected}
              setDayIsSelected={setDayIsSelected}
              schedule={schedule}
              md={md}
              sm={sm}
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
                  marginBottom: "10px",
                  color: "red",
                }}
              >
                Día con turno reservado
              </h3>
            )}
        </Grid>
        {/* area de los botones */}
      </Grid>

      {!showEdit ? (
        <Button onClick={handleEdit}>
          <CreateRoundedIcon />
        </Button>
      ) : (
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            disabled={submit ? true : false}
            sx={{ fontFamily: "Jost, sans-serif" }}
            onClick={handleCancel}
          >
            Descartar
          </Button>
          {/* *********************************************** */}
          <Box style={{ display: "flex" }}>
            <Button
              variant="contained"
              color="error"
              disabled={
                dayIsSelected &&
                Object.keys(dayIsSelected)[0] &&
                days &&
                days[Object.keys(dayIsSelected)[0]] &&
                days[Object.keys(dayIsSelected)[0]][
                  Object.keys(dayIsSelected[Object.keys(dayIsSelected)[0]])[0]
                ]
                  ? false
                  : true
              }
              onClick={handleDeleteSubmit}
              sx={{ fontFamily: "Jost, sans-serif" }}
            >
              Borrar
            </Button>

            {/* *********************************************** */}
            <Button
              style={{ marginLeft: "10px" }}
              variant="contained"
              disabled={
                !dayIsSelected ||
                Object.keys(dayIsSelected).length === 0 ||
                shouldDisableButton(dayIsSelected, days)
              }
              onClick={handleShowSlider}
              sx={{ fontFamily: "Jost, sans-serif" }}
            >
              Asignar
            </Button>
          </Box>
        </section>
      )}
      {/* sección del slider */}
      <SliderModal
        userData={userData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSubmit={setSubmit}
        openClose={openClose}
        timeSelected={timeSelected}
        setTimeSelected={setTimeSelected}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateWorkDays;
