import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IoMdAdd } from "react-icons/io";
import { Checkbox, FormControlLabel } from "@mui/material";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaList, FaRegEdit } from "react-icons/fa";
import TodoManagement from "../../service/Todo";
import { useDispatch, useSelector } from "react-redux";
import { setPendingTodos } from "../../store/features/reloadSlice";
import CreateTodosDialog from "../TodosPage/CreateTodosDialog";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import {
  setReloadTodos,
  setTodos,
  setTodosCount,
} from "../../store/features/todoSlice";

const CustomChart = () => {
  const reloadTodos = useSelector((state) => state.todo.reloadTodos);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const todosCount = useSelector((state) => state.todo.todosCount);
  const todos = useSelector((state) => state.todo.todos);

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
    if (todos === null || reloadTodos) {
      const fetchData = async () => {
        try {
          const todosResult = await TodoManagement.getTodosList();
          dispatch(setTodos(todosResult.data));
          dispatch(
            setTodosCount([
              todosResult.statusCount.trueCount,
              todosResult.statusCount.falseCount,
            ])
          );
          dispatch(setPendingTodos(todosResult.statusCount.falseCount));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
          dispatch(setReloadTodos(false));
        }
      };

      fetchData();
    }
  }, [reloadTodos, todos, dispatch]);

  const updateTodoStatus = async (id, status) => {
    setLoading(true);
    try {
      await TodoManagement.updateTodoStatus(id, { status });
      dispatch(setReloadTodos(true));
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleTodos = (id, currentStatus) => {
    updateTodoStatus(id, !currentStatus);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteTodos = async (id) => {
    setLoading(true);
    try {
      await TodoManagement.deleteTodos(id);
      dispatch(setReloadTodos(true));
      handleClose();
      toast.success("Todo Deleted Successfully");
    } catch (error) {
      console.error("Error deleting the todo:", error);
      toast.error("Failed to delete the todo");
    } finally {
      setLoading(false);
    }
  };

  if (loading && todos === null) {
    return (
      <div className="flex flex-col justify-center h-96">
        <div className="flex justify-center">
          <PropagateLoader color="#6366F1" />
        </div>
      </div>
    );
  }

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
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "250px", width: "100%" }} // Adjust height as needed
        >
          {todos?.map((todo, index) => (
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
      </div>

      <div id="html-dist"></div>
    </div>
  );
};

export default CustomChart;
