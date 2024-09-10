import axios from "axios";

// Define the functions
const getDashboardCount = async () => {
  try {
    const response = await axios.get("http://localhost:5000/dashboardCount"); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard count:", error);
    throw error;
  }
};

const getProjectList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/projects"); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to fetch project list:", error);
    throw error;
  }
};
const updateProject = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/projects/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update project list:", error);
    throw error;
  }
};
const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/projects/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update project list:", error);
    throw error;
  }
};
const updateProjectStatus = async (projectId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/projects/${projectId}`,
      { status }
    );
    if (response.data.success) {
      console.log("Project status updated successfully");
    } else {
      console.error("Failed to update project status:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating project status:", error);
  }
};

// Attach the functions to an object
const DashboardManagement = {
  getDashboardCount,
  getProjectList,
  updateProject,
  deleteProject,
  updateProjectStatus,
};

// Export the object
export default DashboardManagement;
