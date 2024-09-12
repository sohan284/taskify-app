import axios from "axios";

const getTodosList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/todos");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateTodoStatus = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:5000/todos/${id}`, data); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update task list:", error);
    throw error;
  }
};

// Attach the functions to an object
const TodoManagement = {
  getTodosList,
  updateTodoStatus,
};

// Export the object
export default TodoManagement;
