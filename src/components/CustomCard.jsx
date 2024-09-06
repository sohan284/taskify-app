import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupIcon from "@mui/icons-material/Group";

function CustomCard({ title, total, color }) {
  return (
    <div className="shadow-lg p-5 rounded-lg">
      {title == "Projects" ? (
        <BusinessCenterIcon style={{ color: color }} />
      ) : title === "Tasks" ? (
        <AssignmentTurnedInIcon style={{ color: color }} />
      ) : (
        <GroupIcon style={{ color: color }} />
      )}
      <h2 className="text-gray-500 mt-5 text-[16px] text- font-semibold">
        Total {title}
      </h2>
      <p className="text-2xl font my-2 font-medium text-gray-500">{total}</p>
      <button style={{ color: color }} className={`text-sm font-semibold`}>
      <ArrowForwardIcon style={{ fontSize: 16, color: color }} /> View More 
      </button>
    </div>
  );
}
export default CustomCard;
