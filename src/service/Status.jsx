import axios from "axios";
const createStatus = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/statuses`, data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the status:", error);
    throw error;
  }
};
const getStatusList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/statuses");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateStatus = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/statuses/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update status list:", error);
    throw error;
  }
};
const deleteStatus = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/statuses/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};

// Attach the functions to an object
const StatusManagement = {
  getStatusList,
  createStatus,
  updateStatus,
  deleteStatus,
};

// Export the object
export default StatusManagement;
