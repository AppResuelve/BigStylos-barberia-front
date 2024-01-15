import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { Dialog, Grid, Slider } from "@mui/material";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import time from "../../helpers/arrayTime";
import HelpIcon from "@mui/icons-material/Help";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});
const SliderModal = ({ isOpen, setIsOpen, darkMode, setSubmit }) => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();

  const handleClose = () => setIsOpen(false);

  const [values, setValues] = useState([
    [0, 10],
    [30, 37],
  ]); // Solo 2 rangos

  const marks = time;

  const handleChange = (event, newValue, index) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  return (
    <div>
      <Dialog
        sx={{
          height: sm ? "100vh" : "1000px",
        }}
        fullScreen={sm}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        open={isOpen}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box
          sx={{
            height: "500px",
            backgroundColor: darkMode ? "#28292c" : "white",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "15px",
              borderBottom: "2px solid #2196f3",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <h2>Selección de horarios por rango</h2>
              <Button /* onClick={} */>
                <HelpIcon />
              </Button>
            </Box>
          </Box>
          {/* ///// sección del Slider de materialUI /////  */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: sm ? "row" : "column",
              marginBottom: "45px",
            }}
          >
            {values.map((value, index) => {
              return (
                <Slider
                  sx={{
                    height: sm ? "80vh" : "20px",
                    width: sm ? "30px" : "95%",
                  }}
                  key={index}
                  value={value}
                  onChange={(event, newValue) =>
                    handleChange(event, newValue, index)
                  }
                  valueLabelDisplay="off" // Configura para que se muestre solo cuando se selecciona
                  min={0}
                  max={1440}
                  step={30}
                  orientation={sm ? "vertical" : "horizontal"}
                />
              );
            })}
            <Grid
              container
              sx={{
                marginTop: "35px",
                borderRadius: "5px",
              }}
            >
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  borderRadius: "5px 0px 0px 5px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <Box>
                  <h2>{values[0][0]} hs</h2>
                </Box>
                <h2>a</h2>

                <Box>
                  <h2>{values[0][1]} hs</h2>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  borderRadius: "0px 5px 5px 0px",
                  border: "2px solid #2196f3",
                  padding: "10px",
                }}
              >
                <Box>
                  <h2>{values[1][0]} hs</h2>
                </Box>
                <h2>a</h2>
                <Box>
                  <h2>{values[1][1]} hs</h2>
                </Box>
              </Grid>
            </Grid>
          </div>
          <Box
            sx={{
              display: "flex",
              alignSelf: "end",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              onClick={handleClose}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              sx={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
              onClick={()=>{setSubmit(true),handleClose()}}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default SliderModal;
