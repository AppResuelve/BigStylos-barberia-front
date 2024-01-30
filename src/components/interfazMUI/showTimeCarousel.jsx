import { useState } from "react";
import MobileStepper from "@mui/material/MobileStepper";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import formatHour from "../../functions/formatHour";
import { Box, Button } from "@mui/material";

const ShowTimeCarousel = ({
  buttonGroup,
  selectedTime,
  setSelectedTime,
  handleSelectTime,
  button0,
}) => {
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
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {subArrays.map((subArray, index) => (
          <div key={index} style={{ display: "flex", overflow: "hidden" }}>
            {subArray.map((step, subIndex) => (
              <Button
                onClick={() => {
                  handleSelectTime(button0, step);
                  setSelectedTime(step);
                }}
                key={subIndex}
                variant="contained"
                style={{
                  backgroundColor: selectedTime === step ? "black" : "",
                  fontFamily: "Jost, sans-serif",
                  fontWeight:"bold",
                  marginRight: "10px",
                  transition: ".3s",
                }}
              >
                {formatHour(step)}
              </Button>
            ))}
          </div>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={subArrays.length}
        position="static"
        activeStep={Math.floor(activeStep / groupItemPerPage)}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep >= (subArrays.length - 1) * groupItemPerPage}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default ShowTimeCarousel;
