import { Route, Routes } from "react-router-dom";
import TodosPage from "../pages/TodosPage";

export default function TodosRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TodosPage />} />
    </Routes>
  );
}
