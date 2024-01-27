import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../App";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/homeBlack.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import DarkMode from "../interfazUiverse.io/darkMode";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box } from "@mui/system";

const Nav = ({ user }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const location = useLocation();

  return (
    <div
      style={{
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: " center",
        position: "fixed",
        width: "100%",
        backgroundColor:
          (location.pathname === "/turns" && md) || location.pathname === "/"
            ? "transparent"
            : darkMode.on
            ? "#252627"
            : darkMode.light,
        zIndex: "100",
      }}
    >
      <div style={{ paddingLeft: "10px" }}>
        <NavLink to="/">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: darkMode.on ? darkMode.dark : "white",
              borderRadius: "50px",
              width: "50px",
              height: "50px",
            }}
          >
            <img
              src={darkMode.on ? toHome2 : toHome}
              alt="inicio"
              style={{
                marginBottom: "4px",
                width: "40px",
              }}
            />
          </Box>
        </NavLink>
      </div>
      <div
        style={{
          paddingRight: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DarkMode />
        <Profile userData={user} />
      </div>
    </div>
  );
};
export default Nav;
