import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import LoadAndRefreshContext from "../../context/LoadAndRefreshContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import toHome from "../../assets/icons/home.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import UserPanelModal from "../interfazMUI/userPanelModal";
import LoginButton from "../login/loginButton";
import noUser from "../../assets/icons/noUser.png";
import "./nav.css";

const Nav = () => {
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const { darkMode } = useContext(ThemeContext);
  const { userData, isOpenUserPanel, setIsOpenUserPanel } =
    useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      <div className="container-nav">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <button className="btn-img-home-nav">
            <img
              className="img-home-nav"
              src={darkMode.on ? toHome2 : toHome}
              alt="inicio"
            />
            <span className="span-btn-nav">
              {location.pathname !== "/"
                ? "volver a inicio"
                : "estás en inicio"}
            </span>
          </button>
        </NavLink>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {userData === false ? (
            <LoginButton />
          ) : (
            <button
              className="btn-userProfile"
              onClick={() => setIsOpenUserPanel(true)}
            >
              <img
                className="img-user-nav"
                src={userData.image || noUser}
                alt="mi perfil"
              />
            </button>
          )}
        </div>
        {isOpenUserPanel && <UserPanelModal />}
      </div>
    </>
  );
};
export default Nav;
