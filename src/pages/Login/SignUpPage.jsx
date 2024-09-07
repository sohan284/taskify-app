import { Button, TextField, Alert } from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useState } from "react";

function SignUpPage() {
  const [signInWithGoogle, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password) => {
    // Password must be at least 6 characters long
    return password.length >= 6;
  };

  const handleSignUp = () => {
    setErrorMsg(null); // Clear any previous errors

    if (!email || !password || !cPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }

    if (password !== cPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!validatePasswordStrength(password)) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    createUserWithEmailAndPassword(email, password)
      .then(() => {
        navigate("/"); // Navigate to home page after successful sign-up
      })
      .catch((err) => {
        setErrorMsg(err.message);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        navigate("/"); // Navigate to home page after successful Google sign-in
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
        <p className="text-gray-500 mt-1">Sign up for an account</p>
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
        <TextField
          label="Re-enter Password"
          size="small"
          type="password"
          value={cPassword}
          onChange={(e) => setCPassword(e.target.value)}
          style={{
            marginTop: 20,
          }}
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
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <p className="text-center my-5">
          {"Already have an account?"}{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#5b46bb] cursor-pointer "
          >
            Login
          </span>
        </p>

        <Button
          onClick={handleGoogleSignIn}
          style={{ backgroundColor: "tomato", marginTop: 20, color: "white" }}
          className="w-full"
          disabled={googleLoading}
        >
          {googleLoading ? (
            "Signing In..."
          ) : (
            <>
              <GoogleIcon className="mr-3" /> Sign In With Google
            </>
          )}
        </Button>

        {error && (
          <Alert severity="error" className="mt-4">
            {error.message}
          </Alert>
        )}

        {googleError && (
          <Alert severity="error" className="mt-4">
            {googleError.message}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
