import { Button, TextField, Alert } from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    setErrorMsg(null); // Clear any previous errors

    if (!email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }

    signInWithEmailAndPassword(email, password)
      .then(() => {
        navigate("/"); // Navigate to home page after successful login
      })
      .catch((err) => {
        setErrorMsg(err.message);
      });
  };

  return (
    <div className="flex justify-center my-20">
      <div className="text-start p-5 w-[400px] rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img
            onClick={() => navigate("/")}
            className="w-[80%]"
            src={logo}
            alt="Logo"
          />
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
          style={{
            marginTop: 40,
          }}
          className="w-full text-sm"
        />
        <TextField
          label="Password"
          size="small"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginTop: 20,
          }}
          className="w-full text-sm"
        />
        {errorMsg && (
          <Alert severity="error" className="mt-4">
            {errorMsg}
          </Alert>
        )}

        <Button
          style={{ backgroundColor: "#5b46bb", marginTop: 20, color: "white" }}
          className="w-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center my-5">
          {"Don't have an account?"}{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#5b46bb] cursor-pointer "
          >
            Sign Up
          </span>
        </p>

        {error && (
          <Alert severity="error" className="mt-4">
            {error.message}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
