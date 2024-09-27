import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Autocomplete,
  NativeSelect,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import ProjectManagement from "../../service/Project";
import { useDispatch } from "react-redux";
import UserManagement from "../../service/User";
import StatusManagement from "../../service/Status";
import TagManagement from "../../service/Tag";
import { setReloadUsers } from "../../store/features/userSlice";
import { setReloadProjects } from "../../store/features/projectSlice";
import CloseDialog from "../../shared/CloseDialog";

const CreateProjectDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: null, // status will be an object
    priority: "",
    budget: "",
    startsAt: null,
    endsAt: null,
    users: [],
    clients: [],
    tags: [],
    favourite: false,
  });
  const [loading, setLoading] = useState({
    users: true,
    clients: true,
    statuses: true,
    tags: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({
          users: true,
          clients: true,
          statuses: true,
          tags: true,
        });

        const [userResponse, clientResponse, statusResponse, tagResponse] =
          await Promise.all([
            UserManagement.getUserList(),
            UserManagement.getUserList("client"),
            StatusManagement.getStatusList(),
            TagManagement.getTagList(),
          ]);

        const activeUsers = userResponse?.data.filter(
          (user) => user.status === true
        );
        const activeClients = clientResponse?.data.filter(
          (client) => client.status === true
        );

        setUsers(activeUsers);
        setClients(activeClients);
        setStatuses(statusResponse?.data);
        setTags(tagResponse?.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching data. Please try again.");
      } finally {
        setLoading({
          users: false,
          clients: false,
          statuses: false,
          tags: false,
        });
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const statusId = event.target.value;
    const selectedStatus = statuses.find((status) => status._id === statusId);
    if (selectedStatus) {
      setFormData((prev) => ({ ...prev, status: selectedStatus }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleCreate = () => {
    const newProject = {
      ...formData,
      startsAt: formData.startsAt
        ? dayjs(formData.startsAt).format("YYYY-MM-DD")
        : null,
      endsAt: formData.endsAt
        ? dayjs(formData.endsAt).format("YYYY-MM-DD")
        : null,
    };

    ProjectManagement.createProject(newProject)
      .then(() => {
        toast.success("Project Created Successfully");
        onClose();
        setFormData({
          title: "",
          status: null,
          priority: "",
          budget: "",
          startsAt: null,
          endsAt: null,
          users: [],
          clients: [],
          tags: [],
          favourite: false,
        });
        dispatch(setReloadUsers(true));
        dispatch(setReloadProjects(true));
      })
      .catch((error) => {
        toast.error(`Error creating project: ${error.message}`);
      });
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          width: "80%",
          maxWidth: "800px",
        },
      }}
      onClose={onClose}
    >
      <CloseDialog title="Create Project" handleClose={onClose} />
      <DialogContent>
        <div className="grid grid-cols-2 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter project title"
              name="title"
              type="text"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">STATUS</p>
            <NativeSelect
              name="status"
              style={{
                fontSize: "12px",
                borderRadius: "5px",
                height: "56px",
                border: "1px solid gray",
                textAlign: "center",
                backgroundColor: formData.status?.bgColor || "white",
              }}
              onChange={handleStatusChange}
              disableUnderline={true}
              value={formData.status?._id || ""}
            >
              <option style={{ textAlign: "center", color: "gray" }} hidden>
                Select Status
              </option>
              {statuses?.map((el) => (
                <option
                  key={el._id}
                  style={{
                    backgroundColor: el.bgColor,
                    color: el.txColor,
                    textAlign: "center",
                  }}
                  value={el._id}
                >
                  {el.title}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">PRIORITY</p>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select priority
              </MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">BUDGET</p>
            <TextField
              margin="dense"
              name="budget"
              type="text"
              fullWidth
              placeholder="Enter budget"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </FormControl>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">START DATE</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["day"]}
                format="DD-MM-YYYY"
                value={formData.startsAt || null}
                onChange={(newDate) => handleDateChange("startsAt", newDate)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select start date" />
                )}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">END DATE</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD-MM-YYYY"
                value={formData.endsAt || null}
                onChange={(newDate) => handleDateChange("endsAt", newDate)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select end date" />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </div>

        {/* Autocomplete for Users */}
        <FormControl fullWidth margin="dense" className="mt-10">
          <p className="text-xs text-gray-500">USERS</p>
          {loading.users ? (
            <CircularProgress size={24} />
          ) : (
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.displayName || option?.email}
              value={formData.users}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, users: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Users"
                  placeholder="Select users"
                />
              )}
            />
          )}
        </FormControl>

        {/* Autocomplete for Clients */}
        <FormControl fullWidth margin="dense" className="mt-10">
          <p className="text-xs text-gray-500">CLIENTS</p>
          {loading.clients ? (
            <CircularProgress size={24} />
          ) : (
            <Autocomplete
              multiple
              options={clients}
              getOptionLabel={(option) => option.displayName || option?.email}
              value={formData.clients}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, clients: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Clients"
                  placeholder="Select clients"
                />
              )}
            />
          )}
        </FormControl>

        {/* Autocomplete for Tags */}
        <FormControl fullWidth margin="dense" className="mt-10">
          <p className="text-xs text-gray-500">TAGS</p>
          {loading.tags ? (
            <CircularProgress size={24} />
          ) : (
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.title}
              value={formData.tags}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, tags: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Tags"
                  placeholder="Select tags"
                />
              )}
            />
          )}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateProjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateProjectDialog;
