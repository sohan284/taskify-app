import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  FormControl,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setReloadPage } from "../store/features/reloadSlice";
import { useNavigate } from "react-router-dom";
import UserManagement from "../service/User";

const CreateUsersPage = () => {
  const dispatch = useDispatch();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photoURL: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submit logic here
  };

  const handleCreate = () => {
    const newProject = {
      ...formData,
    };

    UserManagement.upsertUser(newProject)
      .then(() => {
        toast.success("Status Created Successfully");
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
        dispatch(setReloadPage(true));
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
    <Link
      style={{ fontWeight: 400 }}
      underline="hover"
      key="2"
      color="inherit"
      href="/users"
      onClick={() => handleClick("/users")}
    >
      Users
    </Link>,
    <Link
      style={{ fontWeight: 500 }}
      underline="hover"
      key="2"
      color="black"
      href="/users"
      onClick={() => handleClick("/users/create")}
    >
      Create
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
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">
                  Country Code and Phone Number
                </p>
                <TextField
                  placeholder="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  size="small"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <span>{formData.countryCode}</span>,
                  }}
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
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.status}
                    onChange={handleCheckboxChange}
                    name="status"
                  />
                }
                label="Active Status"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requireEmailVerification}
                    onChange={handleCheckboxChange}
                    name="requireEmailVerification"
                  />
                }
                label="Require Email Verification"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <p className="text-xs text-gray-500">Profile Picture</p>
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ accept: "image/*" }}
                  size="small"
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
};

CreateUsersPage.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateUsersPage;
