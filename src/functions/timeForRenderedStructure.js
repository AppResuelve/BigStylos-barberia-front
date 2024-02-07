import formatHour from "./formatHour";


const timeForRenderedStructure = (time) => {
  let ini = 0
  let fin = 0
  let ini2 = 0
  let fin2 = 0

  time.forEach((element, index) => {
    if (element != null && ini == 0){
      ini = index
    }
    if (element == null && ini != 0 && fin == 0){
      fin = index - 1
    }
    if (element != null && ini != 0 && fin != 0 && ini2 == 0){
      ini2 = index
    }
    if (element == null && ini != 0 && fin != 0 && ini2 != 0 && fin2 == 0){
      fin2 = index - 1
    }
  });

  if (ini2 != 0 && fin2 != 0) {
    return ` de ${formatHour(ini)} a ${formatHour(fin)} y de ${formatHour(ini2)} a ${formatHour(fin2)}`
  }
  return `de ${formatHour(ini)} a ${formatHour(fin)}`
};
export default timeForRenderedStructure;
