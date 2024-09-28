import { useState, useEffect } from "react";
import io from "socket.io-client";
import UserManagement from "../service/User"; // Assuming this is a service to fetch users
import { useAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LuSendHorizonal } from "react-icons/lu";
import PropTypes from "prop-types";
import Loading from "../shared/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../store/features/userSlice";
const drawerWidth = 280;
const socket = io("http://localhost:4000");

const ChatPage = (props) => {
  const [loading, setLoading] = useState(false);
  const { userEmail } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState(""); // Store recipient ID
  // const [userList, setUserList] = useState([]); // Store user list
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [isClosing, setIsClosing] = useState(false);
  const [user, setUser] = useState("");
  const userList = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userList === null) {
      const fetchUsers = async () => {
        try {
          const users = await UserManagement.getUserList();
          dispatch(setUsers(users.data));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
    setLoading(false);

    socket.emit("join", userEmail);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for message history on joining
    socket.on("message history", (history) => {
      console.log("Message history received:", history);
      setMessages(history);
    });

    // Listen for user list updates (optional)
    socket.on("user list", (userList) => {
      console.log("User list updated:", userList);
      dispatch(setUsers(userList));
    });

    return () => {
      socket.off("message");
      socket.off("message history");
      socket.off("user list");
    };
  }, [userEmail]);
  useEffect(() => {
    if (recipient) {
      const foundUser = userList.find((u) => u.email === recipient);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [recipient, userList]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input && recipient) {
      const messageData = {
        to: recipient,
        message: input,
        timestamp: new Date(),
        user: userEmail,
      };
      socket.emit("message", messageData);
      setInput(""); // Clear input after sending
    } else {
      console.warn("Input or recipient is empty");
    }
  };

  // Filter messages to show only between current user and selected recipient
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === userEmail && msg.recipient === recipient) ||
      (msg.sender === recipient && msg.recipient === userEmail)
  );

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
  };
  const drawer = (
    <div>
      <img
        onClick={() => handleNavigate("/")}
        src={logo}
        alt="logo"
        style={{ cursor: "pointer" }}
      />

      <div className="mt-5 w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col pl-3">
            {userList?.map((user) => (
              <div className="" key={user._id}>
                <Button
                  key={user._id}
                  className="flex items-center w-full"
                  style={{
                    fontWeight: "500",
                    color: recipient === user.email ? "#ffffff" : "#888888",
                    backgroundColor:
                      recipient === user.email ? "#6479f3" : "#ffffff",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    marginBlock: "5px",
                  }}
                  onClick={() => {
                    setRecipient(user.email);
                    handleDrawerClose(); // Close the drawer after selection
                  }}
                >
                  <div className="w-8 h-8 rounded-full">
                    {user?.photoURL ? (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={user.photoURL}
                        alt=""
                      />
                    ) : (
                      <AccountCircleIcon style={{ fontSize: "32px" }} />
                    )}
                  </div>
                  <p className="pl-2">{user.displayName}</p>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="chat-container lg:ml-72 mt-20 mx-2 sm:ml-72">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px - 20px)` },
            left: { sm: `${drawerWidth + 10}px` },
            bgcolor: "white",
            color: "black",
          }}
        >
          <Toolbar sx={{ padding: "0 10px" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex justify-between w-full">
              <p className="text-gray-400"></p>
              <div className="flex">
                <p className="mr-3 mt-1.5">
                  <p className="uppercase font-semibold text-[#6479f3]">
                    {user.displayName}
                  </p>
                  <p className="text-[12px] text-gray-400">{user.email}</p>
                </p>
                {user?.photoURL ? (
                  <img
                    className="w-12 h-12 shadow shadow-black rounded-full"
                    src={user?.photoURL}
                    alt="img"
                  />
                ) : (
                  <AccountCircleIcon
                    style={{ color: "#6479f3", fontSize: "48px" }}
                  />
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
      <div className="messages p-1 min-h-[80vh]">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 flex ${
                msg.sender === userEmail ? "flex-row-reverse bg-blue" : ""
              }`}
            >
              <p className="border text-center  text-xs m-1 h-5 w-5 rounded-full bg-[gray] text-white shadow-lg">
                {msg.sender.slice(0, 2)}
              </p>
              <p
                className={`rounded-full shadow-lg border px-2 ${
                  msg.sender === userEmail
                    ? "bg-[#6479f3] shadow-md shadow-[#6479f3] text-white"
                    : "border-gray-100 bg-white text-black "
                }`}
              >
                {msg.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-black">No messages yet</div>
        )}
      </div>
      <div className="w-full p-3 mt-5 bg-blue-50 rounded-full flex items-center relative flex-col ">
        <form onSubmit={sendMessage} className="flex w-full">
          <input
            className="h-12 p-2 w-full rounded-full border"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            style={{ flexGrow: 1 }}
          />
          <button
            type="submit"
            className="ml-2 absolute rounded-full right-5 bottom-5 hover:scale-110"
          >
            <LuSendHorizonal
              style={{
                fontSize: "32",
                color: "white",
                padding: "5px",
                borderRadius: "20px",
                backgroundColor: "#6479f3",
              }}
            />
          </button>
        </form>
      </div>
    </div>
  );
};
ChatPage.propTypes = {
  window: PropTypes.any,
};
export default ChatPage;
