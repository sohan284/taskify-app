import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";

const StatusFilter = ({ statusFilter, handleStatusFilter }) => {
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
          <MenuItem style={{ color: "gray", fontSize: "14px" }} value="default">
            Default
          </MenuItem>
          <MenuItem style={{ color: "gray", fontSize: "14px" }} value="started">
            Started
          </MenuItem>
          <MenuItem
            style={{ color: "gray", fontSize: "14px" }}
            value="in review"
          >
            In Review
          </MenuItem>
          <MenuItem
            style={{ color: "gray", fontSize: "14px" }}
            value="on going"
          >
            On Going
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

StatusFilter.propTypes = {
  statusFilter: PropTypes.string.isRequired,
  handleStatusFilter: PropTypes.func.isRequired,
};

export default StatusFilter;
