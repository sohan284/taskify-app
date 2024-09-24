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
  NativeSelect,
} from "@mui/material";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import UpdateProjectDialog from "./UpdateProjectDialog";
import { toast } from "react-toastify";
import ProjectManagement from "../../service/Project";
import { useDispatch, useSelector } from "react-redux";
import { FaRegStar, FaStar, FaRegEdit } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
// import Loading from "../../shared/Loading";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { setReloadPage } from "../../store/features/reloadSlice";
import StatusFilter from "../shared-component/StatusFilter";
import {
  setFilter,
  setGridView,
  setProjects,
  setReloadProjects,
} from "../../store/features/projectSlice";
import UserFilter from "../shared-component/UserFilter";
import ClientFilter from "../shared-component/ClientFilter";
import DateFilter from "../shared-component/DateFilter";
import SearchFilter from "../shared-component/SearchFilter";
import StatusManagement from "../../service/Status";
import GridTable from "./GridTable";
import DeleteDialog from "../../shared/DeleteDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import moment from "moment";
import Loading from "../../shared/Loading";

const ProjectsTable = ({ API }) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const reloadProjects = useSelector((state) => state.project.reloadProjects);
  const filter = useSelector((state) => state.project.filter);
  const gridView = useSelector((state) => state.project.gridView);
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
    status: true,
    priority: true,
    startsAt: true,
    endsAt: true,
    budget: true,
    tags: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [startDates, setStartDates] = useState([]);
  const [endDates, setEndDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statuses, setStatuses] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (projects === null || reloadProjects || filter) {
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

          dispatch(setProjects(result?.data));
          StatusManagement.getStatusList().then((res) => setStatuses(res.data));
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
          dispatch(setReloadProjects(false));
          dispatch(setFilter(false));
          dispatch(setGridView(false));
        }
      };

      fetchData();
    }
  }, [reloadProjects, filter, projects]);

  if (loading && projects === null) return <div>{<Loading />}</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(projects.map((project) => project.id));
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
    setProjects(
      projects?.filter((project) => !selectedIds.includes(project.id))
    );
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
    setProjectId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    ProjectManagement.deleteProject(id)
      .then(() => {
        dispatch(setReloadProjects(true));
        handleClose();
        toast.success("Project Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the project:", error);
      });
  };
  const handleStatusChange = async (e, project) => {
    console.log(statuses);
    console.log(e.target.value);

    const updatedStatus = statuses?.find(
      (status) => status.title == e.target.value
    );
    console.log(updatedStatus);

    try {
      await ProjectManagement.updateProjectStatus(project._id, updatedStatus);
      setProjects((prevProjects) =>
        prevProjects.map((m) =>
          m.id === project.id ? { ...m, status: updatedStatus } : m
        )
      );
      dispatch(setReloadPage(true));
      toast.success("Status Updated Successfully");
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };
  const handleFavourite = async (project, value, message) => {
    const favourite = value;
    try {
      await ProjectManagement.updateProjectFavourite(project._id, favourite);
      setProjects((prevProjects) =>
        prevProjects.map((m) => (m.id === project.id ? { ...m, favourite } : m))
      );
      dispatch(setReloadPage(true));
      toast.success(`${message} Successfully`);
    } catch (error) {
      console.error("Error updating the favourite status:", error);
    }
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
        {gridView ? (
          <GridTable
            projects={projects}
            page={page}
            rowsPerPage={rowsPerPage}
            selectedIds={selectedIds}
            handleSelect={handleSelect}
            visibleColumns={visibleColumns}
            handleFavourite={handleFavourite}
            handleOpenDialog={handleOpenDialog}
            handleStatusChange={handleStatusChange}
            statuses={statuses}
            handleClickOpen={handleClickOpen}
          />
        ) : (
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
                        selectedIds?.length < projects.length
                      }
                      checked={
                        projects?.length > 0 &&
                        selectedIds.length === projects.length
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
                {projects
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((project, index) => (
                    <TableRow key={project?.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds?.includes(project?.id)}
                          onChange={() => handleSelect(project?.id)}
                        />
                      </TableCell>
                      {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                      {visibleColumns?.title && (
                        <TableCell>
                          <div className="flex">
                            <p className="mr-3 text-[#5b6edd] font-semibold">
                              {project?.title}
                            </p>
                            {project?.favourite ? (
                              <FaStar
                                onClick={() =>
                                  handleFavourite(
                                    project,
                                    false,
                                    "Remove from Favourite"
                                  )
                                }
                                className="mt-1 text-[orange] mr-3 text-[15px]"
                              />
                            ) : (
                              <FaRegStar
                                onClick={() =>
                                  handleFavourite(
                                    project,
                                    true,
                                    "Added to favourite"
                                  )
                                }
                                className="mt-1 text-[orange] mr-3 text-[15px]"
                              />
                            )}
                            <IoChatbubbleEllipsesOutline className="mt-1 text-[tomato] text-[15px]" />
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns?.users && (
                        <TableCell>
                          <div className="flex items-center">
                            {Array.isArray(project?.users)
                              ? project?.users.map((el, index) => (
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
                              onClick={() => handleOpenDialog(project)}
                            >
                              <FaRegEdit />
                            </div>
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns?.clients && (
                        <TableCell>
                          <div className="relative flex items-center">
                            {Array.isArray(project?.clients) &&
                            project?.clients.length > 0 ? (
                              project?.clients.map((el, index) => (
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
                              onClick={() => handleOpenDialog(project)}
                            >
                              <FaRegEdit />
                            </div>
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns?.status && (
                        <TableCell>
                          <NativeSelect
                            name="status"
                            style={{
                              fontSize: "12px",
                              borderRadius: "5px",
                              height: "28px",
                              width: "200px",
                              textAlign: "center",
                              backgroundColor: project?.status?.bgColor,
                              color: project?.status?.txColor,
                            }}
                            disableUnderline={true}
                            value={project?.status?.title}
                            onChange={(e) => handleStatusChange(e, project)}
                          >
                            {statuses?.map((status) => (
                              <option
                                key={status._id}
                                style={{
                                  backgroundColor: status.bgColor,
                                  color: status.txColor,
                                  textAlign: "center",
                                }}
                                value={status?.title || "Default"}
                              >
                                {status?.title || "Default"}
                              </option>
                            ))}
                          </NativeSelect>
                        </TableCell>
                      )}
                      {visibleColumns?.priority && (
                        <TableCell>{project?.priority}</TableCell>
                      )}
                      {visibleColumns?.startsAt && (
                        <TableCell>
                          {moment(project?.startsAt).format("MMMM D, YYYY")}
                        </TableCell>
                      )}
                      {visibleColumns?.endsAt && (
                        <TableCell>
                          {moment(project?.endsAt).format("MMMM D, YYYY")}
                        </TableCell>
                      )}
                      {visibleColumns?.budget && (
                        <TableCell>{project?.budget}</TableCell>
                      )}
                      {visibleColumns?.tags && (
                        <TableCell>
                          {project?.tags && project.tags.length > 0
                            ? project.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  style={{
                                    backgroundColor: tag?.bgColor,
                                    color: "black", // You can adjust the text color
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    margin: "0 4px",
                                  }}
                                >
                                  {tag?.title}
                                </span>
                              ))
                            : "No tags"}
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
                              onClick={() => handleOpenDialog(project)}
                            />
                            <RiDeleteBinLine
                              onClick={() => handleClickOpen(project?._id)}
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
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={projects?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* grid table  */}

      {/* Use UpdateProjectDialog component */}
      {/* delete dialog  */}
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        id={projectId}
      />
      <UpdateProjectDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        project={selectedProject}
        onSave={handleSaveDialog}
      />
    </div>
  );
};
ProjectsTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default ProjectsTable;
