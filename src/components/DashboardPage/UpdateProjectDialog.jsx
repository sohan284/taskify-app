import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const UpdateProjectDialog = ({ open, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={formData.title || ""}
          onChange={handleChange}
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Define prop types
UpdateProjectDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Should be a boolean and required
  onClose: PropTypes.func.isRequired, // Should be a function and required
  project: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    // Define other project properties as needed
  }),
  onSave: PropTypes.func.isRequired, // Should be a function and required
};

// Define default props (if necessary)
UpdateProjectDialog.defaultProps = {
  project: null, // Default value for project prop
};

export default UpdateProjectDialog;
