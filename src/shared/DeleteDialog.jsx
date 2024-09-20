import PropTypes from "prop-types";
import { Dialog, DialogTitle } from "@mui/material";
import { Button } from "antd";
import { TiDeleteOutline } from "react-icons/ti";

const DeleteDialog = ({ open, handleClose, handleDelete, id }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="p-8 text-center">
        <div className="flex justify-center text-8xl text-[#ff4a44ec]">
          <TiDeleteOutline />
        </div>
        <DialogTitle id="alert-dialog-title">
          <p className="text-3xl text-gray-500"> {"Are you sure ?"}</p>
        </DialogTitle>
        <p className="text-center text-gray-400 text-sm px-10">
          Do you really want to delete these records? <br /> This process cannot
          be undone.
        </p>
        <div className="flex justify-center mt-5">
          <Button
            onClick={handleClose}
            style={{
              color: "white",
              margin: "10px",
              fontSize: "16px",
              paddingInline: "30px",
              backgroundColor: "gray",
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              color: "white",
              margin: "10px",
              fontSize: "16px",
              paddingInline: "30px",
              backgroundColor: "#ff4a44ec",
            }}
            onClick={() => handleDelete(id)}
            autoFocus
          >
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
DeleteDialog.propTypes = {
  open: PropTypes.string.isRequired,
  handleClose: PropTypes,
  handleDelete: PropTypes,
  id: PropTypes.string,
};

export default DeleteDialog;
