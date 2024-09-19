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
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
// import UpdateProjectDialog from "./UpdateProjectDialog";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
// import Loading from "../../shared/Loading";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { setReloadPage } from "../../store/features/reloadSlice";
import StatusFilter from "../shared-component/StatusFilter";
import { setFilter } from "../../store/features/projectSlice";
import UserFilter from "../shared-component/UserFilter";
import ClientFilter from "../shared-component/ClientFilter";
import DateFilter from "../shared-component/DateFilter";
import SearchFilter from "../shared-component/SearchFilter";
import DeleteDialog from "../../shared/DeleteDialog";
import UpdateMeetingDialog from "./UpdateMeetingDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import MeetingManagement from "../../service/Meeting";
import moment from "moment";
import Loading from "../../shared/Loading";
const MeetingsTable = ({ API }) => {
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const filter = useSelector((state) => state.project.filter);
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    users: true,
    clients: true,
    startsAt: true,
    endsAt: true,
    status: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [startDates, setStartDates] = useState([]);
  const [endDates, setEndDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await API(
          statusFilter,
          userFilter,
          clientFilter,
          startDates[0],
          startDates[1],
          endDates[0],
          endDates[1],
          searchQuery
        );
        setMembers(result?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        dispatch(setReloadPage(false));
        dispatch(setFilter(false));
      }
    };

    fetchData();
  }, [reloadPage, filter]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
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
  const handleClickOpen = (id) => {
    setMemberId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    MeetingManagement.deleteMeeting(id)
      .then(() => {
        dispatch(setReloadPage(true));
        handleClose();
        toast.success("Project Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the project:", error);
      });
  };

  //  user filter
  const handleUserFilter = (event) => {
    if (event.target.value === "Select User") {
      setUserFilter("");
    } else {
      setUserFilter(event.target.value);
    }
    dispatch(setFilter(true));
  };

  // client filter
  const handleClientFilter = (event) => {
    if (event.target.value === "Select Client") {
      setClientFilter("");
    } else {
      setClientFilter(event.target.value);
    }
    dispatch(setFilter(true));
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        <DateFilter
          dates={startDates}
          setDates={setStartDates}
          placeHolder="Start Between"
        />

        <DateFilter
          dates={endDates}
          setDates={setEndDates}
          placeHolder="End Between"
        />
        {/* status filter  */}
        <StatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <UserFilter
          userFilter={userFilter}
          handleUserFilter={handleUserFilter}
        />
        <ClientFilter
          clientFilter={clientFilter}
          handleClientFilter={handleClientFilter}
        />
      </div>

      <Paper>
        <div className="flex mt-10 p-1 mb-3 justify-between flex-nowrap">
          <div className="flex h-10 lg:text-nowrap overflow-auto">
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
          <div className="flex">
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <ColumnVisibilityButton
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </div>
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
                {visibleColumns?.startsAt && <TableCell>STARTS AT</TableCell>}
                {visibleColumns?.endsAt && <TableCell>ENDS AT</TableCell>}{" "}
                {visibleColumns?.status && <TableCell>STATUS</TableCell>}
                {visibleColumns?.options && <TableCell>ACTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {members
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((member, index) => (
                  <TableRow key={member?.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(member?.id)}
                        onChange={() => handleSelect(member?.id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                    {visibleColumns?.title && (
                      <TableCell>
                        <div className="flex">
                          <p className="mr-3 font-medium">{member?.title}</p>{" "}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.users && (
                      <TableCell>
                        <div className="flex items-center">
                          {Array.isArray(member?.users)
                            ? member?.users.map((el, index) => (
                                <div key={index}>
                                  {el?.photoURL ? (
                                    <div className="w-8 h-8 -ml-2">
                                      <img
                                        className="rounded-full border-[#5a6fe2] border-2 duration-300 ease-in-out h-8 w-8 hover:transform hover:-translate-y-1"
                                        src={el?.photoURL}
                                      />
                                    </div>
                                  ) : (
                                    <div className="duration-300 ease-in-out hover:transform hover:-translate-y-1">
                                      {" "}
                                      <AccountCircleIcon
                                        className="bg-[#5a6fe2] rounded-full"
                                        style={{
                                          color: "white",
                                          fontSize: 30,
                                          marginLeft: -10,
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))
                            : "No users"}
                          <div
                            className="rounded-full border h-8 w-8 flex items-center justify-center text-lg hover:bg-[#5a6fe2] hover:text-white text-[#5a6fe2] ml-2" // Add margin-left for the edit icon
                            onClick={() => handleOpenDialog(member)}
                          >
                            <FaRegEdit />
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns?.clients && (
                      <TableCell>
                        <div className="relative flex items-center">
                          {Array.isArray(member?.clients) &&
                          member?.clients.length > 0 ? (
                            member?.clients.map((el, index) => (
                              <div key={index}>
                                {el?.photoURL ? (
                                  <div className="w-8 h-8 -ml-2">
                                    <img
                                      className="rounded-full border-[#5a6fe2] border-2 duration-300 ease-in-out h-8 hover:transform hover:-translate-y-1"
                                      src={el?.photoURL}
                                    />
                                  </div>
                                ) : (
                                  <div className="duration-300 ease-in-out hover:transform hover:-translate-y-1">
                                    {" "}
                                    <AccountCircleIcon
                                      className="bg-[#5a6fe2] rounded-full"
                                      style={{
                                        color: "white",
                                        fontSize: 30,
                                        marginLeft: -10,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-white mt-1 mr-1 rounded px-2 flex flex-col justify-center pt-1 text-[12px] font-medium h-5 bg-[#5a6fe2]">
                              NOT ASSIGNED
                            </div>
                          )}
                          <div
                            className="rounded-full border h-8 w-8 flex items-center justify-center text-lg hover:bg-[#5a6fe2] hover:text-white text-[#5a6fe2] ml-2" // Add margin-left for the edit icon
                            onClick={() => handleOpenDialog(member)}
                          >
                            <FaRegEdit />
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns?.startsAt && (
                      <TableCell>
                        {moment(member?.startsAt).format(
                          "MMMM D, YYYY hh:mm:ss A"
                        )}
                      </TableCell>
                    )}
                    {visibleColumns?.endsAt && (
                      <TableCell>
                        {moment(member?.endsAt).format(
                          "MMMM D, YYYY hh:mm:ss A"
                        )}
                      </TableCell>
                    )}
                    {visibleColumns?.startsAt && (
                      <TableCell>{member?.startsAt}</TableCell>
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
                            onClick={() => handleClickOpen(member?._id)}
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
          count={members?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        id={memberId}
      />
      <UpdateMeetingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        project={selectedProject}
        onSave={handleSaveDialog}
      />
    </div>
  );
};
MeetingsTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default MeetingsTable;
