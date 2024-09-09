import { useEffect, useState } from "react";
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
  TablePagination,
} from "@mui/material";
import DashboardManagement from "../../../service/Dashboard";

import { RiDeleteBinLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import UpdateProjectDialog from "./UpdateProjectDialog";
import { FaRegEdit } from "react-icons/fa";

const CustomTable = () => {
  const [user] = useAuthState(auth);
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleColumns] = useState({
    id: true,
    title: true,
    users: true,
    clients: true,
    status: true,
    priority: true,
    startsAt: true,
    endsAt: true,
    budget: true,
    tags: true,
    options: true,
  });

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DashboardManagement.getProjectList();
        setMembers(result?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
    setMembers(members?.filter((member) => !selectedIds.includes(member.id)));
    setSelectedIds([]);
  };

  const handleSaveVisibility = () => {};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProject(null);
  };

  const handleSaveDialog = () => {};

  return (
    <div>
      <Paper>
        <div style={{ margin: "10px" }}>
          <Button
            variant="contained"
            onClick={handleDeleteSelected}
            disabled={selectedIds?.length === 0}
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
            <RiDeleteBinLine className="mr-1 text-lg" /> Delete Selected
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
              "& th, & td": { border: "1px solid #E0E5E5", color: "gray" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedIds?.length > 0 &&
                      selectedIds?.length < members.length
                    }
                    checked={
                      members?.length > 0 &&
                      selectedIds.length === members.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.title && <TableCell>TITLE</TableCell>}
                {visibleColumns?.users && <TableCell>USERS</TableCell>}
                {visibleColumns?.clients && <TableCell>CLIENTS</TableCell>}
                {visibleColumns?.status && <TableCell>STATUS</TableCell>}
                {visibleColumns?.priority && <TableCell>PRIORITY</TableCell>}
                {visibleColumns?.startsAt && <TableCell>STARTS AT</TableCell>}
                {visibleColumns?.endsAt && <TableCell>ENDS AT</TableCell>}
                {visibleColumns?.budget && <TableCell>BUDGET</TableCell>}
                {visibleColumns?.tags && <TableCell>TAGS</TableCell>}
                {visibleColumns?.options && <TableCell>OPTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {members
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((member) => (
                  <TableRow key={member?.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(member?.id)}
                        onChange={() => handleSelect(member?.id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{member?.id}</TableCell>}
                    {visibleColumns?.title && (
                      <TableCell>
                        <p className="text-[#5b6edd] font-semibold">
                          {member?.title}
                        </p>
                      </TableCell>
                    )}
                    {visibleColumns?.users && (
                      <TableCell>
                        <div className="flex">
                          {Array.isArray(member?.users)
                            ? member?.users.map((el, index) => (
                                <div className="h-8 w-8" key={index}>
                                  {user?.photoURL && (
                                    <img
                                      className="rounded-full"
                                      src={user?.photoURL}
                                      alt={el?.name}
                                    />
                                  )}
                                </div>
                              ))
                            : "No users"}
                          <div
                            className="rounded-full border h-8 w-8 flex items-center justify-center hover:bg-[#3f51b5] hover:text-white text-[#3f51b5]"
                            onClick={() => handleOpenDialog(member)}
                          >
                            <FaRegEdit />
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.clients && (
                      <TableCell>
                        <div className="flex">
                          {Array.isArray(member?.clients) &&
                          member?.clients.length > 0 ? (
                            member?.clients.map((el, index) => (
                              <div className="h-8 w-8" key={index}>
                                {el?.photoURL ? (
                                  <img
                                    className="rounded-full"
                                    src={el?.photoURL}
                                    alt={el?.name}
                                  />
                                ) : (
                                  <div className="rounded-full border h-8 w-8 flex items-center justify-center">
                                    <span>{el?.name?.charAt(0)}</span>{" "}
                                    {/* Display first letter of name if image is not available */}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-white rounded-md px-1 flex flex-col justify-center font-medium h-7 bg-[#3f51b5]">
                              NOT ASSIGNED
                            </div>
                          )}
                          <div
                            className="rounded-full border h-8 w-8 flex items-center justify-center pt-1 pl-1 hover:bg-[#3f51b5] hover:text-white text-[#3f51b5]"
                            onClick={() => handleOpenDialog(member)}
                          >
                            <FaRegEdit />
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.status && (
                      <TableCell>{member?.status}</TableCell>
                    )}
                    {visibleColumns?.priority && (
                      <TableCell>{member?.priority}</TableCell>
                    )}
                    {visibleColumns?.startsAt && (
                      <TableCell>{member?.startsAt}</TableCell>
                    )}
                    {visibleColumns?.endsAt && (
                      <TableCell>{member?.endsAt}</TableCell>
                    )}
                    {visibleColumns?.budget && (
                      <TableCell>{member?.budget}</TableCell>
                    )}
                    {visibleColumns?.tags && (
                      <TableCell>
                        {member?.tags?.join(", ") || "No tags"}
                      </TableCell>
                    )}
                    {visibleColumns?.options && (
                      <TableCell>
                        <div className="flex justify-between">
                          <FaRegEdit
                            style={{
                              color: "#3f51b5",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                            onClick={() => handleOpenDialog(member)}
                          />
                          <RiDeleteBinLine
                            style={{
                              color: "tomato",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                          />
                          <GoCopy
                            style={{
                              color: "orange",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                          />
                          <ErrorOutlineOutlinedIcon
                            style={{
                              color: "#3f51b5",
                              fontSize: "18px",
                              marginRight: "10px",
                            }}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={members.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Use UpdateProjectDialog component */}
      <UpdateProjectDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        project={selectedProject}
        onSave={handleSaveDialog}
      />
    </div>
  );
};

export default CustomTable;
