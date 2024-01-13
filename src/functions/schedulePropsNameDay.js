function schedulePropsNameDay(original) {
  const weekDays = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

  const newFormat = {};

  Object.keys(original).forEach((key, index) => {
    newFormat[weekDays[index]] = {
      open: original[key].open,
      close: original[key].close,
    };
  });

  return newFormat;
}
export default schedulePropsNameDay;
