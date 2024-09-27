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
import PriorityManagement from "../../service/Priority";
import Loading from "../../shared/Loading";
import DeleteDialog from "../../shared/DeleteDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import {
  setReloadPriorities,
  setPriorities,
} from "../../store/features/prioritySlice";
import ProjectManagement from "../../service/Project";
import UpdatePrioritiesDialog from "./UpdatePrioritiesDialog";
const PrioritiesTable = () => {
  const dispatch = useDispatch();
  const reloadPriorities = useSelector(
    (state) => state.priority.reloadPriorities
  );
  const priorities = useSelector((state) => state.priority.priorities);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityId, setPriorityId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    priority: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (priorities === null || reloadPriorities) {
      const fetchData = async () => {
        try {
          const result = await PriorityManagement.getPriorityList();
          dispatch(setPriorities(result?.data));
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
          dispatch(setReloadPriorities(false));
        }
      };

      fetchData();
    }
  }, [reloadPriorities, priorities]);

  if (loading && !priorities)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(priorities.map((priority) => priority._id)); // Changed from priority.id to priority._id
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
      toast.error("No priorities selected for deletion");
      return;
    }

    try {
      // Fetch the list of projects to check for associated priorities
      const projectList = await ProjectManagement.getProjectList();
      const associatedPriorities = new Set();

      // Check which selected priorities are associated with a project
      projectList.data?.forEach((project) => {
        if (selectedIds.includes(project.priority._id)) {
          associatedPriorities.add(project.priority._id);
        }
      });

      // Filter out the priorities that are associated with projects
      const prioritiesToDelete = selectedIds.filter(
        (id) => !associatedPriorities.has(id)
      );

      if (prioritiesToDelete.length === 0) {
        toast.error(
          "All selected priorities are associated with projects and cannot be deleted"
        );
        return;
      }

      if (associatedPriorities.size > 0) {
        toast.warn(
          "Some priorities are associated with projects and were not deleted"
        );
      }

      // Proceed to delete the priorities that are not associated with any project
      await PriorityManagement.deletePriorities(prioritiesToDelete);
      dispatch(setReloadPriorities(true));
      toast.success("Selected priorities deleted successfully");
    } catch (error) {
      console.error("Error deleting priorities:", error);
      toast.error("Failed to delete selected priorities");
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

  const handleOpenDialog = (priority) => {
    setSelectedPriority(priority);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPriority(null);
  };
  const handleClickOpen = (id) => {
    setPriorityId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    ProjectManagement.getProjectList()
      .then((res) => {
        const anyPriorityExists = res.data?.some(
          (project) => project.priority._id === id
        );
        console.log(anyPriorityExists);

        if (anyPriorityExists) {
          toast.error("Ops Sorry ! Priority is associated with a project.");
          handleClose();
        } else {
          if (id) {
            PriorityManagement.deletePriority(id)
              .then(() => {
                dispatch(setReloadPriorities(true));
                handleClose();
                toast.success("Priority deleted successfully.");
              })
              .catch((error) => {
                console.error("Error deleting the Priority:", error);
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
                      selectedIds?.length < priorities.length
                    }
                    checked={
                      priorities?.length > 0 &&
                      selectedIds.length === priorities.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.title && <TableCell>TITLE</TableCell>}
                {visibleColumns?.priority && <TableCell>PREVIEW</TableCell>}
                {visibleColumns?.options && <TableCell>OPTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {priorities
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((priority, index) => (
                  <TableRow key={priority?._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(priority?._id)}
                        onChange={() => handleSelect(priority?._id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                    {visibleColumns?.title && (
                      <TableCell>
                        <div className="flex">
                          <p className="mr-3">{priority?.title}</p>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.priority && (
                      <TableCell>
                        <p
                          style={{ backgroundColor: priority.txColor }}
                          className={` text-white inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {priority?.title}
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
                            onClick={() => handleOpenDialog(priority)}
                          />
                          <RiDeleteBinLine
                            onClick={() => handleClickOpen(priority?._id)}
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
          count={priorities?.length}
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
        id={priorityId}
      />
      <UpdatePrioritiesDialog
        open={dialogOpen}
        priority={selectedPriority}
        onClose={handleCloseDialog}
      />
    </div>
  );
};
PrioritiesTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default PrioritiesTable;
