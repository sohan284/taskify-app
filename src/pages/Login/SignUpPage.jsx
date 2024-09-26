import { Button, TextField, Alert } from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserManagement from "../../service/User";
import { toast } from "react-toastify";

function SignUpPage() {
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
    role: "user",
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
      const newUser = {
        displayName,
        email,
        password,
        role: "user",
      };
      await UserManagement.upsertUser(newUser);

      toast.success("User created successfully");

      // Clear form fields
      setFormData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      setErrorMsg(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`);
    }
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
          style={{ backgroundColor: "#5b46bb", marginTop: 20, color: "white" }}
          className="w-full"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <p className="text-center my-5">
          {"Already have an account?"}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#5b46bb] cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
