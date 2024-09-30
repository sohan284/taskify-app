import axios from "axios";
const createLog = async (data) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/logs`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the log:", error);
    throw error;
  }
};
const getLogList = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/logs"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const deleteLog = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/logs/${id}`
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};
const deleteLogs = async (ids) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/logs/delete/multiple`, // Bulk delete endpoint
      {
        headers: {
          "Content-Type": "application/json", // Make sure headers are set for JSON
        },
        data: { ids }, // Pass the array of IDs in the request body
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete logs:", error);
    throw error;
  }
};

// Attach the functions to an object
const LogManagement = {
  getLogList,
  createLog,
  deleteLog,
  deleteLogs,
};

// Export the object
export default LogManagement;
