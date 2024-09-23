import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IoMdAdd } from "react-icons/io";
import { Checkbox, FormControlLabel } from "@mui/material";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaList, FaRegEdit } from "react-icons/fa";
import TodoManagement from "../../service/Todo";
import { useDispatch, useSelector } from "react-redux";
import {
  setPendingTodos,
  setResetTodos,
} from "../../store/features/reloadSlice";
import CreateTodosDialog from "../TodosPage/CreateTodosDialog";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { setReloadTodos } from "../../store/features/todoSlice";

const CustomChart = () => {
  const resetTodos = useSelector((state) => state.reload.resetTodos);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [todosCount, setTodosCount] = useState();
  const [options] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Done", "Pending"],
    colors: ["#57bb29", "#df3b3b"],
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosResult = await TodoManagement.getTodosList();
        setTodos(todosResult.data),
          setTodosCount([
            todosResult.statusCount.trueCount,
            todosResult.statusCount.falseCount,
          ]),
          dispatch(setPendingTodos(todosResult.statusCount.falseCount));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        dispatch(setResetTodos(false));
      }
    };

    fetchData();
  }, [resetTodos]);

  const updateTodoStatus = async (id, status) => {
    setLoading(true);
    try {
      await TodoManagement.updateTodoStatus(id, { status }).then(
        () => dispatch(setReloadTodos(true)),
        dispatch(setResetTodos(true))
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
    setLoading(true);
    TodoManagement.deleteTodos(id)
      .then(() => {
        dispatch(setReloadTodos(true));
        dispatch(setResetTodos(true));
        handleClose();
        toast.success("Todos Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the todos:", error);
      });
  };
  if (loading)
    return (
      <div className="flex flex-col justify-center h-96">
        <div className="flex justify-center">
          <PropagateLoader
            color="#6366F1"
            // size={100}
          />
        </div>
      </div>
    );

  return (
    <div className="shadow-xl">
      <div className="flex justify-between">
        <p className="text-lg font-medium m-5 text-gray-500">Todos Overview</p>
        <div className="mt-6 flex h-8">
          <div className="bg-[#6479f3] text-lg mr-1 px-3 pt-2 hover:text-xl rounded text-white">
            <IoMdAdd onClick={() => setOpen(true)} />
          </div>
          <div className="bg-[#6479f3] text-xs mr-5 px-3 pt-2.5 rounded hover:text-sm text-white">
            <FaList onClick={() => navigate("/todos")} />
          </div>
        </div>
        <CreateTodosDialog open={open} onClose={handleClose} />
      </div>

      <div className="w-96" id="chart">
        <ReactApexChart options={options} series={todosCount} type="donut" />
      </div>
      <div className="ml-10 my-5">
        {todos.slice(0, 5).map((todo, index) => (
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

      <div id="html-dist"></div>
    </div>
  );
};

export default CustomChart;
