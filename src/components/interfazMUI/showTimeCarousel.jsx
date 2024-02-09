import { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import MobileStepper from "@mui/material/MobileStepper";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import formatHour from "../../functions/formatHour";
import { Box, Button } from "@mui/material";

const ShowTimeCarousel = ({
  selectedWorker,
  buttonGroup,
  selectedTime,
  setSelectedTime,
  handleSelectTime,
  button0,
  button1,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const itemsPerPage = 10;
  const groupItemPerPage = 1;

  // Divide el array en subarrays con la longitud de itemsPerPage
  const subArrays = [];
  for (let i = 0; i < buttonGroup.length; i += itemsPerPage) {
    subArrays.push(buttonGroup.slice(i, i + itemsPerPage));
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + groupItemPerPage);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - groupItemPerPage);
  };

  const handleStepChange = (step) => {
    console.log(step);
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {subArrays.map((subArray, index) => {
          return (
            <div key={index} style={{ display: "flex", overflow: "scroll" }}>
              {subArray.map((step, subIndex) => (
                <Button
                  onClick={() => {
                    handleSelectTime(button0, button1);
                    setSelectedTime(step);
                  }}
                  key={subIndex}
                  variant="contained"
                  style={{
                    backgroundColor:
                      selectedTime === step &&
                      selectedWorker === button0 &&
                      darkMode.on
                        ? "white"
                        : selectedTime === step &&
                          selectedWorker === button0 &&
                          !darkMode.on
                        ? "black"
                        : "",
                    color:
                      selectedTime === step &&
                      selectedWorker === button0 &&
                      darkMode.on
                        ? "black"
                        : "white",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    marginRight: "10px",
                    transition: ".3s",
                  }}
                >
                  {formatHour(step)}
                </Button>
              ))}
            </div>
          );
        })}
      </SwipeableViews>
      <MobileStepper
        style={{
          height: "40px",
          backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
        }}
        steps={subArrays.length}
        position="static"
        activeStep={Math.floor(activeStep / groupItemPerPage)}
        nextButton={
          <Button
            style={{ border: "2px solid" }}
            size="large"
            variant="outlined"
            onClick={handleNext}
            disabled={activeStep >= (subArrays.length - 1) * groupItemPerPage}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            style={{ border: "2px solid" }}
            size="large"
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </Box>
  );
};

export default ShowTimeCarousel;
