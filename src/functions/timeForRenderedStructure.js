const timeForRenderedStructure = (month, day, days) => {
  let ini;
  let fin;
  let bandera1 = 0;
  let bandera2;

  days[month][day].time.forEach((element, index) => {
    if (bandera1 === 0) {
      if (element !== null) {
        ini = index;
        bandera1 = index;
      }
    }
  });
};
export default timeForRenderedStructure;
