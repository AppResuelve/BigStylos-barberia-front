import "./login-logout.css";
import { useContext } from "react";
import googleIcon from "../../assets/icons/googleIcon.png";
import AuthContext from "../../context/AuthContext";
import { LoaderUserReady } from "../loaders/loaders";

const LoginButton = () => {
  const { googleLogin, userIsReady, setUserIsReady } = useContext(AuthContext);

  return (
    <button
      disabled={!userIsReady}
      className="btn-img-home-nav"
      onClick={() => {
        googleLogin(), setUserIsReady(false);
      }}
    >
      {userIsReady ? (
        <span className="span-btn-nav">entra con google</span>
      ) : (
        <LoaderUserReady />
      )}
      <img src={googleIcon} alt="google-icon" width={30} />
    </button>
  );
};

export default LoginButton;
