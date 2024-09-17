import axios from "axios";
const createNote = async (data) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/notes`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the status:", error);
    throw error;
  }
};
const getNotes = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/notes"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateNote = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/notes/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update note list:", error);
    throw error;
  }
};
const deleteNote = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/notes/${id}`
    ); // Replace with your API endpoint
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
  updateNote,
  deleteNote,
};

// Export the object
export default NoteManagement;
