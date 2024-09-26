import axios from "axios";
const createTag = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/tags`, data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the tag:", error);
    throw error;
  }
};
const getTagList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/tags");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateTag = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:5000/tags/${id}`, data); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update tag list:", error);
    throw error;
  }
};
const deleteTag = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/tags/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};

// Attach the functions to an object
const TagManagement = {
  getTagList,
  createTag,
  updateTag,
  deleteTag,
};

// Export the object
export default TagManagement;
