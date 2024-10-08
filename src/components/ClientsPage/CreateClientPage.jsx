import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  FormControl,
  Grid,
  FormControlLabel,
  Checkbox,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserManagement from "../../service/User";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const CreateClientPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
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
    role: "client",
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

  const handleCreate = () => {
    const newProject = {
      ...formData,
      phoneNumber: phone,
    };

    UserManagement.upsertUser(newProject)
      .then(() => {
        toast.success("Status Created Successfully");
        setFormData({
          displayName: "",
          lastName: "",
          email: "",
          company: "",
          countryCode: "+1",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          dateOfJoining: "",
          role: "client",
          address: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          status: false,
          requireEmailVerification: false,
          photoURL: null,
        });
        navigate("/clients");
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
      href="/clients"
      onClick={() => handleClick("/clients")}
    >
      Clients
    </Link>,
    <Link style={{ fontWeight: 500 }} underline="hover" key="2" color="inherit">
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
                <p className="text-xs text-gray-500">Company *</p>
                <TextField
                  placeholder="Please Enter Company"
                  name="company"
                  type="text"
                  size="small"
                  value={formData.company}
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

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}

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
              {formData.photoURL && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Uploaded Image:</p>
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

CreateClientPage.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateClientPage;
