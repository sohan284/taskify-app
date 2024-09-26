import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
// import EventsTab from "../components/DashboardPage/EventsTab";
import ProjectsTasksTab from "../components/DashboardPage/ProjectsTasksTab";
import ProjectManagement from "../service/Project";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../shared/Loading";
import TaskManagement from "../service/Task";
import auth from "../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import UserManagement from "../service/User";
import { setCreateUser } from "../store/features/userSlice";
import StatusManagement from "../service/Status";
import TodosChart from "../components/DashboardPage/TodosChart";
import {
  setChartDetails,
  setClientsCount,
  setProjectsCount,
  setReloadDashboard,
  setTasksCount,
  setUsersCount,
} from "../store/features/dashboardSlice";

function DashboardPage() {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const createUser = useSelector((state) => state.user.createUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboard = useSelector((state) => state.dashboard);
  let cardDetails = [
    {
      title: "Projects",
      total: dashboard?.projectsCount,
      color: "#70d100",
    },
    {
      title: "Tasks",
      total: dashboard.tasksCount,
      color: "#852bfa",
    },
    {
      title: "Users",
      total: dashboard?.usersCount,
      color: "#ebb400",
    },
    {
      _id: "66dbda4e634dfb28c415b5cb",
      title: "Clients",
      total: dashboard?.clientsCount,
      color: "#00b9d1",
    },
  ];

  useEffect(() => {
    if (dashboard.reloadDashboard || reloadPage || createUser) {
      const fetchData = async () => {
        try {
          setLoading(true); // Start loading
          // Fetch all data concurrently
          const [projectResult, taskResult, userResult, clientResult] =
            await Promise.all([
              ProjectManagement.getProjectList(),
              TaskManagement.getTaskList(),
              UserManagement.getUserList(),
              UserManagement.getUserList("client"),
            ]);

          const projects = projectResult?.data || [];
          const tasks = taskResult?.data || [];
          const users = userResult.data || [];
          const clients = clientResult?.data || [];

          // Set counts
          dispatch(setProjectsCount(projects?.length));
          dispatch(setUsersCount(users?.length));
          dispatch(setTasksCount(tasks?.length));
          dispatch(setClientsCount(clients?.length));

          // Fetch status lists for both projects and tasks
          const statusResult = await StatusManagement.getStatusList();

          // Aggregate data for projects
          const projectsCounts = projects.reduce((acc, project) => {
            const status = project.status?.title;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const projectLabels = statusResult.data.map((status) => status.title);
          const projectColors = statusResult.data.map(
            (status) => status.txColor
          );
          const projectSeries = projectLabels.map(
            (label) => projectsCounts[label] || 0
          );

          // Aggregate data for tasks
          const tasksCounts = tasks.reduce((acc, task) => {
            const status = task.status?.title;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const taskLabels = statusResult.data.map((status) => status.title);
          const taskSeries = taskLabels.map((label) => tasksCounts[label] || 0);

          // Set chart details

          dispatch(
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
                colors: projectColors, // You can use the same colors for both
              },
            ])
          );

          // Check if the user already exists and create if not
          if (user) {
            const existingUser = users.find((u) => u.email === user.email);
            const userData = {
              email: user.email,
              photoURL: user.photoURL || "",
              displayName: user.displayName || "",
              role: "user",
              
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
          dispatch(setReloadDashboard(false));
        }
      };
      fetchData();
    }
  }, [reloadPage, dispatch, createUser]);

  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      {loading && reloadPage ? (
        <div>
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
            {dashboard?.chartDetails?.map((detail) => (
              <div key={detail.title} className="shadow-lg">
                <CustomChart
                  title={detail?.title}
                  series={detail?.series}
                  labels={detail?.labels}
                  colors={detail?.colors}
                />
              </div>
            ))}
            <TodosChart />
          </div>
          <div>{/* <EventsTab /> */}</div>
          <div>
            <ProjectsTasksTab />
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
