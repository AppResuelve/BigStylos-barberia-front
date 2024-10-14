import { useContext } from "react";
import "./darkMode.css";
import ThemeContext from "../../context/ThemeContext";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span>{darkMode.on ? "Oscuro" : "Claro"}</span>
      <div className="container-switch" onClick={toggleDarkMode}>
        <input
          type="checkbox"
          className="checkbox"
          checked={darkMode.on ? true : false}
          onChange={toggleDarkMode}
        />
        <label className="switch">
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};
export default DarkMode;
