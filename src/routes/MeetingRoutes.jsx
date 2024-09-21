import { Route, Routes } from "react-router-dom";
import MeetingsPage from "../pages/MeetingsPage";

export default function MeetingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MeetingsPage />} />
    </Routes>
  );
}
