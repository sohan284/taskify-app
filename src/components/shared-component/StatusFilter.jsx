import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import StatusManagement from "../../service/Status";
import { useDispatch } from "react-redux";
import { setFilter } from "../../store/features/projectSlice";

const StatusFilter = ({ statusFilter, setStatusFilter }) => {
  const dispatch = useDispatch();
  const [statuses, setStatuses] = useState();
  useEffect(() => {
    StatusManagement.getStatusList().then((res) => setStatuses(res.data));
  }, []);
  const handleStatusFilter = (event) => {
    if (event.target.value === "Select Status") {
      setStatusFilter("");
    } else {
      setStatusFilter(event.target.value);
    }
    dispatch(setFilter(true));
  };
  return (
    <div>
      <FormControl fullWidth size="small">
        <Select
          style={{ color: "gray" }}
          className="w-full h-8"
          value={statusFilter || "Select Status"}
          defaultValue="Select Status"
          onChange={handleStatusFilter}
        >
          <MenuItem
            style={{ color: "gray", fontSize: "14px" }}
            value="Select Status"
          >
            Select Status
          </MenuItem>
          {statuses?.map((status) => (
            <MenuItem
              key={status?.id}
              style={{ color: "gray", fontSize: "14px" }}
              value={status?.title}
            >
              {status?.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

StatusFilter.propTypes = {
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.string.isRequired,
};

export default StatusFilter;
