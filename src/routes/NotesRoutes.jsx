import { Route, Routes } from "react-router-dom";
import NotesPage from "../pages/NotesPage";

export default function NoteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NotesPage />} />
    </Routes>
  );
}
