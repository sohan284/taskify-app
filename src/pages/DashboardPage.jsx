import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
import EventsTab from "../components/DashboardPage/EventsTab";
import ProjectsTasksTab from "../components/DashboardPage/ProjectsTasksTab";
import DashboardManagement from "../service/Dashboard";
import ProjectManagement from "../service/Project";
import { useDispatch, useSelector } from "react-redux";
import { setResetProjects } from "../store/features/projectSlice";
import Loading from "../shared/Loading";

function DashboardPage() {
  const dispatch = useDispatch();
  const resetProjects = useSelector((state) => state.project.resetProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [chartDetails, setChartDetails] = useState([]);
  let cardDetails = [
    {
      _id: "66dbda4e634dfb28c415b5c8",
      title: "Projects",
      total: projectCount,
      color: "#70d100",
    },
    {
      _id: "66dbda4e634dfb28c415b5c9",
      title: "Tasks",
      total: 463,
      color: "#852bfa",
    },
    {
      _id: "66dbda4e634dfb28c415b5ca",
      title: "Users",
      total: 75,
      color: "#ebb400",
    },
    {
      _id: "66dbda4e634dfb28c415b5cb",
      title: "Clients",
      total: 34,
      color: "#00b9d1",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ProjectManagement.getProjectList();
        const projects = result?.data || [];

        setProjectCount(projects.length);

        // Aggregate data for the charts
        const statusCounts = projects.reduce((acc, project) => {
          const status = project.status; // Assuming `status` is a field in your project data
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const statusLabels = Object.keys(statusCounts);
        const statusSeries = Object.values(statusCounts);

        // Update chartDetails based on the transformed data
        setChartDetails([
          {
            title: "Project Statistics",
            series: statusSeries,
            labels: statusLabels,
            colors: ["#70d100", "#00b9d1", "#ebb400", "#852bfa"], // Customize this as needed
          },
          {
            title: "Task Statistics",
            series: [20, 50, 38, 28], // Placeholder for task data; update as needed
            labels: ["Started", "Default", "On Going", "In Review"],
            colors: ["#ebb400", "#852bfa", "#00b9d1", "#70d100"],
          },
          {
            title: "Todos Overview",
            series: [20, 50, 38, 28], // Placeholder for todo data; update as needed
            labels: ["Apples", "Oranges", "Bananas"],
            colors: ["#00b9d1", "#70d100", "#ebb400", "#852bfa"],
          },
        ]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        dispatch(setResetProjects(false));
      }
    };

    fetchData();
  }, [resetProjects, dispatch]);

  return (
    <div className="lg:ml-64 mt-20 sm:ml-64">
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : error ? (
        <div>Error loading data: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mx-3">
            {cardDetails?.length > 0 ? (
              cardDetails.map((detail) => (
                <div key={detail.title}>
                  <CustomCard
                    title={detail.title}
                    color={detail.color}
                    total={detail.total}
                  />
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-3 mt-5">
            {chartDetails?.map((detail) => (
              <div key={detail.title} className="shadow-lg">
                <CustomChart
                  title={detail?.title}
                  series={detail?.series}
                  labels={detail?.labels}
                  colors={detail?.colors}
                />
              </div>
            ))}
          </div>
          <div>
            <EventsTab />
          </div>
          <div>
            <ProjectsTasksTab />
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
