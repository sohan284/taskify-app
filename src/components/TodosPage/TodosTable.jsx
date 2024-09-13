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
import { setReloadPage } from "../../store/features/projectSlice";

const TodosTable = ({ todos, setTodos }) => {
  const dispatch = useDispatch();
  const updateTodoStatus = async (id, status) => {
    try {
      await TodoManagement.updateTodoStatus(id, { status }).then(() =>
        dispatch(setReloadPage(true))
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
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
            <TableCell>TODO</TableCell>
            <TableCell>PRIORITY</TableCell>
            <TableCell>DESCRIPTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos?.length ? (
            todos?.map((todo) => (
              <TableRow
                key={todo.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderBottom: "1px solid #e0e0e0", // Adding border to each row
                }}
              >
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
                    <p className="bg-yellow-100 text-[#ff9100] text-center rounded font-semibold uppercase py-1">
                      {todo.priority}
                    </p>
                  </TableCell>
                ) : todo.priority === "Low" ? (
                  <TableCell>
                    <p className="bg-green-100 text-[#00b109] text-center rounded font-semibold uppercase py-1">
                      {todo.priority}
                    </p>
                  </TableCell>
                ) : todo.priority === "High" ? (
                  <TableCell>
                    <p className="bg-red-100 text-[#ff4800] text-center rounded font-semibold uppercase py-1">
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
                No todos available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TodosTable.propTypes = {
  setTodos: PropTypes.any,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      description: PropTypes.string,
      date: PropTypes.string, // Add date field if it's part of the data
      status: PropTypes.bool.isRequired, // Add status field for checkbox
    })
  ),
};

export default TodosTable;
