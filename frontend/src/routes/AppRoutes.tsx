import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Abilities from "../pages/Abilities";
import Match from '../pages/Match';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habilidades" element={<Abilities />} />
      <Route path="/partida/:roomId" element={<Match />} />
    </Routes>
  );
}
