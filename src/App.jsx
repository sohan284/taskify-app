import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Login/SignUpPage";
import ProjectsPage from "./pages/ProjectsPage";
import FavouriteProjectsPage from "./pages/FavouriteProjectsPage";
import TasksPage from "./pages/TasksPage";
import TodosPage from "./pages/TodosPage";
import StatusesPage from "./pages/StatusesPage";
import UsersPage from "./pages/UsersPage";
import NotesPage from "./pages/NotesPage";
import CreateUsersPage from "./components/UsersPage/CreateUserPage";
import UpdateUserPage from "./components/UsersPage/UpdateUserPage";
import MeetingsPage from "./pages/MeetingsPage";
import ClientsPage from "./pages/ClientsPage";
import CreateClientPage from "./components/ClientsPage/CreateClientPage";
import UpdateClientPage from "./components/ClientsPage/UpdateClientPage";
import TagsPage from "./pages/TagsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/favourite" element={<FavouriteProjectsPage />} />
        <Route path="/projects/tags" element={<TagsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/statuses" element={<StatusesPage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/create" element={<CreateUsersPage />} />
        <Route path="/users/:id" element={<UpdateUserPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/create" element={<CreateClientPage />} />
        <Route path="/clients/:id" element={<UpdateClientPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignUpPage />}></Route>
    </Routes>
  );
}

export default App;
