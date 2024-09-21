import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Login/SignUpPage";

// Grouped route imports
import ProjectRoutes from "./routes/ProjectRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import TaskRoutes from "./routes/TasksRoutes";
import NoteRoutes from "./routes/NotesRoutes";
import MeetingRoutes from "./routes/MeetingRoutes";
import UserRoutes from "./routes/UserRoutes";
import StatusesRoutes from "./routes/StatusesRoutes";
import TodosRoutes from "./routes/TodosRoutes";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Authenticated routes */}
      <Route path="/" element={<HomePage />}>
        <Route path="/" element={<DashboardPage />} />
        {/* Grouped feature routes */}
        <Route path="users/*" element={<UserRoutes />} />
        <Route path="projects/*" element={<ProjectRoutes />} />
        <Route path="clients/*" element={<ClientRoutes />} />
        <Route path="tasks/*" element={<TaskRoutes />} />
        <Route path="statuses/*" element={<StatusesRoutes />} />
        <Route path="todos/*" element={<TodosRoutes />} />
        <Route path="notes/*" element={<NoteRoutes />} />
        <Route path="meetings/*" element={<MeetingRoutes />} />
      </Route>
    </Routes>
  );
}

export default App;
