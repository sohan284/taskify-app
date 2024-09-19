import { DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";

const CloseDialog = ({ title, handleClose }) => {
  return (
    <div className="flex justify-between">
      <DialogTitle>{title}</DialogTitle>
      <IoMdClose
        className="shadow-xl rounded-lg text-gray-500 bg-white"
        onClick={handleClose}
        style={{ margin: "-10px", fontSize: "28px", padding: "5px" }}
        onMouseEnter={(e) => (e.currentTarget.style.margin = "-7px")}
        onMouseLeave={(e) => (e.currentTarget.style.margin = "-10px")}
      />
    </div>
  );
};
CloseDialog.propTypes = {
  handleClose: PropTypes,
  title: PropTypes.string,
};

export default CloseDialog;
