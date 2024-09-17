import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import CreateNotesDialog from "../components/NotesPage/CreateNotesDialog";
import NoteManagement from "../service/Note";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { setReloadPage } from "../store/features/reloadSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../shared/Loading";

const NotesPage = () => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const dispatch = useDispatch();
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
    <Link
      style={{ fontWeight: 500 }}
      underline="hover"
      key="2"
      color="black"
      href="/notes"
      onClick={() => handleClick("/notes")}
    >
      Notes
    </Link>,
  ];

  useEffect(() => {
    NoteManagement.getNotes().then(
      (res) => setNotes(res.data),
      dispatch(setReloadPage(false), setLoading(false))
    );
  }, [reloadPage]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteNote = (id) => {
    NoteManagement.deleteNote(id).then(
      () => dispatch(setReloadPage(true)),
      toast.success("Note Deleted Successfully")
    );
  };
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

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
            className="bg-[#6479f3] text-lg mr-1 px-3 pt-2 hover:text-xl rounded text-white"
          >
            <IoMdAdd />
          </div>
        </div>
      </div>
      <div className="p-5 relative flex flex-wrap mt-4 shadow-xl bg-slate-50 border-t">
        {notes?.map((note) => {
          // Rotate cards randomly
          const rotation =
            Math.random() < 0.5 ? "rotate(-5deg)" : "rotate(5deg)";

          return (
            <div
              key={note._id}
              className="p-5"
              style={{
                width: "30%", // Adjust as needed
                transform: rotation,
                transformOrigin: "center center", // Ensures consistent rotation origin
                overflow: "hidden", // To handle content overflow
              }}
            >
              <div
                className="flex justify-end pt-2 pr-2"
                style={{ backgroundColor: note?.bgColor }}
              >
                <div className="bg-[#6479f3] hover:bg-[#3853eb] inline-block p-1 px-2 m-1 rounded text-white">
                  <FaRegEdit />
                </div>

                <div
                  onClick={() => handleDeleteNote(note?._id)}
                  className="bg-[#ee3a2d] m-1 text-lg p-1 px-2 rounded hover:bg-[red] text-white"
                >
                  <RiDeleteBinLine />
                </div>
              </div>

              <p className="p-5" style={{ backgroundColor: note?.bgColor }}>
                {note?.title}
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: note?.description }}
                className="quill-content px-5 overflow-auto"
                style={{ backgroundColor: note?.bgColor }}
              ></div>
              <div
                style={{ backgroundColor: note?.bgColor }}
                className="text-blue-500 px-5 py-5 text-sm font-medium"
              >
                <p className="font-bold text-black">Created At:</p>{" "}
                {moment(note?.createdAt).format("MMMM D, YYYY hh:mm:ss A")}
              </div>
            </div>
          );
        })}
      </div>

      <CreateNotesDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default NotesPage;
