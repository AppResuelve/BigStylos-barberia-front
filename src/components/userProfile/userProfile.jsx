import { useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import UserPanelModal from "../interfazMUI/userPanelModal";
import noUser from "../../assets/icons/noUser.png";
import "./userProfile.css";

const Profile = ({
  userData,
  isOpenUserPanel,
  setIsOpenUserPanel,
  showLoginForm,
  setShowLoginForm ,
}) => {
  const { darkMode } = useContext(DarkModeContext);

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
      <UserPanelModal
        isOpen={isOpenUserPanel}
        setIsOpen={setIsOpenUserPanel}
        userData={userData}
        showLoginForm={showLoginForm}
        setShowLoginForm={setShowLoginForm}
      />
    </div>
  );
};

export default Profile;
