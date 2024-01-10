import { useEffect, useState } from "react";

const SelectedDayTurns = ({ justWorkerWithTime }) => {
  // const [indexChange, setIndexChange] = useState([] /* como se trae??? */);
  // setIndexChange([480, 720, 960, 1220]);
  console.log(justWorkerWithTime);
  let indexChange = [480, 720, 960, 1220];
  useEffect(() => {}, []);

  for (const worker in justWorkerWithTime) {
    let workerArray = justWorkerWithTime[worker][0];
    let durationService = justWorkerWithTime[worker][1];
    let index = indexChange[0];
    let consecutiveMinutes = [];

    for (let i = index; i < workerArray.length; i++) {
      let k = 0;
      console.log(i);
      if (i === indexChange) {
        return
      }
        if (indexChange[k] === i && k !== 0) {
          console.log(indexChange[k]);
          index = indexChange[k + 1];
        } else {
          if (workerArray[i] === "free") {
            for (let j = 0; j < Number(durationService); j++) {
              console.log(j);
              if (workerArray[i + j] !== "free") {
                // Si algún minuto no es "free", no es consecutivo
                index = i + j;
                break;
              }
              consecutiveMinutes.push(i + j);
              if (j <= Number(durationService)) {
                index = i + j;
              }
            }
          }
        }
    }
    console.log(consecutiveMinutes);
  }
  return (
    <div>
      <h1>Selecciona el horario</h1>
    </div>
  );
};

export default SelectedDayTurns;
