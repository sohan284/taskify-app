import axios from "axios";
const createTodos = async (data) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/todos`,
      data
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the todos:", error);
    throw error;
  }
};
const getTodosList = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/todos"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateTodoStatus = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/todos/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update task list:", error);
    throw error;
  }
};
const deleteTodos = async (id) => {
  try {
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/todos/${id}`
    ); // Replace with your API endpoint
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
