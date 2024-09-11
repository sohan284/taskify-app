import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Login/SignUpPage";
import ProjectsPage from "./pages/ProjectsPage";
import FavouriteProjectsPage from "./pages/FavouriteProjectsPage";
import TasksPage from "./pages/TasksPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/favourite" element={<FavouriteProjectsPage />} />
        <Route path="/tasks" element={<TasksPage/>} />
      </Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignUpPage />}></Route>
    </Routes>
  );
}

export default App;
