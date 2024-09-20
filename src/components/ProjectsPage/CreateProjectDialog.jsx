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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import ProjectManagement from "../../service/Project";
import { useDispatch } from "react-redux";
import { setReloadPage } from "../../store/features/reloadSlice";
import UserManagement from "../../service/User";
import Loading from "../../shared/Loading";
import StatusManagement from "../../service/Status";
import CloseDialog from "../../shared/CloseDialog";
import TagManagement from "../../service/Tag";

const CreateProjectDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [color, setColor] = useState([]);
  const [tags, setTags] = useState([]);
  // const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
    budget: "",
    startsAt: null,
    endsAt: null,
    users: [], // Selected users
    clients: [],
    tags: [],
    favourite: true,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Optional: start loading before the API calls

        // Call all the APIs concurrently
        const [userResponse, clientResponse, statusResponse, tagResponse] =
          await Promise.all([
            UserManagement.getUserList(),
            UserManagement.getUserList("client"),
            StatusManagement.getStatusList(),
            TagManagement.getTagList(),
          ]);

        // Set the data from all API responses
        setUsers(userResponse?.data);
        setClients(clientResponse?.data);
        setStatuses(statusResponse?.data);
        setColor(statusResponse?.data[0]?.bgColor);
        setTags(tagResponse?.data);
        
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Finish loading after all API calls
        dispatch(setReloadPage(false)); // Reset reload state
      }
    };

    fetchData();
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    StatusManagement.getStatusList().then((res) => {
      // Find the matching status based on event value
      const selectedStatus = res.data.find((status) => status.title === value);
      // If a matching status is found, set the background color
      if (selectedStatus) {
        setColor(selectedStatus.bgColor);
      }

      // Set statuses and form data after fetching
      setStatuses(res.data);

      setFormData((prev) => ({ ...prev, [name]: selectedStatus }));
    });
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
        dispatch(setReloadPage(true));
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  };
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

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
                backgroundColor: color,
              }}
              onChange={handleChange}
              disableUnderline={true}
              value={formData.status || ""} // Bind to formData.status
            >
              {statuses?.map((el) => (
                <option
                  key={el.title}
                  style={{
                    backgroundColor: el.bgColor,
                    color: el.txColor,
                    textAlign: "center",
                  }}
                  value={el.title} // Set the value to the status title
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
              placeholder="Select priority"
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
        <Autocomplete
          className="mt-10"
          multiple
          options={users} // Use the fetched users list
          getOptionLabel={(option) => option.displayName || option?.email} // Assuming the user has a 'name' property
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

        {/* Autocomplete for Clients */}
        <Autocomplete
          className="mt-10"
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

        {/* Autocomplete for Tags */}
        <Autocomplete
          className="mt-10"
          multiple
          options={tags.map((tag) => tag.title)}
          getOptionLabel={(option) => option}
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
      </DialogContent>
      <DialogActions>
        <div className="border rounded-lg text-gray-600">
          <Button
            style={{ color: "gray", paddingInline: "20px" }}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <Button
          style={{
            color: "white",
            paddingInline: "20px",
            backgroundColor: "#3f51b5",
          }}
          className="bg-[#3f51b5]"
          onClick={handleCreate}
        >
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
