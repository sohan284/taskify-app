import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import TodoManagement from "../../service/Todo";
import { useDispatch } from "react-redux";
import Loading from "../../shared/Loading";
import { setReloadTodos } from "../../store/features/todoSlice";

const TodosTable = ({ todos = [], setTodos }) => {
  const dispatch = useDispatch();

  const updateTodoStatus = async (id, status) => {
    try {
      await TodoManagement.updateTodoStatus(id, { status });
      // Updating todos state in a serializable way by using a new array
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, status } : todo
      );
      dispatch(setTodos(updatedTodos));
      dispatch(setReloadTodos(true));
    } catch (err) {
      console.error("Error updating todo status:", err);
    }
  };

  const handleTodos = (id, currentStatus) => {
    updateTodoStatus(id, !currentStatus); // Toggle status
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
            <TableCell style={{ fontSize: "12px", color: "gray" }}>
              ID
            </TableCell>
            <TableCell style={{ fontSize: "12px", color: "gray" }}>
              TODO
            </TableCell>
            <TableCell style={{ fontSize: "12px", color: "gray" }}>
              PRIORITY
            </TableCell>
            <TableCell style={{ fontSize: "12px", color: "gray" }}>
              DESCRIPTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(todos) && todos.length > 0 ? (
            todos?.map((todo, index) => (
              <TableRow
                key={todo._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="p-2">
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
                            fontSize: "16px",
                            fontWeight: "500",
                          },
                        }}
                      />
                    </div>
                    <p className="text-xs ml-8 text-gray-400">
                      {moment(todo?.date).format("MMMM D, YYYY hh:mm:ss A")}
                    </p>
                  </div>
                </TableCell>
                {todo.priority === "Medium" ? (
                  <TableCell>
                    <p className="bg-yellow-100 text-[#ff9100] text-center rounded font-medium uppercase py-1">
                      {todo.priority}
                    </p>
                  </TableCell>
                ) : todo.priority === "Low" ? (
                  <TableCell>
                    <p className="bg-green-100 text-[#00b109] text-center rounded font-medium uppercase py-1">
                      {todo.priority}
                    </p>
                  </TableCell>
                ) : todo.priority === "High" ? (
                  <TableCell>
                    <p className="bg-red-100 text-[#ff4800] text-center rounded font-medium uppercase py-1">
                      {todo.priority}
                    </p>
                  </TableCell>
                ) : (
                  <TableCell>{todo.priority}</TableCell>
                )}
                <TableCell>{todo.description}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Loading />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TodosTable.propTypes = {
  setTodos: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      description: PropTypes.string,
      date: PropTypes.string,
      status: PropTypes.bool.isRequired,
    })
  ),
};

export default TodosTable;
