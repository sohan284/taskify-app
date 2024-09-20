import axios from "axios";
const createTag = async (data) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/tags`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the tag:", error);
    throw error;
  }
};
const getTagList = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/tags"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateTag = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/tags/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update tag list:", error);
    throw error;
  }
};
const deleteTag = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/tags/${id}`
    ); // Replace with your API endpoint
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
