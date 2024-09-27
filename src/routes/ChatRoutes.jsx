import { Route, Routes } from "react-router-dom";
import ChatPage from "../pages/ChatPage";

export default function ChatRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
    </Routes>
  );
}
