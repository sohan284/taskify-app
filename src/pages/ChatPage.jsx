import { useState, useEffect } from "react";
import io from "socket.io-client";
import UserManagement from "../service/User";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [userList, setUserList] = useState([]); // Store user list

  useEffect(() => {
    // Fetch user list
    const fetchUsers = async () => {
      const users = await UserManagement.getUserList();
      setUserList(users.data);
    };
    fetchUsers();

    // Join as a user (replace with actual user ID)
    const userId = "User Name"; // Change to actual user ID or username
    socket.emit("join", userId);

    // Listen for messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input && recipient) {
      const messageData = {
        to: recipient, // Recipient user ID
        message: input,
      };
      socket.emit("message", messageData);
      setInput("");
    }
  };

  return (
    <div className="chat-container lg:ml-64 mt-20 mx-2 sm:ml-64">
      <div className="user-list">
        <select
          onChange={(e) => setRecipient(e.target.value)}
          value={recipient || ""}
        >
          <option value="">Select a recipient</option>
          {userList?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.message}{" "}
            <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
