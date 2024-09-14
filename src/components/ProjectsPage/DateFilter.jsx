import { DatePicker, Space } from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setFilter } from "../../store/features/projectSlice";

const { RangePicker } = DatePicker;

const DateFilter = ({ setDates, placeHolder }) => {
  const dispatch = useDispatch();
  const handleChange = (values) => {
    if (values && values.length === 2) {
      const [startDate, endDate] = values;
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");
      setDates([formattedStartDate, formattedEndDate]);
      dispatch(setFilter(true));
    } else {
      setDates([]);
    }
  };

  return (
    <Space direction="vertical" size={100}>
      <RangePicker placeholder={placeHolder} onChange={handleChange} />
    </Space>
  );
};
DateFilter.propTypes = {
  setDates: PropTypes.string.isRequired,
  placeHolder: PropTypes.string,
};

export default DateFilter;
