import { useContext } from "react";
import "./darkMode.css";
import ThemeContext from "../../context/ThemeContext";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="container-toggle-darkmode">

    <div className={!darkMode.on ? "toggle-switch" : "toggle-switch-dark"}>
      <label className={!darkMode.on ? "switch-label" : "switch-label-dark"}>
        <input
          type="checkbox"
          className={!darkMode.on ? "checkbox" : "checkbox-dark"}
          onClick={toggleDarkMode}
        />
        <span className={!darkMode.on ? "slider" : "slider-dark"}></span>
      </label>
    </div>
    </div>
  );
};
export default DarkMode;
