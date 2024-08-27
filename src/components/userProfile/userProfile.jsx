import {  useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import UserPanelModal from "../interfazMUI/userPanelModal";
import noUser from "../../assets/icons/noUser.png";
import "./userProfile.css";

const Profile = () => {
  const { darkMode } = useContext(ThemeContext);
  const { userData, setIsOpenUserPanel } = useContext(AuthContext);

  return (
    <div>
      <button
        style={{ cursor: userData === 1 ? "auto" : "pointer" }}
        className="btn-userProfile"
        disabled={userData === 1 ? true : false}
        onClick={() => setIsOpenUserPanel(true)}
      >
        <img
          className="img-user-nav"
          src={userData?.image ? userData.image : noUser} // verificar linea
          alt="mi perfil"
        />
      </button>
      <UserPanelModal />
    </div>
  );
};

export default Profile;
