import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import GroupIcon from "@mui/icons-material/Group";
import PropTypes from "prop-types";
import { PiUserListFill } from "react-icons/pi";
import { useTranslation } from "react-i18next"; // Import useTranslation

function CustomCard({ title, total, color }) {
  const { t } = useTranslation(); // Initialize the translation function

  CustomCard.propTypes = {
    title: PropTypes.oneOf(["Projects", "Tasks", "Users"]).isRequired,
    total: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  };

  return (
    <div className="shadow-lg p-5 rounded-lg">
      {title === "Projects" ? (
        <BusinessCenterIcon style={{ color: color }} />
      ) : title === "Tasks" ? (
        <AssignmentTurnedInIcon style={{ color: color }} />
      ) : (
        <PiUserListFill style={{ fontSize: "28px", color: color }} />
      )}
      <h2 className="text-gray-500 mt-5 text-[16px] font-semibold">
        {t("total")} {t(title.toLowerCase())} {/* Use t for translation */}
      </h2>
      <p className="text-2xl font my-2 font-medium text-gray-500">{total}</p>
      <button style={{ color: color }} className={`text-sm font-semibold`}>
        <ArrowForwardIcon style={{ fontSize: 16, color: color }} /> {t("view")}{" "}
        {/* Use t for button label */}
      </button>
    </div>
  );
}

export default CustomCard;
