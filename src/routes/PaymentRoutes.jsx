import { Route, Routes } from "react-router-dom";
import PayPalButton from "../pages/PayPalPage/PayPalPage";

export default function PaymentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PayPalButton />} />
    </Routes>
  );
}
