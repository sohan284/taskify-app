import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  NativeSelect,
  FormControl,
} from "@mui/material";
import PriorityManagement from "../../service/Priority";
import { useDispatch } from "react-redux";
import CloseDialog from "../../shared/CloseDialog";
import { setReloadPriorities } from "../../store/features/prioritySlice";

const UpdatePrioritiesDialog = ({ open, onClose, priority }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    color: "",
  });

  const [color, setColor] = useState({
    title: "Primary",
    txColor: "#5a5ace",
    bgColor: "#5a5ace65",
  });

  const colorSet = [
    { title: "Primary", txColor: "#6464d3", bgColor: "#5a5ace65" },
    { title: "Secondary", txColor: "#56565a", bgColor: "#56565a50" },
    { title: "Success", txColor: "#41ff7a", bgColor: "#acf8c370" },
    { title: "Danger", txColor: "#da370f", bgColor: "#fa6b6b50" },
    { title: "Warning", txColor: "#ffb111", bgColor: "#fad96b50" },
    { title: "Info", txColor: "#2cb7da", bgColor: "#4ef3eb5e" },
    { title: "Dark", txColor: "#313131", bgColor: "#31313150" },
  ];

  // Update initial title and color based on the priority prop
  useEffect(() => {
    if (priority) {
      setFormData({
        title: priority?.title || "",
        txColor: priority?.txColor || "",
        bgColor: priority?.bgColor || "",
      });

      const selectedColor = colorSet.find(
        (col) => col.title === priority?.txColor
      );
      if (selectedColor) {
        setColor(selectedColor);
      }
    }
  }, [priority]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeColor = (e) => {
    const selectedColor = colorSet.find((col) => col.title === e.target.value);
    setColor(selectedColor);
    setFormData((prev) => ({ ...prev, txColor: selectedColor.txColor }));
  };

  const handleUpdate = async () => {
    try {
      await PriorityManagement.updatePriority(priority._id, formData);
      onClose();
      dispatch(setReloadPriorities(true));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          width: "80%",
        },
      }}
      open={open}
      onClose={onClose}
    >
      <CloseDialog title="Update Priority" handleClose={onClose} />

      <DialogContent>
        <div className="grid grid-cols-1 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter title"
              name="title"
              type="text"
              size="small"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-[#313131] text-gray-500">COLOR</p>
            <NativeSelect
              name="priority"
              style={{
                fontSize: "12px",
                borderRadius: "5px",
                height: "36px",
                textAlign: "center",
                backgroundColor: color ? color.bgColor : "#5a5ace65",
                color: color ? color.txColor : "#5a5ace",
              }}
              disableUnderline={true}
              value={color?.title || ""}
              onChange={handleChangeColor}
            >
              {colorSet.map((el) => (
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

UpdatePrioritiesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  priority: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdatePrioritiesDialog;
