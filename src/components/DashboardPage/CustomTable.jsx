import { useState } from "react";
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
  { id: 1, name: "John Doe", birthday: "1990-05-15" },
  { id: 2, name: "Jane Smith", birthday: "1988-10-10" },
  { id: 3, name: "Alice Brown", birthday: "1992-12-22" },
];

const calculateDaysLeft = (birthday) => {
  const today = new Date();
  const nextBirthday = new Date(
    today.getFullYear(),
    new Date(birthday).getMonth(),
    new Date(birthday).getDate()
  );
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const timeDiff = nextBirthday - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

const CustomTable = () => {
  const [members, setMembers] = useState(membersData);
  const [selectedIds, setSelectedIds] = useState([]);

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

  return (
    <Paper>
      <Button
        variant="contained"
        onClick={handleDeleteSelected}
        disabled={selectedIds.length === 0}
        sx={{
            margin: "10px",
            backgroundColor: "white",
            border: "1px solid  #FF474C",
            color: ' #FF474C',
            '&:hover': {
              backgroundColor: ' #FF474C',
              color: 'white',
            }
        }}
      >
        Delete Selected
      </Button>
      <TableContainer>
        <Table>
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
              <TableCell>ID</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Birthday Date</TableCell>
              <TableCell>Days Left</TableCell>
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
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.birthday}</TableCell>
                <TableCell>{calculateDaysLeft(member.birthday)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomTable;
