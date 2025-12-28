import React, { useEffect, useState } from "react";
import "./css/Home.css";

export default function Home() {
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
  // UI
  // ----------------------------
  return (
    <div className="home">
      {/* HEADER */}
      <header className="home-header">
        <h1 className="title">Workout Timer</h1>
        <p className="subtitle">Minimal · Focused · 1-Minute Sets</p>
      </header>

      <main className="home-main">
        {/* TIMER CARD */}
        <section className="timer-card">
          <h2>{selectedWorkout.name}</h2>

          <div className="progress-wrapper">
            <svg className="progress-ring" width="160" height="160">
              <circle
                className="progress-ring__bg"
                r="70"
                cx="80"
                cy="80"
              />
              <circle
                className="progress-ring__progress"
                r="70"
                cx="80"
                cy="80"
                style={{ strokeDashoffset: progress }}
              />
            </svg>

            <div className="progress-time">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="timer-controls">
            <button
              className="btn primary"
              onClick={() => setIsRunning((p) => !p)}
            >
              {isRunning ? "⏸ Pause" : "▶ Start"}
            </button>

            <button
              className="btn secondary"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(selectedWorkout.minutes * 60);
              }}
            >
              🔁 Reset
            </button>
          </div>
        </section>

        {/* ADD WORKOUT */}
        <section className="add-workout">
          <h3>Add Workout</h3>

          <input
            type="text"
            placeholder="Workout name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Minutes"
            value={newTime}
            onChange={(e) => setNewTime(Number(e.target.value))}
          />

          <button className="btn primary full" onClick={addWorkout}>
            Add
          </button>
        </section>

        {/* WORKOUT LIST */}
        <section className="workout-list">
          <h3>Workouts</h3>

          {workouts.map((w) => (
            <div
              key={w.id}
              className={`workout-item ${
                w.id === selectedWorkout.id ? "active" : ""
              }`}
              onClick={() => setSelectedWorkout(w)}
            >
              <span>{w.name}</span>
              <span>{w.minutes} min</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
