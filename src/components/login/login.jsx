import "./login-logout.css";
import { useContext } from "react";
import googleIcon from "../../assets/icons/googleIcon.png";
import AuthContext from "../../context/AuthContext";

const LoginButton = () => {
  const { googleLogin } = useContext(AuthContext);

  return (
    <button className="btn-img-home-nav" onClick={() => googleLogin()}>
      <span className="span-btn-nav">entra con google</span>
      <img src={googleIcon} alt="google-icon" width={30} />
    </button>
  );
};

export default LoginButton;
