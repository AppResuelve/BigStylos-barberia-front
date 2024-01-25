const getDayOrder = (day) => {
      // Asignar números del 0 al 6 a los días
      switch (day) {
            case "dom":
                  return 0;
            case "lun":
                  return 1;
            case "mar":
                  return 2;
            case "mie":
                  return 3;
            case "jue":
                  return 4;
            case "vie":
                  return 5;
            case "sab":
                  return 6;
            default:
                  return 0;
      }
}
export default getDayOrder;