import dayjs from "dayjs";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import ProjectManagement from "../../service/Project";
import { useDispatch, useSelector } from "react-redux";
import { setResetProjects } from "../../store/features/projectSlice";

const CreateTaskDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
    budget: "",
    startsAt: null,
    endsAt: null,
    users: [],
    clients: [],
    tags: [],
    favourite: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      .then((response) => {
        toast.success("Project Created Successfully");
        onClose();
        dispatch(setResetProjects(true));
      })
      .catch((error) => {
        toast.error(`${error}`);
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
      <DialogTitle>Create Project</DialogTitle>
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
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              displayEmpty
              placeholder="Select status"
            >
              <MenuItem value="" disabled>
                Select status
              </MenuItem>
              <MenuItem value="started">Started</MenuItem>
              <MenuItem value="on going">On Going</MenuItem>
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="in review">In Review</MenuItem>
            </Select>
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
          options={[]} // Replace with your users options if needed
          getOptionLabel={(option) => option.name || ""}
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
          options={[]} // Replace with your clients options if needed
          getOptionLabel={(option) => option.name || ""}
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
          options={["design", "website", "development", "marketing"]}
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

// Define prop types
CreateTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CreateTaskDialog;
