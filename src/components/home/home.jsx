import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../footer/footer";
import "./home.css";


const Home = ({ user }) => {

  return (
    <div>
      {user.worker && (
        <NavLink to="/worker">
          <button>admin worker</button>
        </NavLink>
      )}
      <NavLink to="/turns">
        <button>reserva tu turno</button>
      </NavLink>

      <Footer />
    </div>
  );
};
export default Home;
