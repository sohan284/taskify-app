import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setFilter } from "../../store/features/projectSlice";
import { RxCross2 } from "react-icons/rx";

const SearchFilter = ({ searchQuery, setSearchQuery }) => {
  const dispatch = useDispatch();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      dispatch(setFilter(true));
    }
  };
  return (
    <div className="relative">
      <input
        type="text"
        className="border rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        style={{ padding: "8px", fontSize: "16px", width: "100%" }}
      />
      {searchQuery.length > 0 && (
        <div className="absolute top-3 p-0.5 border rounded-full text-white hover:bg-gray-500 bg-gray-300 right-3">
          <RxCross2
            onClick={() => setSearchQuery("")}
            style={{ fontSize: "12px" }}
          />
        </div>
      )}
    </div>
  );
};
SearchFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.string,
};

export default SearchFilter;
