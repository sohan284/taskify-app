import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  NativeSelect,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { setReloadPage } from "../../store/features/reloadSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import NoteManagement from "../../service/Note";

const UpdateNotesDialog = ({ open, onClose, note }) => {
  const [editorContent, setEditorContent] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    txColor: "",
    bgColor: "",
  });

  const [color, setColor] = useState({
    title: "Primary",
    txColor: "#5a5ace",
    bgColor: "#5a5ace65",
  });

  const colorSet = [
    { title: "Primary", txColor: "#6464d3", bgColor: "#5a5ace65" },
    { title: "Secondary", txColor: "#56565a", bgColor: "#56565a50" },
    { title: "Success", txColor: "#41ff7a", bgColor: "#acf8c370" },
    { title: "Danger", txColor: "#da370f", bgColor: "#fa6b6b50" },
    { title: "Warning", txColor: "#ffb111", bgColor: "#fad96b50" },
    { title: "Info", txColor: "#2cb7da", bgColor: "#4ef3eb5e" },
    { title: "Dark", txColor: "#313131", bgColor: "#31313150" },
  ];

  useEffect(() => {
    if (note) {
      setFormData({
        title: note?.title || "",
        txColor: note?.txColor || "",
        bgColor: note?.bgColor || "",
      });
      setEditorContent(note?.description || "");

      const selectedColor = colorSet.find((col) => col.title === note?.txColor);
      if (selectedColor) {
        setColor(selectedColor);
      }
    }
  }, [note]);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "align",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const updatedNote = {
      ...formData,
      description: editorContent,
      txColor: color?.txColor || formData.txColor,
      bgColor: color?.bgColor || formData.bgColor,
    };

    try {
      await NoteManagement.updateNote(note._id, updatedNote);
      toast.success("Note Updated Successfully");
      onClose();
      dispatch(setReloadPage(true));
    } catch (error) {
      toast.error("Error updating note");
      console.error("Error updating note:", error);
    }
  };

  const handleCreate = async () => {
    const newNote = {
      ...formData,
      description: editorContent,
      txColor: color?.txColor || "",
      bgColor: color?.bgColor || "",
      createdAt: new Date(),
    };

    try {
      await NoteManagement.createNote(newNote);
      toast.success("Note Created Successfully");
      onClose();
      setFormData({
        title: "",
        txColor: "",
        bgColor: "",
      });
      setEditorContent("");
      dispatch(setReloadPage(true));
    } catch (err) {
      toast.error("Error creating note");
      console.log(err);
    }
  };

  const handleChangeColor = (e) => {
    const selectedColor = colorSet.find((col) => col.title === e.target.value);
    setColor(selectedColor);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          width: "80%",
        },
      }}
      onClose={onClose}
    >
      <div className="flex justify-between">
        <DialogTitle>{note ? "Update Note" : "Create Note"}</DialogTitle>
        <IoMdClose
          className="hover:bg-[#130b0b] shadow-xl rounded-lg"
          onClick={onClose}
          style={{ margin: "20", fontSize: "26", color: "gray" }}
        />
      </div>

      <DialogContent>
        <div className="grid grid-cols-1 gap-5">
          <FormControl fullWidth margin="dense">
            <p className="text-xs text-gray-500">TITLE</p>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Enter title"
              name="title"
              type="text"
              size="small"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormControl>

          <div>
            <p className="text-xs text-gray-500">DESCRIPTION</p>
            <ReactQuill
              value={editorContent}
              onChange={handleEditorChange}
              modules={modules}
              formats={formats}
              placeholder="Please Enter Description..."
            />
          </div>

          <FormControl fullWidth margin="dense">
            <p className="text-xs mt-2 text-[#313131] text-gray-500">COLOR</p>
            <NativeSelect
              name="note"
              style={{
                fontSize: "12px",
                borderRadius: "5px",
                height: "36px",
                textAlign: "center",
                backgroundColor: color ? color.bgColor : "#5a5ace65",
                color: color ? color.txColor : "#5a5ace",
              }}
              disableUnderline={true}
              value={color?.title || ""}
              onChange={handleChangeColor}
            >
              {colorSet.map((el) => (
                <option
                  key={el.title}
                  style={{
                    backgroundColor: el.bgColor,
                    color: el.txColor,
                    textAlign: "center",
                  }}
                  value={el.title}
                >
                  {el.title}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
      </DialogContent>

      <DialogActions>
        <div className="border rounded-lg text-gray-600">
          <Button
            style={{ color: "gray", paddingInline: "20px" }}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <Button
          style={{
            color: "white",
            paddingInline: "20px",
            backgroundColor: "#3f51b5",
          }}
          onClick={note ? handleUpdate : handleCreate}
        >
          {note ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateNotesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    txColor: PropTypes.string,
    bgColor: PropTypes.string,
  }),
};

export default UpdateNotesDialog;
