import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Button, Skeleton, Box } from "@mui/material";
import noUser from "../../assets/icons/noUser.png";
import ModalMUI from "../interfazMUI/userModal";
const Profile = ({ userData }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Button
        disabled={isLoading ? true : false}
        onClick={() => setIsOpen(true)}
        style={{
          borderRadius: "50px",
          width: "0px",
        }}
      >
        {!isLoading ? (
          <img
            src={user ? user.picture : noUser}
            alt="mi perfil"
            style={{
              borderRadius: "50px",
              width: "50px",
              border: `solid 3px ${
                darkMode.on ? darkMode.light : darkMode.dark
              }`,
            }}
          />
        ) : (
          <Box style={{ position: "relative" }}>
            <Skeleton
              variant="circular"
              width={50}
              height={50}
              style={{ position: "absolute" }}
            />
            <CircularProgress
              style={{ width: "50px", height: "50px", color: "black" }}
            />
          </Box>
        )}
      </Button>
      <ModalMUI
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAuthenticated={isAuthenticated}
        googleImage={isAuthenticated ? user.picture : null}
        userData={userData}
      />
    </div>
  );
};

export default Profile;
