import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Abilities from "../pages/Abilities";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habilidades" element={<Abilities />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
