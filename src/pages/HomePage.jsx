import SideBar from '../shared/SideBar';
import { Outlet } from 'react-router-dom';


const HomePage = () => {

    return (
        <div>
            <SideBar />
            <Outlet />
        </div>
    );
};

export default HomePage;