import Cookies from "js-cookie";

// Función para establecer una cookie con expiración
export function setCookie(name, value, timeToExpiration) {
  try {
    Cookies.set(name, JSON.stringify(value), {
      expires: timeToExpiration / 24,
    }); // Convertir horas a días
  } catch (error) {
    console.error("Error al establecer la cookie", error);
  }
}

// Función para obtener el value de una cookie
export function getCookie(name) {
  const cookieValue = Cookies.get(name);
  return cookieValue ? JSON.parse(cookieValue) : null;
}

// Función para eliminar una cookie
export function deleteCookie(name) {
  Cookies.remove(name);
}
