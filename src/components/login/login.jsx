import "./login-logout.css";
import { useGoogleLogin } from "@react-oauth/google";
import { setCookie } from "../../helpers/cookies";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
import axios from "axios";
import googleIcon from "../../assets/icons/googleIcon.png";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginButton = () => {
  const { setUserData, setRefreshStatusSession } = useContext(DarkModeContext);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const response = await axios.post(
        `${VITE_BACKEND_URL}/users/createGoogle`,
        { code: codeResponse.code }
      );
      setCookie("IDSESSION", response.data.email, 6);
      setUserData(response.data);
      setRefreshStatusSession((prev) => {
        const prevStatusSession = prev;
        return !prevStatusSession;
      });
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <button
      variant="contained"
      style={{
        padding: "5px",
        width: "140px",
        border: "none",
        fontFamily: "Jost, sans-serif",
        borderRadius: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={() => googleLogin()}
    >
      <span>entra con google</span>
      <img src={googleIcon} alt="" width={30} />
    </button>
  );
};

export default LoginButton;
