import { NavLink, useLocation } from "react-router-dom";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/homeBlack.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import { Button } from "@mui/material";
import DarkMode from "../interfazUiverse.io/darkMode";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box } from "@mui/system";

const Nav = ({ user, darkMode, setDarkMode }) => {
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
            : darkMode
            ? "#252627"
            : "white",
        zIndex: "100",
      }}
    >
      <div style={{ paddingLeft: "10px" }}>
        <NavLink to="/">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems:"center",
              backgroundColor: !darkMode ? "white" : "black",
              borderRadius: "50px",
              width: "54px",
              height: "54px",
            }}
          >
            <img
              src={darkMode ? toHome2 : toHome}
              alt="inicio"
              style={{
                marginBottom:"4px",
                width: "42px",
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
        <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
        <Profile userData={user} darkMode={darkMode} />
      </div>
    </div>
  );
};
export default Nav;
