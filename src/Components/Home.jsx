import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import "./css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ----------------------------
  // WORKOUT STATE (1 MIN DEFAULT)
  // ----------------------------
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Workout", minutes: 1 },
  ]);

  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);
  const [timeLeft, setTimeLeft] = useState(selectedWorkout.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Add workout inputs
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState(1);

  // ----------------------------
  // TIMER EFFECT
  // ----------------------------
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // ----------------------------
  // RESET TIMER WHEN WORKOUT CHANGES
  // ----------------------------
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(selectedWorkout.minutes * 60);
  }, [selectedWorkout]);

  // ----------------------------
  // OPTIONAL COUNTDOWN VOICE (3,2,1)
  // ----------------------------
  useEffect(() => {
    if (timeLeft === 3) speak("Three");
    if (timeLeft === 2) speak("Two");
    if (timeLeft === 1) speak("One");
  }, [timeLeft]);

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  // ----------------------------
  // HELPERS
  // ----------------------------
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress =
    440 - (timeLeft / (selectedWorkout.minutes * 60)) * 440;

  const progressPercent = Math.round(
    ((selectedWorkout.minutes * 60 - timeLeft) / (selectedWorkout.minutes * 60)) * 100
  );

  // ----------------------------
  // ADD WORKOUT
  // ----------------------------
  const addWorkout = () => {
    if (!newName || newTime <= 0) return;

    const newWorkout = {
      id: Date.now(),
      name: newName,
      minutes: newTime,
    };

    setWorkouts([...workouts, newWorkout]);
    setSelectedWorkout(newWorkout);
    setNewName("");
    setNewTime(1);
  };

  // ----------------------------
  // DELETE WORKOUT
  // ----------------------------
  const deleteWorkout = (id, e) => {
    e.stopPropagation();
    if (workouts.length === 1) return;
    
    const updatedWorkouts = workouts.filter((w) => w.id !== id);
    setWorkouts(updatedWorkouts);
    
    if (selectedWorkout.id === id) {
      setSelectedWorkout(updatedWorkouts[0]);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="home-advanced">
      {/* HEADER */}
      <header className="home-header-advanced">
        <div className="header-content">
          <div className="header-text">
            <h1 className="title-advanced">Workout Timer</h1>
            <p className="subtitle-advanced">Minimal · Focused · 1-Minute Sets</p>
          </div>
          <button 
            className="theme-toggle-advanced" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            <span className="theme-icon">{theme === "light" ? "🌙" : "☀️"}</span>
          </button>
        </div>
      </header>

      <main className="home-main-advanced">
        {/* TIMER CARD - HERO SECTION */}
        <section className="timer-card-advanced">
          <div className="timer-header">
            <h2 className="timer-workout-name">{selectedWorkout.name}</h2>
            <span className="timer-duration">{selectedWorkout.minutes} min</span>
          </div>

          <div className="progress-wrapper-advanced">
            <div className="progress-container">
              <svg className="progress-ring-advanced" viewBox="0 0 160 160">
                <circle
                  className="progress-ring__bg-advanced"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="progress-ring__progress-advanced"
                  r="70"
                  cx="80"
                  cy="80"
                  style={{ strokeDashoffset: progress }}
                />
              </svg>
              <div className="progress-time-advanced">
                <span className="time-display">{formatTime(timeLeft)}</span>
                <span className="progress-percent">{progressPercent}%</span>
              </div>
            </div>
          </div>

          <div className="timer-controls-advanced">
            <button
              className={`btn-control btn-primary-advanced ${isRunning ? 'btn-pause' : 'btn-start'}`}
              onClick={() => setIsRunning((p) => !p)}
            >
              <span className="btn-icon">{isRunning ? "⏸" : "▶"}</span>
              <span>{isRunning ? "Pause" : "Start"}</span>
            </button>

            <button
              className="btn-control btn-secondary-advanced"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(selectedWorkout.minutes * 60);
              }}
            >
              <span className="btn-icon">🔁</span>
              <span>Reset</span>
            </button>
          </div>
        </section>

        {/* TWO COLUMN LAYOUT */}
        <div className="content-grid-advanced">
          {/* ADD WORKOUT SECTION */}
          <section className="add-workout-advanced">
            <div className="section-header">
              <h3 className="section-title">Add Workout</h3>
            </div>
            
            <div className="input-group-advanced">
              <input
                type="text"
                placeholder="Workout name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-advanced"
              />
              <input
                type="number"
                min="1"
                placeholder="Minutes"
                value={newTime}
                onChange={(e) => setNewTime(Number(e.target.value))}
                className="input-advanced"
              />
              <button className="btn-add-advanced" onClick={addWorkout}>
                <span className="btn-add-icon">+</span>
                Add Workout
              </button>
            </div>
          </section>

          {/* WORKOUT LIST SECTION */}
          <section className="workout-list-advanced">
            <div className="section-header">
              <h3 className="section-title">My Workouts</h3>
              <span className="workout-count">{workouts.length}</span>
            </div>

            <div className="workout-items-container">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className={`workout-item-advanced ${
                    w.id === selectedWorkout.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedWorkout(w)}
                >
                  <div className="workout-item-content">
                    <span className="workout-name">{w.name}</span>
                    <span className="workout-time">{w.minutes} min</span>
                  </div>
                  {workouts.length > 1 && (
                    <button
                      className="workout-delete-btn"
                      onClick={(e) => deleteWorkout(w.id, e)}
                      aria-label="Delete workout"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* QUICK ACTION SECTION */}
        <section className="quick-actions-advanced">
          <button
            className="btn-quick-action"
            onClick={() => navigate("/track-workout")}
          >
            <span className="quick-action-icon">📝</span>
            <div className="quick-action-content">
              <span className="quick-action-title">Track Workout</span>
              <span className="quick-action-subtitle">Log sets and reps</span>
            </div>
            <span className="quick-action-arrow">→</span>
          </button>
        </section>
      </main>
    </div>
  );
}
