import { useEffect, useState } from "react";
import CustomCard from "../components/DashboardPage/CustomCard";
import CustomChart from "../components/DashboardPage/CustomChart";
import EventsTab from "../components/DashboardPage/EventsTab";
import ProjectsTasksTab from "../components/DashboardPage/ProjectsTasksTab";
import { getDashboardCount } from "../service/Dashboard";

function DashboardPage() {
  const [cardDetails, setCardDetails] = useState(null);
  const [setLoading] = useState(true);
  const [setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardCount();
        setCardDetails(result?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartDetails = [
    {
      title: "Project Statistics",
      series: [115, 75, 48, 15],
      labels: ["Started", "Default", "On Going", "In Review"],
      color: ["#70d100", "#00b9d1", "#ebb400", "#852bfa"],
    },
    {
      title: "Task Statistics",
      series: [20, 50, 38, 28],
      labels: ["Started", "Default", "On Going", "In Review"],
      color: ["#ebb400", "#852bfa", "#00b9d1", "#70d100"],
    },
    {
      title: "Todos Overview",
      series: [20, 50, 38, 28],
      labels: ["Apples", "Oranges", "Bananas"],
      color: ["#00b9d1", "#70d100", "#ebb400", "#852bfa"],
    },
  ];
  return (
    <div className="lg:ml-64 mt-20 sm:ml-64">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mx-3">
        {cardDetails?.map((detail) => (
          <div key={detail.title}>
            <CustomCard
              title={detail.title}
              color={detail.color}
              total={detail.total}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-3 mt-5">
        {chartDetails?.map((detail) => (
          <div key={detail.title} className="shadow-lg ">
            <CustomChart
              title={detail?.title}
              series={detail?.series}
              labels={detail?.labels}
              colors={detail?.color}
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
    </div>
  );
}
export default DashboardPage;
