import { useState, useEffect } from "react";
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
  NativeSelect,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import UserManagement from "../../service/User";
import StatusManagement from "../../service/Status";
import CloseDialog from "../../shared/CloseDialog";
import TaskManagement from "../../service/Task";
import { setReloadTasks } from "../../store/features/taskSlice";
const UpdateTaskDialog = ({ open, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({});
  const [statuses, setStatuses] = useState([]);
  const dispatch = useDispatch();
  const [color, setColor] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (task) {
      UserManagement.getUserList().then((res) => {
        const activeUsers = res?.data?.filter((user) => user.status === true);
        setUsers(activeUsers);
      });

      UserManagement.getUserList("client").then((res) => {
        const activeClients = res?.data?.filter(
          (client) => client.status === true
        );
        setClients(activeClients);
      });

      StatusManagement.getStatusList().then((res) => {
        setStatuses(res.data);
        setColor(res?.data[0]?.bgColor);
      });

      setFormData({
        ...task,
        startsAt: task.startsAt ? dayjs(task.startsAt) : null,
        endsAt: task.endsAt ? dayjs(task.endsAt) : null,
        status: task.status || {}, // Set initial status from task
      });
    }
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const selectedStatus = statuses.find(
      (status) => status.title === event.target.value
    );
    setFormData((prev) => ({
      ...prev,
      status: selectedStatus || {}, // Set the full status object
    }));
    setColor(selectedStatus.bgColor); // Change the color as per selected status
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSave = () => {
    const { _id, ...updateData } = formData;
    const formattedUpdateData = {
      ...updateData,
      startsAt: formData.startsAt
        ? formData.startsAt.format("YYYY-MM-DD")
        : null,
      endsAt: formData.endsAt ? formData.endsAt.format("YYYY-MM-DD") : null,
    };
    TaskManagement.updateTask(_id, formattedUpdateData)
      .then(() => {
        toast.success("Task Updated Successfully");
        onSave(formData);
        onClose();
        dispatch(setReloadTasks(true));
      })
      .catch((error) => {
        console.error("Error updating the task:", error);
      });
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          width: "80%", // Adjust the width as needed
          maxWidth: "800px", // Optional: set a maximum width
        },
      }}
      onClose={onClose}
    >
      <CloseDialog title="Update Task" handleClose={onClose} />

      <DialogContent>
        <div className="grid grid-cols-1 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              type="text"
              fullWidth
              value={formData.title || ""}
              onChange={handleChange}
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
                backgroundColor: color,
              }}
              onChange={handleStatusChange} // Change handler for status
              disableUnderline={true}
              value={formData.status?.title || ""} // Bind to formData.status.title
            >
              {statuses?.map((el) => (
                <option
                  key={el.title}
                  style={{
                    backgroundColor: el.bgColor,
                    color: el.txColor,
                    textAlign: "center",
                  }}
                  value={el.title}
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
              value={formData.priority || ""}
              onChange={handleChange}
            >
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
                renderInput={(params) => <TextField {...params} />}
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
                renderInput={(params) => <TextField {...params} />}
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
          value={formData.users || []}
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
          value={formData.clients || []}
          onChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, clients: newValue }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Select Clients" />
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
          onClick={handleSave}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default UpdateTaskDialog;
