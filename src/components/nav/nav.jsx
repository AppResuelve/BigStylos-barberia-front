import { NavLink } from "react-router-dom";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/home2.png";
import { Button } from "@mui/material";

const Nav = ({ user }) => {
  return (
    <div
      style={{
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: " center",
        position: "fixed",
        width: "100%",
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
            <img src={toHome} alt="inicio" style={{ width: "45px" }} />
          </Button>
        </NavLink>
      </div>
      <div
        style={{
          paddingRight: "10px",
        }}
      >
        <Profile userData={user} />
      </div>
    </div>
  );
};
export default Nav;
