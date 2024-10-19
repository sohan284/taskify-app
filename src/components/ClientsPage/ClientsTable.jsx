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
} from "@mui/material";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { setReloadPage } from "../../store/features/reloadSlice";
import SearchFilter from "../shared-component/SearchFilter";
import Loading from "../../shared/Loading";
// import UpdateUserDialog from "./UpdateUserDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserManagement from "../../service/User";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../../shared/DeleteDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import { setClients, setReloadClients } from "../../store/features/clientSlice";
import { setFilter } from "../../store/features/projectSlice";
const ClientsTable = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.client.clients);
  const reloadClients = useSelector((state) => state.client.reloadClients);
  const filter = useSelector((state) => state.project.filter);
  const userRole = useSelector((state) => state.user.userRole);
  // const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    displayName: true,
    company: true,
    phoneNumber: true,
    assigned: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (clients === null || reloadClients || filter) {
      const fetchData = async () => {
        setLoading(true);
        try {
          await UserManagement.getUserList("client").then((res) =>
            dispatch(setClients(res.data))
          );
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
          dispatch(setFilter(false));
          dispatch(setReloadPage(false));
          dispatch(setReloadClients(false));
        }
      };

      fetchData();
    }
  }, [reloadClients, filter, clients]);

  if (loading && !clients)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(clients.map((status) => status._id));
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
    dispatch(
      setClients(clients?.filter((status) => !selectedIds.includes(status.id)))
    );
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
    setUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    if (userRole === "super admin") {
      UserManagement.deleteUser(id)
        .then(() => {
          dispatch(setReloadClients(true));
          handleClose();
          toast.success("Client Delete Successfully");
        })
        .catch((error) => {
          console.error("Error deleting the Status:", error);
        });
    } else {
      toast.error("Only Super Admin Can Delete ");
      handleClose();
    }
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
                      selectedIds?.length < clients.length
                    }
                    checked={
                      clients?.length > 0 &&
                      selectedIds.length === clients.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.displayName && <TableCell>CLIENTS</TableCell>}
                {visibleColumns?.company && <TableCell>COMPANY</TableCell>}
                {visibleColumns?.phoneNumber && (
                  <TableCell>PHONE NUMBER</TableCell>
                )}
                {visibleColumns?.assigned && <TableCell>ASSIGNED</TableCell>}
                {visibleColumns?.options && <TableCell>ACTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {clients
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((user, index) => (
                  <TableRow key={user?._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(user?._id)}
                        onChange={() => handleSelect(user?._id)}
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
                                className="rounded-full h-12 w-12"
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
                            <p className="mx-3 font-semibold text-md flex text-gray-600">
                              {user?.displayName}{" "}
                              {user?.status ? (
                                <p className="mx-1 uppercase text-xs py-0.5 bg-green-600 rounded text-white px-1">
                                  Active
                                </p>
                              ) : (
                                <p className="mx-1 uppercase text-xs py-0.5 bg-red-600 rounded text-white px-1">
                                  Deactive
                                </p>
                              )}
                            </p>
                            <p className="mx-3 font-medium text-xs">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.company && (
                      <TableCell>
                        <p>{user?.company}</p>
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
                        <div className="flex flex-col">
                          <p
                            style={{ backgroundColor: user.txColor }}
                            className={` bg-[#5a6fe2] w-12 text-center inline p-1 px-2 rounded-full text-white uppercase text-xs`}
                          >
                            {user?.projectCount}
                          </p>
                          <span className="text-xs">Projects</span>
                        </div>
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
                            onClick={() => navigate(`/clients/${user?._id}`)}
                          />
                          <RiDeleteBinLine
                            onClick={() => handleClickOpen(user?._id)}
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
          count={clients?.length}
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
        id={userId}
      />
    </div>
  );
};
ClientsTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default ClientsTable;
