import { Routes, Route } from "react-router-dom";
import UsersPage from "../pages/UsersPage";
import CreateUsersPage from "../components/UsersPage/CreateUserPage";
import UpdateUserPage from "../components/UsersPage/UpdateUserPage";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/create" element={<CreateUsersPage />} />
      <Route path="/:id" element={<UpdateUserPage />} />
    </Routes>
  );
}
