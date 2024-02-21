import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/homeBlack.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import DarkMode from "../interfazUiverse.io/darkMode";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box } from "@mui/system";
import "./nav.css";

const Nav = ({ user, homeImages }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const location = useLocation();
  
  return (
    <>
      {homeImages !== 1 && (
        <div
          className="container-nav"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            backgroundColor:
              (location.pathname === "/turns" && md) ||
              location.pathname === "/"
                ? "transparent"
                : darkMode.on
                ? darkMode.dark
                : darkMode.light,
            zIndex: "100",
          }}
        >
          <div>
            <NavLink to="/">
              <Box
                className="box-container-img-home-nav"
                sx={{
                  backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
                }}
              >
                <img
                  className="img-home-nav"
                  src={darkMode.on ? toHome2 : toHome}
                  alt="inicio"
                />
              </Box>
            </NavLink>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <DarkMode />
            <Profile userData={user} />
          </div>
        </div>
      )}
    </>
  );
};
export default Nav;
