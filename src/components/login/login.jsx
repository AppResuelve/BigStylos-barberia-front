import "./login-logout.css";
import { useGoogleLogin } from "@react-oauth/google";
import { setCookie } from "../../helpers/cookies";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
import googleIcon from "../../assets/icons/googleIcon.png";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginButton = () => {
  const { setUserData, setRefreshStatusSession } = useContext(DarkModeContext);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
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
    flow: "auth-code",
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <button className="btn-img-home-nav" onClick={() => googleLogin()}>
      <span className="span-btn-nav">entra con google</span>
      <img src={googleIcon} alt="google-icon" width={30} />
    </button>
  );
};

export default LoginButton;
