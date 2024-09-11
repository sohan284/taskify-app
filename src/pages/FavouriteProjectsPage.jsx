import ProjectsTable from "../components/ProjectsPage/ProjectsTable";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { IoGridSharp } from "react-icons/io5";
import { useState } from "react";
import CreateProjectDialog from "../components/ProjectsPage/CreateProjectDialog";
import ProjectManagement from "../service/Project";
const FavouriteProjectsPage = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  function handleClick(event) {
    event.preventDefault();
    navigate(`${event}`);
  }
  const breadcrumbs = [
    <Link
      style={{ fontWeight: 400 }}
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => handleClick("/")}
    >
      Home
    </Link>,
    <Link
      style={{ fontWeight: 400 }}
      underline="hover"
      key="2"
      color="inherit"
      href="/projects"
      onClick={() => handleClick("/projects")}
    >
      Projects
    </Link>,
    <Link style={{ fontWeight: 500 }} underline="none" key="2" color="inherit">
      Favourite
    </Link>,
  ];
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="lg:ml-64 mt-20 sm:ml-64">
      <div className="flex justify-between">
        <Stack className="py-5" spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <div className="mt-6 flex h-8">
          <div
            onClick={() => setOpen(true)}
            className="bg-[#6479f3] text-lg mr-1 px-3 pt-2 hover:text-xl rounded text-white"
          >
            <IoMdAdd />
          </div>
          <div className="bg-[#6479f3] text-lg mr-5 px-3 pt-2 rounded hover:text-xl text-white">
            <IoGridSharp />
          </div>
        </div>
      </div>
      <div>
        <ProjectsTable API={ProjectManagement.getFavouriteProjectList} />
      </div>
      <CreateProjectDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default FavouriteProjectsPage;
