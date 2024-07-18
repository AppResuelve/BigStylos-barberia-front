import { getCookie } from "./cookies";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const authenticateUsers = async () => {
  const idSession = getCookie("IDSESSION");
  let objResult = {
    user: {},
    auth: false,
  };
  console.log(idSession);
  if (idSession) {
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/users/byemail`, {
        email: idSession,
      });
      console.log(response.data);
      objResult.user = response.data;
      objResult.auth = true;
    } catch (error) {
      console.log(error);
    }
  } else {
  }
  return objResult;
};

export default authenticateUsers;
