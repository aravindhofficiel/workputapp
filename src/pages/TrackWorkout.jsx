import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import "../Components/css/TrackWorkout.css";

export default function TrackWorkout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: [{ reps: "", weight: "" }],
  });

  // Add a new exercise to the workout
  const addExercise = () => {
    if (!currentExercise.name.trim()) return;

    setExercises([...exercises, { ...currentExercise, id: Date.now() }]);
    setCurrentExercise({
      name: "",
      sets: [{ reps: "", weight: "" }],
    });
  };

  // Add a new set to the current exercise
  const addSet = () => {
    setCurrentExercise({
      ...currentExercise,
      sets: [...currentExercise.sets, { reps: "", weight: "" }],
    });
  };

  // Update a set in the current exercise
  const updateSet = (index, field, value) => {
    const updatedSets = [...currentExercise.sets];
    updatedSets[index][field] = value;
    setCurrentExercise({
      ...currentExercise,
      sets: updatedSets,
    });
  };

  // Remove a set from the current exercise
  const removeSet = (index) => {
    if (currentExercise.sets.length === 1) return;
    const updatedSets = currentExercise.sets.filter((_, i) => i !== index);
    setCurrentExercise({
      ...currentExercise,
      sets: updatedSets,
    });
  };

  // Remove an exercise from the workout
  const removeExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  // Save workout
  const saveWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) return;
    
    const workout = {
      id: Date.now(),
      name: workoutName,
      exercises: exercises,
      date: new Date().toISOString(),
    };

    // Save to localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem("trackedWorkouts") || "[]");
    savedWorkouts.push(workout);
    localStorage.setItem("trackedWorkouts", JSON.stringify(savedWorkouts));

    // Reset form
    setWorkoutName("");
    setExercises([]);
    setCurrentExercise({
      name: "",
      sets: [{ reps: "", weight: "" }],
    });

    alert("Workout saved successfully!");
  };

  return (
    <div className="track-workout-page">
      {/* BACK ARROW */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ←
      </button>

      {/* THEME TOGGLE */}
      <button
        className="theme-toggle-track"
        onClick={toggleTheme}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="track-workout-container">
        <h1>Track Workout</h1>

        {/* WORKOUT NAME */}
        <section className="workout-name-section">
          <input
            type="text"
            placeholder="Workout Name (e.g., Push Day, Leg Day)"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="workout-name-input"
          />
        </section>

        {/* CURRENT EXERCISE INPUT */}
        <section className="current-exercise-section">
          <h2>Add Exercise</h2>
          
          <input
            type="text"
            placeholder="Exercise Name"
            value={currentExercise.name}
            onChange={(e) =>
              setCurrentExercise({ ...currentExercise, name: e.target.value })
            }
            className="exercise-name-input"
          />

          <div className="sets-container">
            <div className="sets-header">
              <span>Sets</span>
              <button className="btn-add-set" onClick={addSet}>
                + Add Set
              </button>
            </div>

            {currentExercise.sets.map((set, index) => (
              <div key={index} className="set-row">
                <span className="set-number">Set {index + 1}</span>
                <input
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="set-input reps-input"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="set-input weight-input"
                />
                {currentExercise.sets.length > 1 && (
                  <button
                    className="btn-remove-set"
                    onClick={() => removeSet(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="btn primary full" onClick={addExercise}>
            Add Exercise
          </button>
        </section>

        {/* ADDED EXERCISES */}
        {exercises.length > 0 && (
          <section className="exercises-list-section">
            <h2>Exercises ({exercises.length})</h2>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-header">
                  <h3>{exercise.name}</h3>
                  <button
                    className="btn-remove-exercise"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="exercise-sets">
                  {exercise.sets.map((set, index) => (
                    <div key={index} className="exercise-set-item">
                      <span>Set {index + 1}:</span>
                      <span>{set.reps || "-"} reps</span>
                      <span>{set.weight || "-"} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SAVE BUTTON */}
        {exercises.length > 0 && workoutName.trim() && (
          <button className="btn primary full save-workout-btn" onClick={saveWorkout}>
            Save Workout
          </button>
        )}
      </div>
    </div>
  );
}