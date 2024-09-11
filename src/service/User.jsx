import axios from "axios";

const upsertUser = async (userData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/users`,
      userData
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the user:", error);
    throw error;
  }
};
const getUserList = async ()=>{
    try {
        const response = await axios.get("http://localhost:5000/users");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch task list:", error);
        throw error;
      }
}


// Attach the functions to an object
const UserManagement = {
 upsertUser,
 getUserList,
};

// Export the object
export default UserManagement;
