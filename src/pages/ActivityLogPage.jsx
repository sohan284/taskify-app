import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import LogsTable from "../components/ActivityLogPage/LogsTable";
const ActivityLogPage = () => {
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
      Activity Log
    </Link>,
  ];

  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      <div className="flex justify-between">
        <Stack className="py-5" spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </div>
      <div>
        <LogsTable />
      </div>
    </div>
  );
};

export default ActivityLogPage;
