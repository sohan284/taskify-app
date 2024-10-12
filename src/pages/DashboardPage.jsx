import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
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
import { useTranslation } from "react-i18next";

function DashboardPage() {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const createUser = useSelector((state) => state.user.createUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dashboard = useSelector((state) => state.dashboard);

  // Card details for the dashboard
  const cardDetails = [
    {
      title: t("projects"),
      total: dashboard?.projectsCount,
      color: "#70d100",
    },
    {
      title: t("tasks"),
      total: dashboard.tasksCount,
      color: "#852bfa",
    },
    {
      title: t("users"),
      total: dashboard?.usersCount,
      color: "#ebb400",
    },
    {
      _id: "66dbda4e634dfb28c415b5cb",
      title: t("clients"),
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
                title: "Projects",
                series: projectSeries,
                labels: projectLabels,
                colors: projectColors,
              },
              {
                title: "Tasks",
                series: taskSeries,
                labels: taskLabels,
                colors: projectColors,
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
          setLoading(false); // Stop loading after all operations
          dispatch(setReloadDashboard(false));
        }
      };

      fetchData();
    }
  }, [dashboard.reloadDashboard, dispatch, createUser]);

  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      {loading && reloadPage ? (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading data: {error.message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 text-[#df3b3b] lg:grid-cols-4 gap-5 mx-3 mb-5">
            {cardDetails.length > 0 ? (
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
              <div className="text-center col-span-4">No data available</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-3 mt-5">
            <div className="shadow-lg rounded-xl p-4">
              <CustomChart
                title="Projects"
                series={dashboard.chartDetails[0]?.series}
                labels={dashboard.chartDetails[0]?.labels}
                colors={dashboard.chartDetails[0]?.colors}
                loading={loading}
              />
            </div>
            <div className="shadow-lg rounded-xl p-4">
              <CustomChart
                title="Tasks"
                series={dashboard.chartDetails[1]?.series}
                labels={dashboard.chartDetails[1]?.labels}
                colors={dashboard.chartDetails[1]?.colors}
                loading={loading}
              />
            </div>
            <TodosChart />
          </div>

          <div className="mt-5">
            <ProjectsTasksTab />
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
