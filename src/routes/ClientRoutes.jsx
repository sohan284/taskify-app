import { Route, Routes } from "react-router-dom";
import ClientsPage from "../pages/ClientsPage";
import CreateClientPage from "../components/ClientsPage/CreateClientPage";
import UpdateClientPage from "../components/ClientsPage/UpdateClientPage";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientsPage />} />
      <Route path="/create" element={<CreateClientPage />} />
      <Route path="/:id" element={<UpdateClientPage />} />
    </Routes>
  );
}
