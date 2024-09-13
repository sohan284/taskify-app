import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MdOutlineBusinessCenter } from "react-icons/md";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { IoMdAdd } from "react-icons/io";
import { IoGridSharp } from "react-icons/io5";
import { Checkbox, FormControlLabel } from "@mui/material";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import TodoManagement from "../../service/Todo";
import { useDispatch, useSelector } from "react-redux";
import { setResetProjects } from "../../store/features/projectSlice";
import CreateTodosDialog from "../TodosPage/CreateTodosDialog";
import { toast } from "react-toastify";
import moment from "moment";

const CustomChart = ({ title, series = [], labels = [], colors = [] }) => {
  CustomChart.propTypes = {
    title: PropTypes.string,
    series: PropTypes.array,
    colors: PropTypes.array,
    labels: PropTypes.array,
  };

  const resetProjects = useSelector((state) => state.project.resetProjects);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState([]);
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
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await TodoManagement.getTodosList();
        setTodos(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setResetProjects(false));
      }
    };

    fetchData();
  }, [resetProjects]);

  // Calculate the total series values
  const totalSeries = Array.isArray(series)
    ? series.reduce((acc, value) => acc + (value || 0), 0)
    : 0;

  const updateTodoStatus = async (id, status) => {
    try {
      await TodoManagement.updateTodoStatus(id, { status }).then(() =>
        dispatch(setResetProjects(true))
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? { ...todo, status } : todo))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleTodos = (id, currentStatus) => {
    updateTodoStatus(id, !currentStatus);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteTodos = (id) => {
    TodoManagement.deleteTodos(id)
      .then(() => {
        dispatch(setResetProjects(true));
        handleClose();
        toast.success("Todos Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the todos:", error);
      });
  };
  return (
    <div className="">
      {title === "Todos Overview" ? (
        <div className="flex justify-between">
          <p className="text-lg font-medium m-5 text-gray-500">{title}</p>
          <div className="mt-6 flex h-8">
            <div className="bg-[#6479f3] text-lg mr-1 px-3 pt-2 hover:text-xl rounded text-white">
              <IoMdAdd onClick={() => setOpen(true)} />
            </div>
            <div className="bg-[#6479f3] text-lg mr-5 px-3 pt-2 rounded hover:text-xl text-white">
              <IoGridSharp />
            </div>
          </div>
          <CreateTodosDialog open={open} onClose={handleClose} />
        </div>
      ) : (
        <p className="text-lg font-medium m-5 text-gray-500">{title}</p>
      )}
      <div className="w-96" id="chart">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
      {title === "Todos Overview" ? (
        <div className="ml-10 my-5">
          {todos.slice(0,5).map((todo, index) => (
            <div key={index}>
              <div className="text-[gray] flex justify-between w-[50%]">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => handleTodos(todo._id, todo.status)}
                      checked={todo.status}
                      sx={{
                        color: "#6479f3",
                        "&.Mui-checked": {
                          color: "#6479f3",
                        },
                      }}
                    />
                  }
                  label={todo.status ? <s>{todo.title}</s> : todo.title}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px", // Adjust font size of the label
                      fontWeight: "500", // Adjust width of the label
                    },
                  }}
                />

                <div className="flex mt-3">
                  <FaRegEdit
                    style={{
                      color: "#3f51b5",
                      fontSize: "16px",
                      marginRight: "20px",
                    }}
                  />
                  <RiDeleteBinLine
                    onClick={() => handleDeleteTodos(todo._id)}
                    style={{
                      color: "tomato",
                      fontSize: "16px",
                      marginRight: "20px",
                    }}
                  />
                </div>
              </div>
              <p className="text-xs ml-8 text-gray-400">
                {moment(todo?.date).format("MMMM D, YYYY hh:mm:ss A")}
              </p>
            </div>
          ))}
        </div>
      ) : (
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
      )}
      <div id="html-dist"></div>
    </div>
  );
};

export default CustomChart;
