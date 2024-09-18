import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { setReloadPage } from "../../store/features/reloadSlice";
import SearchFilter from "../shared-component/SearchFilter";
import StatusManagement from "../../service/Status";
import Loading from "../../shared/Loading";
// import UpdateUserDialog from "./UpdateUserDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserManagement from "../../service/User";
import { useNavigate } from "react-router-dom";
const UsersTable = () => {
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const filter = useSelector((state) => state.project.filter);
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [visibleColumns] = useState({
    id: true,
    displayName: true,
    email: true,
    role: true,
    status: true,
    options: true,
    phoneNumber: true,
    assigned: true,
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await UserManagement.getUserList();
        setUsers(result?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        dispatch(setReloadPage(false));
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
      setSelectedIds(users.map((status) => status.id));
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
    setUsers(users?.filter((status) => !selectedIds.includes(status.id)));
    setSelectedIds([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleCloseDialog = () => {
  //   setDialogOpen(false);
  //   setSelectedStatus(null);
  // };
  const handleClickOpen = (id) => {
    setStatusId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    StatusManagement.deleteStatus(id)
      .then(() => {
        dispatch(setReloadPage(true));
        handleClose();
        toast.success("Status Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the Status:", error);
      });
  };

  return (
    <div>
      <Paper>
        <div className="flex mt-10 p-1 mb-3 justify-between flex-nowrap">
          <div className="flex h-10 text-nowrap">
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
          </div>
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
                      selectedIds?.length < users.length
                    }
                    checked={
                      users?.length > 0 && selectedIds.length === users.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.displayName && <TableCell>USERS</TableCell>}
                {visibleColumns?.role && <TableCell>ROLE</TableCell>}
                {visibleColumns?.phoneNumber && (
                  <TableCell>PHONE NUMBER</TableCell>
                )}
                {visibleColumns?.status && <TableCell>ASSIGNED</TableCell>}
                {visibleColumns?.options && <TableCell>ACTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {users
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((user, index) => (
                  <TableRow key={user?.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(user?.id)}
                        onChange={() => handleSelect(user?.id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                    {visibleColumns?.displayName && (
                      <TableCell
                        style={{
                          width: "500px",
                          //   textAlign: "center",
                        }}
                      >
                        <div className="flex">
                          <div className="w-12">
                            {user?.photoURL ? (
                              <img
                                className="rounded-full"
                                src={user?.photoURL}
                                alt=""
                              />
                            ) : (
                              <AccountCircleIcon
                                className="bg-[#5a6fe2] rounded-full"
                                style={{
                                  color: "white",
                                  fontSize: 42,
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <p className="mx-3 font-semibold text-md text-gray-600">
                              {user?.displayName}
                            </p>
                            <p className="mx-3 font-medium text-xs">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.role && (
                      <TableCell>
                        <p
                          className={`  inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {user?.role}
                        </p>
                      </TableCell>
                    )}
                    {visibleColumns?.phoneNumber && (
                      <TableCell>
                        <p
                          className={`  inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {user?.phoneNumber}
                        </p>
                      </TableCell>
                    )}
                    {visibleColumns?.assigned && (
                      <TableCell>
                        <p
                          style={{ backgroundColor: user.txColor }}
                          className={`  inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {user?.title}
                        </p>
                      </TableCell>
                    )}

                    {visibleColumns?.options && (
                      <TableCell>
                        <div className="flex justify-evenly">
                          <FaRegEdit
                            style={{
                              color: "#3f51b5",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                            onClick={() => navigate(`/users/${user?._id}`)}
                          />
                          <RiDeleteBinLine
                            onClick={() => handleClickOpen(status?._id)}
                            style={{
                              color: "tomato",
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
          count={users?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure want to delete this Status ?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => handleDelete(statusId)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* <UpdateUserDialog
        open={dialogOpen}
        status={selectedStatus}
        onClose={handleCloseDialog}
      /> */}
    </div>
  );
};
UsersTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default UsersTable;
