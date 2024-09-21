import Footer from "../shared/Footer";
import SideBar from "../shared/SideBar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <SideBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomePage;
