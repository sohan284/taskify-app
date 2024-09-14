import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import UserManagement from "../../service/User";

const ClientFilter = ({ clientFilter, handleClientFilter }) => {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    UserManagement.getUserList().then((res) => setUsers(res.data));
  }, []);
  return (
    <div>
      <FormControl fullWidth size="small">
        <Select
          style={{ color: "gray" }}
          className="w-full h-8"
          value={clientFilter || "Select Client"}
          defaultValue="Select Client"
          onChange={handleClientFilter}
        >
          <MenuItem
            style={{ color: "gray", fontSize: "14px" }}
            value="Select Client"
          >
            Select Client
          </MenuItem>
          {users?.map((user) => (
            <MenuItem
              style={{ color: "gray", fontSize: "14px" }}
              key={user._id}
              value={user?._id}
            >
              {user.displayName ? user.displayName : user.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

ClientFilter.propTypes = {
  clientFilter: PropTypes.string.isRequired,
  handleClientFilter: PropTypes.func.isRequired,
};

export default ClientFilter;
