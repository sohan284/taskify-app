import axios from "axios";
const createTodos = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/todos`, data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the todos:", error);
    throw error;
  }
};
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
const deleteTodos = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/todos/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
};

// Attach the functions to an object
const TodoManagement = {
  getTodosList,
  createTodos,
  updateTodoStatus,
  deleteTodos,
};

// Export the object
export default TodoManagement;
