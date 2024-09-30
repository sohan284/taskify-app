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

// import SearchFilter from "../shared-component/SearchFilter";
import StatusManagement from "../../service/Status";
import Loading from "../../shared/Loading";
import DeleteDialog from "../../shared/DeleteDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import {
  setReloadStatuses,
  setStatuses,
} from "../../store/features/statusSlice";
import ProjectManagement from "../../service/Project";
const LogsTable = () => {
  const dispatch = useDispatch();
  const reloadStatuses = useSelector((state) => state.status.reloadStatuses);
  const statuses = useSelector((state) => state.status.statuses);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    actionBy: true,
    title: true,
    message: true,
    dateTime: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (statuses === null || reloadStatuses) {
      const fetchData = async () => {
        try {
          const result = await StatusManagement.getStatusList();
          dispatch(setStatuses(result?.data));
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
          dispatch(setReloadStatuses(false));
        }
      };

      fetchData();
    }
  }, [reloadStatuses, statuses]);

  if (loading && !statuses)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(statuses.map((status) => status._id)); // Changed from status.id to status._id
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

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("No statuses selected for deletion");
      return;
    }

    try {
      // Fetch the list of projects to check for associated statuses
      const projectList = await ProjectManagement.getProjectList();
      const associatedStatuses = new Set();

      // Check which selected statuses are associated with a project
      projectList.data?.forEach((project) => {
        if (selectedIds.includes(project.status._id)) {
          associatedStatuses.add(project.status._id);
        }
      });

      // Filter out the statuses that are associated with projects
      const statusesToDelete = selectedIds.filter(
        (id) => !associatedStatuses.has(id)
      );

      if (statusesToDelete.length === 0) {
        toast.error(
          "All selected statuses are associated with projects and cannot be deleted"
        );
        return;
      }

      if (associatedStatuses.size > 0) {
        toast.warn(
          "Some statuses are associated with projects and were not deleted"
        );
      }

      // Proceed to delete the statuses that are not associated with any project
      await StatusManagement.deleteStatuses(statusesToDelete);
      dispatch(setReloadStatuses(true));
      toast.success("Selected statuses deleted successfully");
    } catch (error) {
      console.error("Error deleting statuses:", error);
      toast.error("Failed to delete selected statuses");
    } finally {
      setSelectedIds([]); // Reset the selected IDs
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (status) => {
    setSelectedStatus(status);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStatus(null);
  };
  const handleClickOpen = (id) => {
    setStatusId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    ProjectManagement.getProjectList()
      .then((res) => {
        const anyStatusExists = res.data?.some(
          (project) => project.status._id === id
        );
        console.log(anyStatusExists);

        if (anyStatusExists) {
          toast.error("Ops Sorry ! Status is associated with a project.");
          handleClose();
        } else {
          if (id) {
            StatusManagement.deleteStatus(id)
              .then(() => {
                dispatch(setReloadStatuses(true));
                handleClose();
                toast.success("Status deleted successfully.");
              })
              .catch((error) => {
                console.error("Error deleting the Status:", error);
              });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching project list:", error);
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
          <div className="flex">
            {/* <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            /> */}
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
                      selectedIds?.length < statuses.length
                    }
                    checked={
                      statuses?.length > 0 &&
                      selectedIds.length === statuses.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.actionBy && <TableCell>ACTIONED BY</TableCell>}
                {visibleColumns?.title && <TableCell>TYPE TITLE</TableCell>}
                {visibleColumns?.message && <TableCell>MESSAGE</TableCell>}
                {visibleColumns?.dateTime && <TableCell>DATE & TIME</TableCell>}
                {visibleColumns?.options && <TableCell>OPTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {statuses
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((status, index) => (
                  <TableRow key={status?._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(status?._id)}
                        onChange={() => handleSelect(status?._id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                    {visibleColumns?.title && (
                      <TableCell>
                        <div className="flex">
                          <p className="mr-3">{status?.title}</p>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.title && (
                      <TableCell>
                        <p
                          style={{ backgroundColor: status.txColor }}
                          className={` text-white inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {status?.title}
                        </p>
                      </TableCell>
                    )}

                    {visibleColumns?.options && (
                      <TableCell>
                        <div className="flex justify-evenly">
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
          count={statuses?.length}
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
        id={statusId}
      />
    </div>
  );
};
LogsTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default LogsTable;
