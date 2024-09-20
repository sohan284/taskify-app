import { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import TodoManagement from "../service/Todo";
import TodosTable from "../components/TodosPage/TodosTable";
import CreateTodosDialog from "../components/TodosPage/CreateTodosDialog";
import { useDispatch, useSelector } from "react-redux";
import { setReloadPage } from "../store/features/projectSlice";

const TodosPage = () => {
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState(null);
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    navigate(`${event}`);
  }

  const breadcrumbs = [
    <Link
      style={{ fontWeight: 400 }}
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => handleClick("/")}
    >
      Home
    </Link>,
    <Link style={{ fontWeight: 500 }} underline="none" key="2" color="inherit">
      Todos
    </Link>,
  ];

  const onclose = () => {
    setOpen(false);
  };

  useEffect(() => {
    TodoManagement.getTodosList().then((res) => setTodos(res?.data));
    dispatch(setReloadPage(false));
  }, [reloadPage]);

  return (
    <div className="lg:ml-64 mt-20 mx-2 sm:ml-64">
      <div className="flex justify-between">
        <Stack className="py-5" spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <div className="mt-6 flex h-8">
          <div
            onClick={() => setOpen(true)}
            className="bg-[#6479f3] text-lg mr-5 px-3 pt-2 hover:text-xl rounded   shadow-lg text-white"
          >
            <IoMdAdd />
          </div>
        </div>
      </div>

      <div className="mr-5 shadow-lg mb-10">
        <TodosTable todos={todos} setTodos={setTodos} />
      </div>
      <div>
        <CreateTodosDialog open={open} onClose={onclose} />
      </div>
    </div>
  );
};

export default TodosPage;
