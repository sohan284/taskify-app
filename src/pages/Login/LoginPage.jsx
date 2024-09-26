import { Button, TextField, Alert } from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserManagement from "../../service/User";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMsg(null); // Clear any previous error messages

    // Validate input fields
    if (!email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await UserManagement.loginUser(email, password);

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setErrorMsg("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Invalid email or password.");
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
        <p className="text-gray-500 mt-1">Sign into your account</p>

        <TextField
          label="Your Email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: 40 }}
          className="w-full text-sm"
        />
        <TextField
          label="Password"
          size="small"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: 20 }}
          className="w-full text-sm"
        />
        {errorMsg && (
          <Alert severity="error" className="mt-4">
            {errorMsg}
          </Alert>
        )}

        <Button
          style={{ backgroundColor: "#8064ff", marginTop: 20, color: "white" }}
          className="w-full"
          onClick={handleLogin}
        >
          Login
        </Button>

        <p className="text-center my-5">
          {"Don't have an account?"}{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#8064ff] cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
