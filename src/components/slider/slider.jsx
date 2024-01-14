import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";
import time from "../../helpers/arrayTime";

const theme = createTheme();

const SliderCustom = () => {
    const [values, setValues] = useState([[0, 10], [30, 37]]); // Solo 2 rangos
    console.log(values)

    const marks = time

    const handleChange = (event, newValue, index) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);
    };

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: isSmallScreen ? "row" : "column", width: isSmallScreen ? "30vw" : "90vw", height: isSmallScreen ? "95vh" : "30vh"}}>
                {values.map((value, index) => (
                    <Slider
                        key={index}
                        value={value}
                        onChange={(event, newValue) => handleChange(event, newValue, index)}
                        valueLabelDisplay="on"  // Configura para que se muestre solo cuando se selecciona
                        min={0}
                        max={1440}
                        step={30}
                        marks={marks.map((mark) => {
                            if (index === 0) { // Solo renderiza los markLabels para el primer slider
                                return {
                                    ...mark,
                                    label: (
                                        <span
                                            key={mark.value}
                                            style={{
                                                borderRadius: "5px",
                                                padding: "4px",
                                                color: values.some(([start, end]) => mark.value >= start && mark.value <= end) ? "white" : "",
                                                writingMode: isSmallScreen ? "horizontal" : "vertical-lr",
                                                backgroundColor: values.some(([start, end]) => mark.value >= start && mark.value <= end) ? "#232bd16e" : "",
                                            }}
                                        >
                                            {mark.label}
                                        </span>
                                    ),
                                };
                            } else {
                                return {
                                    ...mark,
                                    label: null, // Si no es el primer slider, no renderiza markLabels
                                };
                            }
                        })}
                        orientation={isSmallScreen ? "vertical" : "horizontal"}
                    />
                ))}
            </div>
        </ThemeProvider>
    );
};

export default SliderCustom;
