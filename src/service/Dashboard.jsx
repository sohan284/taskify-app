import axios from "axios";

// Define the functions
const getDashboardCount = async () => {
  try {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/dashboardCount"
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard count:", error);
    throw error;
  }
};

// Attach the functions to an object
const DashboardManagement = {
  getDashboardCount,
};

// Export the object
export default DashboardManagement;
