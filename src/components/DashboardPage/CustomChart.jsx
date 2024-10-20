import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MdOutlineBusinessCenter } from "react-icons/md";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { t } from "i18next";
import Loading from "../../shared/Loading";

const CustomChart = ({
  title,
  series = [],
  labels = [],
  colors = [],
  loading,
}) => {
  CustomChart.propTypes = {
    title: PropTypes.string,
    series: PropTypes.array,
    colors: PropTypes.array,
    labels: PropTypes.array,
    loading: PropTypes.bool, // Use bool for loading
  };

  const [options] = useState({
    chart: {
      type: "donut",
    },
    labels: labels || [],
    colors: colors || [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  // Calculate the total series values
  const totalSeries = Array.isArray(series)
    ? series.reduce((acc, value) => acc + (value || 0), 0)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <p className="text-lg font-medium m-5 text-gray-500">
        {title === "Projects" ? t("projects") : t("tasks")} {t("statistics")}
      </p>
      <div className="w-96" id="chart">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>

      <div className="m-5 text-gray-400 font-medium">
        {labels?.map((label, index) => (
          <div className="flex justify-between my-2" key={index}>
            {title === "Project Statistics" ? (
              <MdOutlineBusinessCenter
                style={{ color: colors[index] || "#000" }}
                className="bg-[#ebe3ff] rounded p-0.5 text-2xl"
              />
            ) : (
              <AssignmentTurnedInOutlinedIcon
                style={{ color: colors[index] || "#000" }}
                className="bg-[#ebe3ff] rounded p-0.5"
              />
            )}
            <p>{label || "N/A"}</p>
            <p>{series[index] !== undefined ? series[index] : "N/A"}</p>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <MenuIcon
            style={{ color: "#8761df" }}
            className="bg-[#ebe3ff] rounded p-0.5"
          />
          <p>Total</p>
          <p>{totalSeries}</p>
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default CustomChart;
