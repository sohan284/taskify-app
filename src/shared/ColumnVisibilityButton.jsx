import { useState } from "react";
import { Menu, MenuItem, Checkbox, Button } from "@mui/material";
import PropTypes from "prop-types";
import { RxDropdownMenu } from "react-icons/rx";

const ColumnVisibilityButton = ({ visibleColumns, setVisibleColumns }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <>
      <Button
        size="small"
        style={{
          backgroundColor: "#7a8aa0",
          color: "white",
          marginInline: "3px",
          fontSize: "20px",
        }}
        onClick={handleClick}
      >
        <RxDropdownMenu />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: 200, // Adjust width as needed
            fontSize: "0.875rem", // Smaller font size
          },
        }}
      >
        {Object.keys(visibleColumns).map((column) => (
          <MenuItem key={column} style={{ padding: "0px 5px" }}>
            {" "}
            {/* Reduce padding */}
            <Checkbox
              size="small" // Smaller checkbox size
              checked={visibleColumns[column]}
              onChange={() => handleToggleColumn(column)}
            />
            {column.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
ColumnVisibilityButton.propTypes = {
  visibleColumns: PropTypes.string.isRequired,
  setVisibleColumns: PropTypes.func.isRequired,
};
export default ColumnVisibilityButton;
