import Footer from "../shared/Footer";
import SideBar from "../shared/SideBar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-container">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
