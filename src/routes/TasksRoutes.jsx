import { Route, Routes } from "react-router-dom";
import TasksPage from "../pages/TasksPage";

export default function TaskRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TasksPage />} />
    </Routes>
  );
}
