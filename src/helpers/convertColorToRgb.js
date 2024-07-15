import tinycolor from "tinycolor2";

// Funcion que recibe el darkMode.light o el darkMode.dark de la base de datos,
// devuelve un obj ej: {r:0,g:0,b:0}, su utilidad es para los boxShadow, dropShadow que solo funcionan con formato rgb(0,0,0,0.5)
 export const convertToRGB = (color) => {
   const rgbColor = tinycolor(color).toRgb();
   return rgbColor;
 };