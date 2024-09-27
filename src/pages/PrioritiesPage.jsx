import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import CreatePrioritiesDialog from "../components/PrioritiesPage/CreatePrioritiesDialog";
import PrioritiesTable from "../components/PrioritiesPage/PrioritiesTable";
const PrioritiesPage = () => {
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
    <Link style={{ fontWeight: 500 }} underline="none" key="2" color="inherit">
      Priorities
    </Link>,
  ];
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
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
        </div>
      </div>
      <div>
        <PrioritiesTable />
      </div>
      {open && <CreatePrioritiesDialog open={open} onClose={handleClose} />}
    </div>
  );
};

export default PrioritiesPage;
