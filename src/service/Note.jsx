import axios from "axios";
const createNote = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/notes`, data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the status:", error);
    throw error;
  }
};
const getNotes = async () => {
  try {
    const response = await axios.get("http://localhost:5000/notes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateStatus = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/statuses/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update status list:", error);
    throw error;
  }
};
const deleteNote = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/notes/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};

// Attach the functions to an object
const NoteManagement = {
  getNotes,
  createNote,
  updateStatus,
  deleteNote,
};

// Export the object
export default NoteManagement;
