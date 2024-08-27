import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/home.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import { CircularProgress } from "@mui/material";
import LoginButton from "../login/login";
import UserPanelModal from "../interfazMUI/userPanelModal";
import "./nav.css";

const Nav = ({ homeImages }) => {
  const { darkMode } = useContext(ThemeContext);
  const { userData } = useContext(AuthContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const location = useLocation();

  return (
    <>
      {homeImages !== 1 && (
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
            {userData === 1 ? (
              <CircularProgress
                size={43}
                sx={{ color: "black", display: "flex" }}
              />
            ) : userData === false ? (
              <>
                <LoginButton />
                <UserPanelModal />
              </>
            ) : (
              <Profile />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Nav;
