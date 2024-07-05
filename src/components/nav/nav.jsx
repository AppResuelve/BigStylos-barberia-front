import { NavLink, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../App";
import Profile from "../userProfile/userProfile";
import toHome from "../../assets/icons/homeBlack.png";
import toHome2 from "../../assets/icons/homeWhite.png";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, CircularProgress } from "@mui/material";
import "./nav.css";
import LoginButton from "../login/login";
import UserPanelModal from "../interfazMUI/userPanelModal";

const Nav = ({ homeImages }) => {
  const { darkMode, userData } = useContext(DarkModeContext);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isOpenUserPanel, setIsOpenUserPanel] = useState(false);

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
            {userData === 1 ? (
              <CircularProgress
                size={43}
                sx={{ color: "black", display: "flex" }}
              />
            ) : userData === false ? (
              <>
                <LoginButton
                  setShowLoginForm={setShowLoginForm}
                  setIsOpenUserPanel={setIsOpenUserPanel}
                />
                <UserPanelModal
                  isOpen={isOpenUserPanel}
                  setIsOpen={setIsOpenUserPanel}
                  userData={userData}
                  showLoginForm={showLoginForm}
                  setShowLoginForm={setShowLoginForm}
                />
              </>
            ) : (
              <Profile
                userData={userData}
                isOpenUserPanel={isOpenUserPanel}
                setIsOpenUserPanel={setIsOpenUserPanel}
                showLoginForm={showLoginForm}
                setShowLoginForm={setShowLoginForm}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Nav;
