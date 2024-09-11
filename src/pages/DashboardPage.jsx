import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
import EventsTab from "../components/DashboardPage/EventsTab";
import ProjectsTasksTab from "../components/DashboardPage/ProjectsTasksTab";
import ProjectManagement from "../service/Project";
import { useDispatch, useSelector } from "react-redux";
import { setResetProjects } from "../store/features/projectSlice";
import Loading from "../shared/Loading";
import TaskManagement from "../service/Task";

function DashboardPage() {
  const dispatch = useDispatch();
  const resetProjects = useSelector((state) => state.project.resetProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [chartDetails, setChartDetails] = useState([]);
  let cardDetails = [
    {
      title: "Projects",
      total: projectCount,
      color: "#70d100",
    },
    {
      title: "Tasks",
      total: taskCount,
      color: "#852bfa",
    },
    {
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
        // get projects
        const projectResult = await ProjectManagement.getProjectList();
        const projects = projectResult?.data || [];

        setProjectCount(projects.length);

        // Aggregate data for the charts
        const projectsCounts = projects.reduce((acc, project) => {
          const status = project.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const projectLabels = Object.keys(projectsCounts);
        const projectSeries = Object.values(projectsCounts);

        // get tasks
        const TaskResult = await TaskManagement.getTaskList();
        const tasks = TaskResult?.data || [];

        setTaskCount(tasks.length);

        const taskCounts = tasks.reduce((acc, task) => {
          const status = task.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const taskLabels = Object.keys(taskCounts);
        const taskSeries = Object.values(taskCounts);

        // Update chartDetails based on the transformed data
        setChartDetails([
          {
            title: "Project Statistics",
            series: projectSeries,
            labels: projectLabels,
            colors: ["#70d100", "#00b9d1", "#ebb400", "#852bfa"], // Customize this as needed
          },
          {
            title: "Task Statistics",
            series: taskSeries,
            labels: taskLabels,
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
