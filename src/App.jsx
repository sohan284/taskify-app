import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PaymentRoutes from "./routes/PaymentRoutes";
import Loading from "./shared/Loading";
import ProtectedRoute from "./routes/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const SignUpPage = lazy(() => import("./pages/Login/SignUpPage"));

// Lazy load grouped route imports
const ProjectRoutes = lazy(() => import("./routes/ProjectRoutes"));
const ClientRoutes = lazy(() => import("./routes/ClientRoutes"));
const TaskRoutes = lazy(() => import("./routes/TasksRoutes"));
const NoteRoutes = lazy(() => import("./routes/NotesRoutes"));
const MeetingRoutes = lazy(() => import("./routes/MeetingRoutes"));
const UserRoutes = lazy(() => import("./routes/UserRoutes"));
const StatusesRoutes = lazy(() => import("./routes/StatusesRoutes"));
const TodosRoutes = lazy(() => import("./routes/TodosRoutes"));

function App() {
  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Authenticated routes */}
        <Route path="/" element={<HomePage />}>
          <Route
            path="/"
            element={<ProtectedRoute element={<DashboardPage />} />}
          />
          {/* Grouped feature routes */}
          <Route
            path="users/*"
            element={<ProtectedRoute element={<UserRoutes />} />}
          />
          <Route
            path="projects/*"
            element={<ProtectedRoute element={<ProjectRoutes />} />}
          />
          <Route
            path="clients/*"
            element={<ProtectedRoute element={<ClientRoutes />} />}
          />
          <Route
            path="tasks/*"
            element={<ProtectedRoute element={<TaskRoutes />} />}
          />
          <Route
            path="statuses/*"
            element={<ProtectedRoute element={<StatusesRoutes />} />}
          />
          <Route
            path="todos/*"
            element={<ProtectedRoute element={<TodosRoutes />} />}
          />
          <Route
            path="notes/*"
            element={<ProtectedRoute element={<NoteRoutes />} />}
          />
          <Route
            path="meetings/*"
            element={<ProtectedRoute element={<MeetingRoutes />} />}
          />
          <Route
            path="payment/*"
            element={<ProtectedRoute element={<PaymentRoutes />} />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
