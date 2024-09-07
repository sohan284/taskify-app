import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";

const membersData = [
  {
    id: 1,
    title: "Project Alpha",
    users: 5,
    clients: "Company A",
    status: "started",
  },
  {
    id: 2,
    title: "Project Beta",
    users: 8,
    clients: "Company B",
    status: "defaults",
  },
  {
    id: 3,
    title: "Project Gamma",
    users: 12,
    clients: "Company C",
    status: "started",
  },
];

const CustomTable = () => {
  const [members, setMembers] = useState(membersData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleColumns] = useState({
    id: true,
    title: true,
    users: true,
    clients: true,
    status: true,
  });

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(members.map((member) => member.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    setMembers(members.filter((member) => !selectedIds.includes(member.id)));
    setSelectedIds([]);
  };

  const handleSaveVisibility = () => {
    console.log("Column visibility settings saved:", visibleColumns);
  };

  return (
    <Paper>
      <div style={{ margin: "10px" }}>
        <Button
          variant="contained"
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          sx={{
            marginRight: "10px",
            backgroundColor: "white",
            border: "1px solid #FF474C",
            color: "#FF474C",
            "&:hover": {
              backgroundColor: "#FF474C",
              color: "white",
            },
          }}
        >
          <DeleteOutlineIcon className="mr-1" /> Delete Selected
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveVisibility}
          sx={{
            backgroundColor: "white",
            border: "1px solid #3f51b5",
            color: "#3f51b5",
            "&:hover": {
              backgroundColor: "#3f51b5",
              color: "white",
            },
          }}
        >
          <SaveOutlinedIcon className="mr-1" /> Save Column Visibility
        </Button>
      </div>

      <TableContainer>
        <Table
          sx={{
            border: "1px solid gray",
            "& th, & td": { border: "1px solid gray" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < members.length
                  }
                  checked={
                    members.length > 0 && selectedIds.length === members.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {visibleColumns.id && <TableCell>ID</TableCell>}
              {visibleColumns.title && <TableCell>Title</TableCell>}
              {visibleColumns.users && <TableCell>Users</TableCell>}
              {visibleColumns.clients && <TableCell>Clients</TableCell>}
              {visibleColumns.status && <TableCell>Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(member.id)}
                    onChange={() => handleSelect(member.id)}
                  />
                </TableCell>
                {visibleColumns.id && <TableCell>{member.id}</TableCell>}
                {visibleColumns.title && <TableCell>{member.title}</TableCell>}
                {visibleColumns.users && <TableCell>{member.users}</TableCell>}
                {visibleColumns.clients && (
                  <TableCell sx={{ margin: 5 }}>
                    <div className="bg-[#8761df] text-white uppercase rounded text-center p-0.5">
                      {member.clients}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell>{member.status}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomTable;
