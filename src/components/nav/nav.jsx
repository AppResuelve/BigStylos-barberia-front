import { NavLink } from "react-router-dom";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/homeBlack.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import { Button } from "@mui/material";
import DarkMode from "../interfazUiverse.io/darkMode";

const Nav = ({ user, darkMode, setDarkMode }) => {
  return (
    <div
      style={{
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: " center",
        position: "fixed",
        width: "100%",
        backgroundColor: darkMode ? "#252627" : "white",
        zIndex: "100",
      }}
    >
      <div style={{ paddingLeft: "10px" }}>
        <NavLink to="/">
          <Button
            style={{
              borderRadius: "50px",
              width: "0px",
            }}
          >
            <img
              src={darkMode ? toHome2 : toHome}
              alt="inicio"
              style={{ width: "45px" }}
            />
          </Button>
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
