import { Route, Routes } from "react-router-dom";
import StatusesPage from "../pages/StatusesPage";

export default function StatusesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StatusesPage />} />
    </Routes>
  );
}
