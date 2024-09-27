import { Route, Routes } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";

export default function ProfileRoutes() {
  return (
    <Routes>
      <Route path="/:id" element={<ProfilePage />} />
    </Routes>
  );
}
