import { useEffect, useState } from "react";
import CustomCalendar from "../customCalendar/customCalendar";
import axios from "axios";
import SelectedDay from "../selectedDay/selectedDay";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import SliderCustom from "../slider/slider";
import { Button } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { width } from "@mui/system";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const CreateWorkDays = ({ user, schedule }) => {
  const theme = createTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [dayIsSelected, setDayIsSelected] = useState({});
  const [days, setDays] = useState({});
  const [firstMonth, setFirstMonth] = useState({});
  const [firstDay, setFirstDay] = useState({});
  const [timeSelected, setTimeSelected] = useState([]); //estado de la rama fac, no se para que es aun.
  const [showSlider, setShowSlider] = useState(false)
  const [openClose, setOpenClose] = useState([])

  useEffect(() => {
    const openValues = Object.values(schedule).map(item => item.open);
    const closeValues = Object.values(schedule).map(item => item.close);
    const minOpen = Math.min(...openValues);
    const maxClose = Math.max(...closeValues);
    setOpenClose([minOpen, maxClose])
  }, [])

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

  return (
    <ThemeProvider theme={theme}>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <CustomCalendar
        setDayIsSelected={setDayIsSelected}
        amountOfDays={21}
        dayIsSelected={dayIsSelected}
        days={days}
        setDays={setDays}
        schedule={schedule}
      />
      {/*     <div>
        {Object.keys(firstMonth).length > 0 ? (
          <p>Primer mes seleccionado: {firstMonth}</p>
        ) : null}
        {Object.keys(firstDay).length > 0 ? (
          <p>Primer dia seleccionado: {firstDay}</p>
        ) : null}
      </div> */}
      {Object.keys(firstMonth).length > 0 &&
        Object.keys(firstDay).length > 0 && (
          <SelectedDay
            firstMonth={firstMonth}
            firstDay={firstDay}
            days={days}
            dayIsSelected={dayIsSelected}
            setDayIsSelected={setDayIsSelected}
            schedule={schedule}
            showSlider={showSlider}
            setShowSlider={setShowSlider}
          />
        )}
      {showSlider && <Dialog open={showSlider} onClose={() => setShowSlider(false)} PaperProps={{
        style: { display: "flex", alignItems: "center", width: isSmallScreen ? "50vw" : "90vw", height: isSmallScreen ? "90vh" : "50vh"}
      }}>
        <DialogTitle>Slider Personalizado</DialogTitle>
        <DialogContent PaperProps={{
        style: { display: "flex", alignItems: "center", width: isSmallScreen ? "50vw" : "90vw", height: isSmallScreen ? "90vh" : "50vh"}
      }}>
          <SliderCustom />
          <Button onClick={() => setShowSlider(false)} color="primary">
            Cerrar
          </Button>
          <Button onClick={() => setShowSlider(false)} color="primary">
            Aceptar
          </Button>
        </DialogContent>
      </Dialog>
      }
    </div>
    </ThemeProvider>
  );
};

export default CreateWorkDays;