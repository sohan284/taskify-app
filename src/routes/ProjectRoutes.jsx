import { Routes, Route } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import FavouriteProjectsPage from "../pages/FavouriteProjectsPage";
import TagsPage from "../pages/TagsPage";

export default function ProjectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/favourite" element={<FavouriteProjectsPage />} />
      <Route path="/tags" element={<TagsPage />} />
    </Routes>
  );
}
