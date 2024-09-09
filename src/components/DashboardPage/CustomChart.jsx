import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";

const CustomChart = ({ title, series = [], labels = [], colors = [] }) => {
  CustomChart.propTypes = {
    title: PropTypes.string,
    series: PropTypes.array,
    colors: PropTypes.array,
    labels: PropTypes.array,
  };
  const [options] = useState({
    chart: {
      type: "donut",
    },
    labels: labels || [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
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
  return (
    <div className="">
      <p className="text-lg font-medium font m-5 text-gray-500">{title}</p>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
      <div className="m-5 text-gray-400 font-medium">
        {labels?.map((label, index) => (
          <div className="flex justify-between my-2" key={index}>
            {title === "Project Statistics" ? (
              <WorkOutlineIcon
                style={{ color: colors[index] || "#000" }} // Ensures a fallback color if undefined
                className="bg-[#ebe3ff] rounded p-0.5"
              />
            ) : (
              <AssignmentTurnedInOutlinedIcon
                style={{ color: colors[index] || "#000" }} // Ensures a fallback color if undefined
                className="bg-[#ebe3ff] rounded p-0.5"
              />
            )}
            <p>{label || "N/A"}</p> {/* Handles undefined labels */}
            <p>{series[index] !== undefined ? series[index] : "N/A"}</p>{" "}
            {/* Handles undefined series values */}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <MenuIcon
            style={{ color: "#8761df" }}
            className="bg-[#ebe3ff] rounded p-0.5"
          />
          <p>Total</p>
          <p>{totalSeries}</p> {/* Display the total series value */}
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default CustomChart;
