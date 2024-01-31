import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Button, Skeleton, Box } from "@mui/material";
import noUser from "../../assets/icons/noUser.png";
import ModalMUI from "../interfazMUI/userModal";
import "./userProfile.css";

const Profile = ({ userData }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div >
      <button
        className="btn-userProfile"
        disabled={isLoading ? true : false}
        onClick={() => setIsOpen(true)}
      >
        {!isLoading ? (
          <img
            className="img-user-nav"
            src={user ? user.picture : noUser}
            alt="mi perfil"
          />
        ) : (
          <Box>
              <CircularProgress size={43} sx={{color:"black",display:"flex"}} />
          </Box>
        )}
      </button>
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
