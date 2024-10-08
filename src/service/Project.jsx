import axios from "axios";

const createProject = async (projectData) => {
  try {
    const response = await axios.post(
      `https://taskify-server-iota.vercel.app/projects`,
      projectData
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the project:", error);
    throw error;
  }
};
const getProjectList = async (
  status = "",
  user = "",
  client = "",
  start_date_from = "",
  start_date_to = "",
  end_date_from = "",
  end_date_to = "",
  search = ""
) => {
  try {
    const response = await axios.get(
      `https://taskify-server-iota.vercel.app/projects?status=${status}&user=${user}&client=${client}&start_date_from=${start_date_from}&start_date_to=${start_date_to}&end_date_from=${end_date_from}&end_date_to=${end_date_to}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch project list:", error);
    throw error;
  }
};
const getFavouriteProjectList = async (
  status = "",
  user = "",
  client = "",
  start_date_from = "",
  start_date_to = "",
  end_date_from = "",
  end_date_to = "",
  search = ""
) => {
  try {
    const response = await axios.get(
      `https://taskify-server-iota.vercel.app/projects/favourite?status=${status}&user=${user}&client=${client}&start_date_from=${start_date_from}&start_date_to=${start_date_to}&end_date_from=${end_date_from}&end_date_to=${end_date_to}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch project list:", error);
    throw error;
  }
};
const updateProject = async (id, data) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/projects/${id}`,
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
    const response = await axios.delete(
      `https://taskify-server-iota.vercel.app/projects/${id}`
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update project list:", error);
    throw error;
  }
};
const updateProjectStatus = async (projectId, status) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/projects/${projectId}`,
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

const updateProjectFavourite = async (projectId, favourite) => {
  try {
    const response = await axios.put(
      `https://taskify-server-iota.vercel.app/projects/${projectId}`,
      { favourite }
    );
    if (response.data.success) {
      console.log("Project updated successfully");
    } else {
      console.error("Failed to update project:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating project :", error);
  }
};

// Attach the functions to an object
const ProjectManagement = {
  getProjectList,
  updateProject,
  deleteProject,
  updateProjectStatus,
  createProject,
  updateProjectFavourite,
  getFavouriteProjectList,
};

// Export the object
export default ProjectManagement;
