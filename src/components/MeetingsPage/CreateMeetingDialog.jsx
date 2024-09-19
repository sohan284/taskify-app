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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setReloadPage } from "../../store/features/reloadSlice";
import UserManagement from "../../service/User";
import MeetingManagement from "../../service/Meeting";
import CloseDialog from "../../shared/CloseDialog";

const CreateMeetingDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]); // Users fetched from API
  // const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    priority: "",
    budget: "",
    startsAt: null,
    endsAt: null,
    users: [], // Selected users
    clients: [],
    tags: [],
    favourite: true,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserManagement.getUserList();
        setUsers(response.data); // Set the user list
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setReloadPage(false));
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
        ? dayjs(formData.startsAt).format("YYYY-MM-DD")
        : null,
      endsAt: formData.endsAt
        ? dayjs(formData.endsAt).format("YYYY-MM-DD")
        : null,
    };

    MeetingManagement.createMeeting(newMeeting)
      .then(() => {
        toast.success("Meeting Created Successfully");
        onClose();
        dispatch(setReloadPage(true));
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
          options={users}
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
