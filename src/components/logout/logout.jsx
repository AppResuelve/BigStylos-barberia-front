import { deleteCookie } from "../../helpers/cookies";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
import logOutIcon from "../../assets/icons/log-out.png";
import "../login/login-logout.css";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { setRefreshStatusSession, setIsOpenUserPanel } =
    useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    deleteCookie("IDSESSION");
    setRefreshStatusSession((prev) => {
      const prevStatusSession = prev;
      return !prevStatusSession;
    });
    setIsOpenUserPanel(false);
    navigate("/");
  };
  return (
    <button
      className="btn-loginout-login"
      style={{
        bottom: "calc(0% + 20px)",
        left: "calc(0% + 20px)",
        borderRadius: "50px",
      }}
      onClick={handleLogOut}
    >
      <img src={logOutIcon} alt="logout" width={30} />
      <span className="span-btn-nav">Salir</span>
    </button>
  );
};

export default LogoutButton;
