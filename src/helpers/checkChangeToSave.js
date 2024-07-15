// Esta funcion recibe el estado local "changeNoSaved", para que funcione debe ejecutarse dentro del seteo del estado
// antes de retornar el copyState (esto se hace para que la funcion trabaje con la ultima actualizacion).
// Luego de la ejecucion, se pregunta if (!check) copyState = {};
export const checkChangeToSave = (changeNoSaved) => {
  let check = false;
  for (const componentProp in changeNoSaved) {
    if (changeNoSaved[componentProp]) {
      check = true;
      break;
    }
  }
  return check;
};
