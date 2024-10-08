import { useState } from "react";
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
} from "@mui/material";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import TodoManagement from "../../service/Todo";
import CloseDialog from "../../shared/CloseDialog";
import { setReloadTodos } from "../../store/features/todoSlice";
const CreateTodosDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    description: "",
    status: false,
    date: new Date(),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    const newProject = {
      ...formData,
    };

    TodoManagement.createTodos(newProject)
      .then(() => {
        toast.success("Project Created Successfully");
        onClose();
        setFormData({
          title: "",
          priority: "",
          description: "",
          status: false,
          date: new Date(),
        });
        dispatch(setReloadTodos(true));
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
          width: "80%",
          maxWidth: "800px",
        },
      }}
      onClose={onClose}
    >
      <CloseDialog title="Update Todos" handleClose={onClose} />
      <DialogContent>
        <div className="grid grid-cols-1 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter  title"
              name="title"
              type="text"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
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
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">DESCRIPTION</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter Description"
              name="description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              required
            />
          </FormControl>
        </div>
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

CreateTodosDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTodosDialog;
