import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  NativeSelect,
} from "@mui/material";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import StatusManagement from "../../service/Status";
import CloseDialog from "../../shared/CloseDialog";
import { setReloadStatuses } from "../../store/features/statusSlice";

const CreateStatusesDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    txColor: "",
    bgColor: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    const newProject = {
      ...formData,
      txColor: color?.txColor || "", // Add the color title
      bgColor: color?.bgColor || "",
    };

    StatusManagement.createStatus(newProject)
      .then(() => {
        toast.success("Status Created Successfully");
        onClose();
        setFormData({
          title: "",
          txColor: "",
          bgColor: "",
        });
        dispatch(setReloadStatuses(true));
      })

      .catch((error) => {
        toast.error(`${error}`);
      });
  };

  const handleChangeColor = (e) => {
    const selectedColor = colorSet.find((col) => col.title === e.target.value);
    setColor(selectedColor);
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          width: "80%",
        },
      }}
      onClose={onClose}
    >
      <CloseDialog title="Create Status" handleClose={onClose} />

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
              name="status"
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
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateStatusesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateStatusesDialog;
