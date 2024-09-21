import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
import EventsTab from "../components/DashboardPage/EventsTab";
import ProjectsTasksTab from "../components/DashboardPage/ProjectsTasksTab";
import ProjectManagement from "../service/Project";
import { useDispatch, useSelector } from "react-redux";
import { setReloadPage } from "../store/features/projectSlice";
import Loading from "../shared/Loading";
import TaskManagement from "../service/Task";
import auth from "../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import UserManagement from "../service/User";
import { setCreateUser } from "../store/features/userSlice";
import TodoManagement from "../service/Todo";
import StatusManagement from "../service/Status";
import { setPendingTodos } from "../store/features/reloadSlice";

function DashboardPage() {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const createUser = useSelector((state) => state.user.createUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [clientCount, setClientCount] = useState(null);
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
      total: userCount,
      color: "#ebb400",
    },
    {
      _id: "66dbda4e634dfb28c415b5cb",
      title: "Clients",
      total: clientCount,
      color: "#00b9d1",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch all data concurrently
        const [projectResult, taskResult, todosResult, userResult] =
          await Promise.all([
            ProjectManagement.getProjectList(),
            TaskManagement.getTaskList(),
            TodoManagement.getTodosList(),
            UserManagement.getUserList(),
          ]);

        const projects = projectResult?.data || [];
        const tasks = taskResult?.data || [];
        const { trueCount, falseCount } = todosResult.statusCount;
        const users = userResult.data || [];

        // Set counts
        setProjectCount(projects.length);
        setTaskCount(tasks.length);
        setUserCount(users.length);
        setClientCount(
          await UserManagement.getUserList("client").then(
            (res) => res.data.length
          )
        );

        // Aggregate data for projects
        const projectsCounts = projects.reduce((acc, project) => {
          const status = project.status?.title;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const statusResult = await StatusManagement.getStatusList();
        const projectLabels = statusResult.data.map((status) => status.title);
        const projectColors = statusResult.data.map((status) => status.txColor);
        const projectSeries = projectLabels.map(
          (label) => projectsCounts[label] || 0
        );

        // Aggregate data for tasks
        const taskCounts = tasks.reduce((acc, task) => {
          const status = task.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const taskLabels = Object.keys(taskCounts);
        const taskSeries = Object.values(taskCounts);

        // Set chart details
        setChartDetails([
          {
            title: "Project Statistics",
            series: projectSeries,
            labels: projectLabels,
            colors: projectColors,
          },
          {
            title: "Task Statistics",
            series: taskSeries,
            labels: taskLabels,
            colors: ["#ebb400", "#852bfa", "#00b9d1", "#70d100"],
          },
          {
            title: "Todos Overview",
            series: [trueCount, falseCount],
            labels: ["Done", "Pending"],
            colors: ["#57bb29", "#df3b3b"],
          },
        ]);

        // Dispatch pending todos count
        dispatch(setPendingTodos(falseCount));

        // Check if the user already exists and create if not
        if (user) {
          const existingUser = users.find((u) => u.email === user.email);
          const userData = {
            email: user.email,
            photoURL: user.photoURL || "",
            displayName: user.displayName || "",
          };

          if (!existingUser && createUser) {
            await UserManagement.upsertUser(userData);
            dispatch(setCreateUser(false));
            console.log("User data posted successfully");
          } else {
            console.log("User already exists, skipping creation.");
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        dispatch(setReloadPage(false));
      }
    };

    fetchData();
  }, [reloadPage, dispatch]);

  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      {loading ? (
        <div className="mt-[50%]">
          <Loading />
        </div>
      ) : error ? (
        <div>Error loading data: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 text-[#df3b3b] lg:grid-cols-4 gap-5 mx-3">
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
