import { Route, Routes } from "react-router-dom";
import PrioritiesPage from "../pages/PrioritiesPage";

export default function PrioritiesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrioritiesPage />} />
    </Routes>
  );
}
