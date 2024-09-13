import { useState, useEffect } from "react";
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
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ProjectManagement from "../../service/Project";
import { useDispatch } from "react-redux";
import { setReloadPages } from "../../store/features/projectSlice";

const UpdateTaskDialog = ({ open, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        startsAt: project.startsAt ? dayjs(project.startsAt) : null,
        endsAt: project.endsAt ? dayjs(project.endsAt) : null,
      });
    }
  }, [project]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    ProjectManagement.updateProject(_id, formattedUpdateData)
      .then(() => {
        toast.success("Project Updated Successfully");
        onSave(formData);
        onClose();
        dispatch(setReloadPages(true));
      })
      .catch((error) => {
        console.error("Error updating the project:", error);
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
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-5">
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
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">STATUS</p>
            <Select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
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
              value={formData.priority || ""}
              onChange={handleChange}
            >
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
              value={formData.budget || ""}
              onChange={handleChange}
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
          options={project?.users || []}
          getOptionLabel={(option) => option.name}
          value={formData.users || []}
          onChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, users: newValue }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Select Users" />
          )}
        />

        {/* Autocomplete for Clients */}
        <Autocomplete
          className="mt-10"
          multiple
          options={project?.clients || []}
          getOptionLabel={(option) => option.name}
          value={formData.clients || []}
          onChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, clients: newValue }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Select Clients" />
          )}
        />

        {/* Autocomplete for Tags */}
        <Autocomplete
          className="mt-10"
          multiple
          options={["design", "website", "development", "marketing"]}
          getOptionLabel={(option) => option}
          value={formData.tags || []}
          onChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, tags: newValue }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Select Tags" />
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

// Define prop types
UpdateTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    budget: PropTypes.string,
    startsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    endsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        image: PropTypes.string,
      })
    ),
    clients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        image: PropTypes.string,
      })
    ),
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Define default props (if necessary)
UpdateTaskDialog.defaultProps = {
  project: null,
};

export default UpdateTaskDialog;
