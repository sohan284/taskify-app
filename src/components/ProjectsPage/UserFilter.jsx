import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import UserManagement from "../../service/User";

const UserFilter = ({ userFilter, handleUserFilter }) => {
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
          value={userFilter || "Select User"}
          defaultValue="Select User"
          onChange={handleUserFilter}
        >
          <MenuItem
            style={{ color: "gray", fontSize: "14px" }}
            value="Select User"
          >
            Select User
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

UserFilter.propTypes = {
  userFilter: PropTypes.string.isRequired,
  handleUserFilter: PropTypes.func.isRequired,
};

export default UserFilter;
