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

// Función para establecer un valor en el localStorage
export function setLocalStorage(name, value) {
  try {
    const encryptedValue = encryptData(value);
    localStorage.setItem(name, encryptedValue);
  } catch (error) {
    console.error("Error al establecer el localStorage", error);
  }
}

// Función para obtener el valor de localStorage
export function getLocalStorage(name) {
  try {
    const storedValue = localStorage.getItem(name);
    return storedValue ? decryptData(storedValue) : null;
  } catch (error) {
    console.error("Error al obtener el localStorage", error);
    return null;
  }
}

// Función para eliminar un valor del localStorage
export function deleteLocalStorage(name) {
  localStorage.removeItem(name);
}
