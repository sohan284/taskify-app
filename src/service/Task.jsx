import axios from "axios";

const createTask = async (taskData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/tasks`,
      taskData
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the task:", error);
    throw error;
  }
};
const getTaskList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/tasks");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    throw error;
  }
};
const updateTask = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/tasks/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update task list:", error);
    throw error;
  }
};
const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/tasks/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update task list:", error);
    throw error;
  }
};
const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/tasks/${taskId}`,
      { status }
    );
    if (response.data.success) {
      console.log("Task status updated successfully");
    } else {
      console.error("Failed to update task status:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};


// Attach the functions to an object
const TaskManagement = {
  getTaskList,
  updateTask,
  deleteTask,
  updateTaskStatus,
  createTask,
};

// Export the object
export default TaskManagement;
