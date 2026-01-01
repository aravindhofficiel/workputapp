import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import "../Components/css/Workouts.css";


export default function Workouts() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="workouts-page">
      {/* BACK ARROW */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ←
      </button>

      {/* THEME TOGGLE */}
      <button className="theme-toggle-workouts" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <h1>Workout Library</h1>

      {[...Array(20)].map((_, i) => (
        <div key={i} className="workout-card">
          Workout #{i + 1}
        </div>
      ))}
    </div>
  );
}
