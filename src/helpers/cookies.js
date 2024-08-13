import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const secretKey = "your-secret-key"; // Cambia esto por una clave secreta fuerte

// Función para cifrar datos
function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Función para descifrar datos
function decryptData(data) {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Función para establecer una cookie con expiración
export function setCookie(name, value, timeToExpiration) {
  try {
    const encryptedValue = encryptData(value);
    Cookies.set(name, encryptedValue, {
      expires: timeToExpiration / 1440, // Convertir minutos a días
    });
  } catch (error) {
    console.error("Error al establecer la cookie", error);
  }
}

// Función para obtener el value de una cookie
export function getCookie(name) {
  try {
    const cookieValue = Cookies.get(name);
    return cookieValue ? decryptData(cookieValue) : null;
  } catch (error) {
    console.error("Error al obtener la cookie", error);
    return null;
  }
}

// Función para eliminar una cookie
export function deleteCookie(name) {
  Cookies.remove(name);
}
