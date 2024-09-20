import axios from "axios";

const upsertUser = async (userData) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/users`,
      userData
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the user:", error);
    throw error;
  }
};
const getUserList = async (role = "") => {
  try {
    const response = await axios.get(
      `https://taskify-server-iota.vercel.app/users?role=${role}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    throw error;
  }
};
const getSingleUser = async (id) => {
  try {
    const response = await axios.get(
      `https://taskify-server-iota.vercel.app/users/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch User:", error);
    throw error;
  }
};
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/users/${id}`
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete :", error);
    throw error;
  }
};
// Attach the functions to an object
const UserManagement = {
  upsertUser,
  getUserList,
  getSingleUser,
  deleteUser,
};

// Export the object
export default UserManagement;
