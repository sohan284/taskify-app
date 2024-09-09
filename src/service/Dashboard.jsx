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

// Attach the functions to an object
const DashboardManagement = {
  getDashboardCount,
  getProjectList,
};

// Export the object
export default DashboardManagement;
