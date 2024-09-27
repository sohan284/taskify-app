import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  FormControl,
  Grid,
  Select,
  MenuItem,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch } from "react-redux";
import UserManagement from "../service/User";
import { setReloadUsers } from "../store/features/userSlice";
const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    dateOfJoining: "",
    role: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    status: false,
    requireEmailVerification: false,
    photoURL: null,
  });
  useEffect(() => {
    UserManagement.getSingleUser(id).then((res) => {
      setFormData({
        displayName: res.data.displayName,
        lastName: res.data.lastName,
        email: res.data.email,
        countryCode: res.data.countryCode || "+1",
        password: res.data.password,
        confirmPassword: res.data.password,
        dateOfBirth: res.data.dateOfBirth,
        dateOfJoining: res.data.dateOfJoining,
        role: res.data.role,
        address: res.data.address,
        city: res.data.city,
        state: res.data.state,
        country: res.data.country,
        zipCode: res.data.zipCode,
        status: res.data.status,
        requireEmailVerification: res.data.requireEmailVerification,
        photoURL: res.data.photoURL,
      });
      setPhone(res.data.phoneNumber);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      // Check for image type and file size (e.g., max 5MB)
      if (!file.type.startsWith("image/")) {
        toast.warning("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.warning("File size exceeds 5MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoURL: reader.result, // Set the photoURL to the file's data URL
        }));
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submit logic here
  };

  const handleUpsert = () => {
    const newProject = {
      ...formData,
      phoneNumber: phone,
    };

    UserManagement.upsertUser(newProject)
      .then(() => {
        toast.success("User Created Successfully");
        setFormData({
          displayName: "",
          lastName: "",
          email: "",
          countryCode: "+1",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          dateOfJoining: "",
          role: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          status: false,
          requireEmailVerification: false,
          photoURL: null,
        });
        dispatch(setReloadUsers(true));
        navigate("/users");
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  };
  function handleClick(event) {
    event.preventDefault();
    navigate(`${event}`);
  }
  const breadcrumbs = [
    <Link
      style={{ fontWeight: 400 }}
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => handleClick("/")}
    >
      Home
    </Link>,
    <Link style={{ fontWeight: 400 }} underline="none" key="2" color="inherit">
      Profile
    </Link>,
    <Link style={{ fontWeight: 500 }} underline="none" key="2" color="black">
      {formData?.displayName}
    </Link>,
  ];
  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      <div className="flex justify-between">
        <Stack className="py-5" spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <div className="mt-6 flex h-8"></div>
      </div>

      <div className=" rounded-lg shadow-lg p-5">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            {formData.photoURL && (
              <div className="mt-4 col-span-1">
                <img
                  src={formData.photoURL}
                  alt="Uploaded Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    margin: "5px",
                  }}
                />
              </div>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="dense"
                style={{ margin: "20px", marginBlock: "50px" }}
              >
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ accept: "image/*" }}
                  size="small"
                />
              </FormControl>
            </Grid>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">First Name *</p>
                <TextField
                  autoFocus
                  placeholder="Please Enter First Name"
                  name="displayName"
                  type="text"
                  size="small"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Last Name *</p>
                <TextField
                  placeholder="Please Enter Last Name"
                  name="lastName"
                  type="text"
                  size="small"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">E-mail *</p>
                <TextField
                  placeholder="Please Enter Email"
                  name="email"
                  type="email"
                  disabled
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Phone Number</p>
                <PhoneInput
                  name="phone"
                  className="border h-10 p-1 rounded border-gray-300"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="BD" // Set default country
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Password *</p>
                <TextField
                  placeholder="Please Enter Password"
                  name="password"
                  type="password"
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Confirm Password *</p>
                <TextField
                  placeholder="Please Re Enter Password"
                  name="confirmPassword"
                  type="password"
                  size="small"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Date of Birth</p>
                <TextField
                  placeholder="Please Select"
                  name="dateOfBirth"
                  type="date"
                  size="small"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Date of Joining</p>
                <TextField
                  placeholder="Please Select"
                  name="dateOfJoining"
                  type="date"
                  size="small"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Address</p>
                <TextField
                  placeholder="Please Enter Address"
                  name="address"
                  type="text"
                  size="small"
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">City</p>
                <TextField
                  placeholder="Please Enter City"
                  name="city"
                  type="text"
                  size="small"
                  value={formData.city}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">State</p>
                <TextField
                  placeholder="Please Enter State"
                  name="state"
                  type="text"
                  size="small"
                  value={formData.state}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Country</p>
                <TextField
                  placeholder="Please Enter Country"
                  name="country"
                  type="text"
                  size="small"
                  value={formData.country}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Zip Code</p>
                <TextField
                  placeholder="Please Enter Zip Code"
                  name="zipCode"
                  type="text"
                  size="small"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Role</p>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
        <div className="mt-10">
          <Button
            variant="contained"
            style={{ backgroundColor: "#8064ff", marginRight: "10px" }}
            onClick={handleUpsert}
          >
            Update
          </Button>
          <Button style={{ border: "1px solid gray", color: "gray" }}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfilePage;
