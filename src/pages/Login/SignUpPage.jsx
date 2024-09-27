import {
  Button,
  TextField,
  Alert,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserManagement from "../../service/User";
import { toast } from "react-toastify";

function SignUpPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("client");
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
    role: "client", // Default role is client
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    status: false,
    requireEmailVerification: false,
    photoURL: null,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    setErrorMsg(null);

    const { displayName, email, password, confirmPassword } = formData;

    // Basic validation
    if (!displayName || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }

    if (!validatePasswordStrength(password)) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await UserManagement.upsertUser(formData);

      toast.success("User created successfully");

      // Clear form fields
      setFormData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: userType === "client" ? "client" : formData.role, // Reset role based on userType
      });

      navigate("/login");
    } catch (error) {
      setErrorMsg(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleUserType = (user) => {
    setUserType(user);
    setFormData((prev) => ({
      ...prev,
      role: user === "client" ? "client" : prev.role, // Set role to "client" for client type
    }));
  };

  return (
    <div className="flex justify-center my-20">
      <div className="text-start p-5 w-[400px] rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img className="w-[80%]" src={logo} alt="Logo" />
        </div>
        <h2 className="text-xl font-medium text-gray-500 mt-8">
          Welcome to Taskify!
        </h2>
        <p className="text-gray-500 mt-1">Sign up for an account</p>
        <div className="grid grid-cols-2 mt-5">
          <div
            onClick={() => handleUserType("client")}
            className={`border ${
              userType === "client" ? "text-[white] bg-[#6479f3]" : "bg-white"
            } border-[#8064ff] text-[#8064ff] w-full text-center font-medium rounded-s-md p-2 hover:bg-[#8064ff] hover:text-white hover:shadow-2xl`}
          >
            As a Client
          </div>
          <div
            onClick={() => handleUserType("member")}
            className={`border ${
              userType === "member" ? "text-[white] bg-[#6479f3]" : "bg-white"
            } border-[#8064ff] text-[#8064ff] w-full text-center font-medium rounded-e-md p-2 hover:bg-[#8064ff] hover:text-white hover:shadow-2xl`}
          >
            As a Team member
          </div>
        </div>
        <TextField
          label="Your Name"
          size="small"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
          style={{ marginTop: 40 }}
          className="w-full text-sm"
        />
        {userType === "client" ? (
          <TextField
            label="Your Company"
            size="small"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            style={{ marginTop: 20 }}
            className="w-full text-sm"
          />
        ) : (
          <FormControl fullWidth margin="dense" style={{ marginTop: "20px" }}>
            <Select
              name="role"
              value={formData.role === "client" ? "Select Role" : formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              size="small"
            >
              <MenuItem value="Select Role" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField
          label="Your Email"
          size="small"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ marginTop: 20 }}
          className="w-full text-sm"
        />
        <TextField
          label="Password"
          size="small"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{ marginTop: 20 }}
          className="w-full text-sm"
        />
        <TextField
          label="Re-enter Password"
          size="small"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          style={{ marginTop: 20 }}
          className="w-full text-sm"
        />
        {errorMsg && (
          <Alert severity="error" className="mt-3">
            {errorMsg}
          </Alert>
        )}
        <Button
          style={{ backgroundColor: "#6479f3", marginTop: 20, color: "white" }}
          className="w-full"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <p className="text-center my-5">
          {"Already have an account?"}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#6479f3] cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
