import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ProjectsTable from "../ProjectsPage/ProjectsTable";
import ProjectManagement from "../../service/Project";
import TasksTable from "../TasksPage/TasksTable";
import TaskManagement from "../../service/Task";

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

export default function ProjectsTasksTab() {
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
            icon={
              <BusinessCenterOutlinedIcon style={{ color: "lightgreen" }} />
            }
            iconPosition="start"
            label="Projects"
            value={0}
          />
          <Tab
            icon={
              <AssignmentTurnedInOutlinedIcon style={{ color: "#8761df" }} />
            }
            iconPosition="start"
            label="Tasks"
            value={1}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <h1 className="text-xl font-bold text-gray-500">
          {"Admin's Projects"}
        </h1>
        <ProjectsTable API={ProjectManagement.getProjectList} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <h1 className="text-xl font-bold text-gray-500">{"Admin's Tasks"}</h1>
        <TasksTable API={TaskManagement.getTaskList} />
      </CustomTabPanel>
    </Box>
  );
}
