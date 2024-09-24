import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import UserManagement from "../../service/User";
import MeetingManagement from "../../service/Meeting";
import CloseDialog from "../../shared/CloseDialog";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { setReloadMeetings } from "../../store/features/meetingSlice";

const UpdateMeetingDialog = ({ open, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (project) {
      UserManagement.getUserList().then((res) => setUsers(res?.data));
      UserManagement.getUserList("client").then((res) => setClients(res?.data));
      setFormData({
        ...project,
        startsAt: project.startsAt ? dayjs(project.startsAt) : null,
        endsAt: project.endsAt ? dayjs(project.endsAt) : null,
        status: project.status || {}, // Initialize status as an object
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

    console.log("Before formatting:", formData.startsAt, formData.endsAt); // Debugging to see if values are correct

    const formattedUpdateData = {
      ...updateData,
      startsAt: formData.startsAt
        ? dayjs(formData.startsAt).format("YYYY-MM-DDTHH:mm:ss") // Ensure dayjs formatting properly
        : null,
      endsAt: formData.endsAt
        ? dayjs(formData.endsAt).format("YYYY-MM-DDTHH:mm:ss")
        : null,
    };

    console.log("Formatted update data:", formattedUpdateData); // Debugging to check formatted data

    MeetingManagement.updateMeeting(_id, formattedUpdateData)
      .then(() => {
        toast.success("Meeting Updated Successfully");
        onSave(formData);
        onClose();
        dispatch(setReloadMeetings(true));
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
      <CloseDialog title="Update Meeting" handleClose={onClose} />

      <DialogContent>
        <div className="grid gap-5">
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
            <p className="text-xs mt-2 text-gray-500">START DATE & TIME</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                format="DD-MM-YYYY HH:mm"
                value={formData.startsAt || null}
                onChange={(newDate) => handleDateChange("startsAt", newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">END DATE & TIME</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                format="DD-MM-YYYY HH:mm"
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

UpdateMeetingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default UpdateMeetingDialog;
