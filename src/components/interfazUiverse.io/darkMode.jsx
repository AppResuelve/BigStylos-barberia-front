import "./darkMode.css";

const DarkMode = ({ darkMode, setDarkMode }) => {
  return (
    <div className={!darkMode ? "toggle-switch" : "toggle-switch-dark"}>
      <label className={!darkMode ? "switch-label" : "switch-label-dark"}>
        <input
          type="checkbox"
          className={!darkMode ? "checkbox" : "checkbox-dark"}
          onClick={() => setDarkMode(!darkMode)}
        />
        <span className={!darkMode ? "slider" : "slider-dark"}></span>
      </label>
    </div>
  );
};
export default DarkMode;
