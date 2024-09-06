import CustomCard from "../components/CustomCard";
import CustomChart from "../components/CustomChart";

function DashboardPage() {
  const cardDetails = [
    {
      title: "Projects",
      total: "250",
      color: "#70d100",
    },
    {
      title: "Tasks",
      total: "250",
      color: "#852bfa",
    },
    {
      title: "Users",
      total: "250",
      color: "#ebb400",
    },
    {
      title: "Clients",
      total: "250",
      color: "#00b9d1",
    },
  ];
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
    </div>
  );
}
export default DashboardPage;
