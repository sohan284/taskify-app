import axios from "axios";
const createPriority = async (data) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/priorities`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the priority:", error);
    throw error;
  }
};
const getPriorityList = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/priorities"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updatePriority = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/priorities/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update priority list:", error);
    throw error;
  }
};
const deletePriority = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/priorities/${id}`
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};
const deletePriorities = async (ids) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/priorities/delete/multiple`, // Bulk delete endpoint
      {
        headers: {
          "Content-Type": "application/json", // Make sure headers are set for JSON
        },
        data: { ids }, // Pass the array of IDs in the request body
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete priorities:", error);
    throw error;
  }
};

// Attach the functions to an object
const PriorityManagement = {
  getPriorityList,
  createPriority,
  updatePriority,
  deletePriority,
  deletePriorities,
};

// Export the object
export default PriorityManagement;
