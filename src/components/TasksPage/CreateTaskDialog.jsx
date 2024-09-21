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
import TaskManagement from "../../service/Task";
import { useDispatch } from "react-redux";
import { setReloadPage } from "../../store/features/reloadSlice";
import UserManagement from "../../service/User";
import Loading from "../../shared/Loading";
import StatusManagement from "../../service/Status";
import CloseDialog from "../../shared/CloseDialog";

const CreateTaskDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: null, // status will be an object
    priority: "",
    startsAt: null,
    endsAt: null,
    users: [],
    clients: [],
    favourite: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResponse, clientResponse, statusResponse] =
          await Promise.all([
            UserManagement.getUserList(),
            UserManagement.getUserList("client"),
            StatusManagement.getStatusList(),
          ]);
        setUsers(userResponse?.data);
        setClients(clientResponse?.data);
        setStatuses(statusResponse?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        dispatch(setReloadPage(false));
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
    const newTask = {
      ...formData,
      startsAt: formData.startsAt
        ? dayjs(formData.startsAt).format("YYYY-MM-DD")
        : null,
      endsAt: formData.endsAt
        ? dayjs(formData.endsAt).format("YYYY-MM-DD")
        : null,
    };

    TaskManagement.createTask(newTask)
      .then(() => {
        toast.success("Task Created Successfully");
        onClose();
        setFormData({
          title: "",
          status: null, // status will be an object
          priority: "",
          budget: "",
          startsAt: null,
          endsAt: null,
          users: [],
          clients: [],
          favourite: true,
        });
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
      <CloseDialog title="Create Task" handleClose={onClose} />
      <DialogContent>
        <div className="grid grid-cols-1 gap-5">
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
        </div>

        <div className="grid grid-cols-2 gap-5">
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

CreateTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTaskDialog;
