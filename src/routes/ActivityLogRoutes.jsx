import { Route, Routes } from "react-router-dom";
import ActivityLogPage from "../pages/ActivityLogPage";

export default function ActivityLogRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ActivityLogPage />} />
    </Routes>
  );
}
