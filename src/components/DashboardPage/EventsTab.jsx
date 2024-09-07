import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CakeIcon from "@mui/icons-material/Cake";
import HomeIcon from "@mui/icons-material/Home";
import EventsTable from "./EventsTable";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function CustomTabPanel2(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
CustomTabPanel2.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function EventsTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={<CakeIcon style={{ color: "lightgreen" }} />}
            iconPosition="start"
            label="Upcoming Birthdays"
            value={0}
          />
          <Tab
            icon={<StarOutlineIcon style={{ color: "#8761df" }} />}
            iconPosition="start"
            label="Upcoming Work Anniversaries"
            value={1}
          />
          <Tab
            icon={<HomeIcon style={{ color: " #FF474C" }} />}
            iconPosition="start"
            label="Members on Leave"
            value={2}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab iconPosition="start" label="List" value={0} />
            <Tab iconPosition="start" label="Calender" value={2} />
          </Tabs>
        </Box>
        <CustomTabPanel2>
          <EventsTable />
        </CustomTabPanel2>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}></CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
