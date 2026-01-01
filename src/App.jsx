import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Home from "./Components/Home.jsx";
import Workouts from "./pages/Workouts.jsx";
import TrackWorkout from "./pages/TrackWorkout.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/track-workout" element={<TrackWorkout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
