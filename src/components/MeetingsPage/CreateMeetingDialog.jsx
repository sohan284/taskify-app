import dayjs from "dayjs";
import { useEffect, useState } from "react";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Import DateTimePicker
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import UserManagement from "../../service/User";
import MeetingManagement from "../../service/Meeting";
import CloseDialog from "../../shared/CloseDialog";
import { setReloadMeetings } from "../../store/features/meetingSlice";

const CreateMeetingDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]); // Users fetched from API
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    budget: "",
    startsAt: null,
    endsAt: null,
    users: [], // Selected users
    clients: [],
    tags: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserManagement.getUserList();
        setUsers(response.data);
        const response2 = await UserManagement.getUserList("client");
        setClients(response2.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setReloadMeetings(true));
      }
    };

    fetchData();
  }, [dispatch]);

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    const newMeeting = {
      ...formData,
      startsAt: formData.startsAt
        ? dayjs(formData.startsAt).format("YYYY-MM-DD HH:mm")
        : null,
      endsAt: formData.endsAt
        ? dayjs(formData.endsAt).format("YYYY-MM-DD HH:mm")
        : null,
    };

    MeetingManagement.createMeeting(newMeeting)
      .then(() => {
        toast.success("Meeting Created Successfully");
        onClose();
        setFormData({
          title: "",
          priority: "",
          budget: "",
          startsAt: null,
          endsAt: null,
          users: [], // Selected users
          clients: [],
          tags: [],
        });
        dispatch(setReloadMeetings(true));
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
      <CloseDialog title="Create Meeting" handleClose={onClose} />
      <DialogContent>
        <div className="grid gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter meeting title"
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
            <p className="text-xs mt-2 text-gray-500">START DATE & TIME</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={formData.startsAt || null}
                onChange={(newDate) => handleDateChange("startsAt", newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select start date and time"
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-gray-500">END DATE & TIME</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={formData.endsAt || null}
                onChange={(newDate) => handleDateChange("endsAt", newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select end date and time"
                  />
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

CreateMeetingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateMeetingDialog;
